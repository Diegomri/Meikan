import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// --- INTERFACES ---
interface User {
    id: string;
    email: string;
    roles: string[];
    firstName: string;
    lastName: string;
    fullName: string;
    street: string;
    address: string;
    city: string;
    phone: string;
}
interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    street: string;
    address: string;
    city: string;
    phone: string;
}
interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (data: RegisterData) => Promise<boolean>;
    updateUserContext: (updatedUserData: User) => void; // <-- NUEVA FUNCIÓN
}
interface AuthProviderProps { children: ReactNode; }

const AuthContext = createContext<AuthContextType | null>(null);
const BASE_URL = 'https://localhost:7032';

// --- EL INTERCEPTOR DE AXIOS (EL VIGILANTE) ---
// Esta configuración se aplica globalmente a CADA petición y respuesta de Axios.
// Se define FUERA del componente para que se configure solo una vez.
axios.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa (código 2xx), no hagas nada, solo pásala.
  (error) => {
    // Si la respuesta es un error...
    console.log('AXIOS INTERCEPTOR: Error detectado.', error.response?.status, error.message);
    const originalRequest = error.config;

    // Comprueba si el error es un 401 (Unauthorized) y que no sea un reintento.
    // Esto es clave para evitar bucles infinitos.
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      console.log('Token expirado o inválido detectado por el interceptor.');
      
      // En un sistema con REFRESH TOKENS, aquí iría la lógica para refrescar.
      // En nuestro caso, simplemente cerraremos la sesión.
      // Para comunicarnos con el AuthContext de forma segura, disparamos un evento global.
      window.dispatchEvent(new Event('token-expired'));
    }
    
    // Devuelve el error para que el `catch` original de la llamada también pueda manejarlo si es necesario.
    return Promise.reject(error);
  }
);


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        console.log('Ejecutando logout...');
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    // --- EFECTO #1: REACCIONAR AL EVENTO DE EXPIRACIÓN ---
    // Este efecto escucha el "flare gun" disparado por el interceptor.
    useEffect(() => {
        const handleTokenExpired = () => {
            logout();
        };

        window.addEventListener('token-expired', handleTokenExpired);

        // Limpieza: es crucial remover el listener para evitar memory leaks.
        return () => {
            window.removeEventListener('token-expired', handleTokenExpired);
        };
    }, [logout]); // Depende de `logout` para tener siempre la última versión de la función.

    // --- EFECTO #2: SINCRONIZAR ESTADO CON AXIOS Y LOCALSTORAGE ---
    // Este efecto se ejecuta cada vez que el token cambia.
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('token', token);
                try {
                    const response = await axios.get(`${BASE_URL}/api/account/info`);
                    setUser(response.data);
                } catch (error) {
                    // Si el token almacenado es inválido al cargar la página, lo limpiamos.
                    logout();
                }
            } else {
                // Asegurarse de que todo está limpio si no hay token.
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };
        initializeAuth();
    }, [token, logout]);

    useEffect(() => {
        // Creamos un ID de interceptor para poder limpiarlo después.
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.log("Interceptor: 401 detectado, llamando a logout.");
                    logout(); // Llama directamente a logout
                }
                return Promise.reject(error);
            }
        );

        // Función de limpieza: se ejecuta cuando el componente se desmonta.
        // Esto es crucial para evitar múltiples interceptores si el componente se re-renderiza.
        return () => {
            axios.interceptors.response.eject(interceptorId);
        };
    }, [logout]); // La dependencia `logout` asegura que siempre use la última versión de la función.




    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, { email, password });
            if (response.data?.token) {
                setToken(response.data.token); // Dispara el Efecto #2 para configurar todo
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }, []);
    
    const register = useCallback(async (data: RegisterData): Promise<boolean> => { 
         setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/register`, data);
            
            return response.status === 200;
            
        } catch (error) {
            console.error("Error en registro:", error);
            return false;
        } finally {
            setLoading(false);
        }    
    }, []);

    const updateUserContext = useCallback((updatedUserData: User) => {
        setUser(updatedUserData);
    }, []);

    const value = useMemo(() => ({
        user, token, loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.roles.includes('admin') ?? false,
        login, logout, register,
        updateUserContext // <-- AÑADIR AL VALOR DEL CONTEXTO
    }), [user, token, loading, login, logout, register, updateUserContext]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    return context;
};