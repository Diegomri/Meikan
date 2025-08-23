import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Navigate } from 'react-router-dom';

const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> );

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, loading, isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to="/account" replace />;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("Por favor, ingresa tu correo y contraseña.");
            return;
        }
        try {
            const success = await login(email, password);
            if (!success) {
                setError("Credenciales incorrectas. Por favor, verifica tus datos.");
            }
        } catch (err) {
            setError("Ocurrió un error en el servidor. Inténtalo más tarde.");
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557244128-a3c1858a8a47?auto=format&fit=crop&q=80&w=2574')" }}
        >
            <div className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl">
                
                <div className="text-center">
                    <h2 className="text-4xl font-bold font-display tracking-wider text-meikan-charcoal">
                        M E I K A N
                    </h2>
                    <p className="mt-2 text-gray-500 font-sans">Bienvenido a tu espacio de belleza espiritual.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input de Correo */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <MailIcon />
                        </span>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meikan-teal focus:border-transparent transition"
                            placeholder="Correo Electrónico"
                            autoComplete="email"
                        />
                    </div>

                    {/* Input de Contraseña */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockIcon />
                        </span>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meikan-teal focus:border-transparent transition"
                            placeholder="Contraseña"
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Botón de Iniciar Sesión */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-bold font-display tracking-wide text-white bg-meikan-teal rounded-lg hover:bg-meikan-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meikan-teal transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-3 mt-4 text-sm text-center text-red-800 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <div className="text-center text-sm text-gray-500">
                    <p>
                        ¿Aún no tienes una cuenta?{' '}
                        <span onClick={() => navigate('/register')} className="font-bold text-meikan-teal hover:underline cursor-pointer">
                            Regístrate
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;