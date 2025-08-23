import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round"
    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> );
const MapPinIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> );
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg> );
const ExclamationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-6 h-6 mr-3 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-6 h-6 mr-3 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [address, setAddress] = useState('');
    const [countryCode, setCountryCode] = useState('+58');
    const [localPhone, setLocalPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { register, loading, isAuthenticated } = useAuth();

    if (isAuthenticated) return <Navigate to="/account" replace />;

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\d{7,10}$/;
        return phoneRegex.test(phone);
    };
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validatePassword = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasMinLength = password.length >= 6;
        return hasUpperCase && hasDigit && hasMinLength;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email || !password || !firstName || !lastName || !city || !street || !address || !localPhone) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (!validateEmail(email)) {
            setError("El formato del correo electrónico no es válido.");
            return;
        }
        if (!validatePassword(password)) {
            setError("La contraseña no cumple con los requisitos de seguridad.");
            return;
        }
        if (!validatePhone(localPhone)) {
            setError("El número de teléfono debe contener solo números (ej. 4121234567).");
            return;
        }

        try {
            const userData = { email, password, firstName, lastName, city, street, address, phone: localPhone };
            const wasSuccessful = await register(userData);
            if (wasSuccessful) {
                setSuccess("¡Registro exitoso! Serás redirigido para iniciar sesión.");
                setEmail(''); setPassword(''); setFirstName(''); setLastName('');
                setCity(''); setStreet(''); setAddress(''); setLocalPhone('');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError("El registro falló. El correo ya podría estar en uso.");
            }
        } catch (err) {
            setError("Ocurrió un error en el servidor.");
        }
    };
    
    const iconWrapperClasses = "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none";
    const inputClasses = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-meikan-teal focus:border-transparent transition";

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557244128-a3c1858a8a47?auto=format&fit=crop&q=80&w=2574')" }}
        >
            <div className="w-full max-w-lg p-8 md:p-10 space-y-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-display text-meikan-charcoal">Crea Tu Cuenta</h2>
                    <p className="mt-2 text-gray-600 font-sans">Únete a la experiencia Meikan.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative"><span className={iconWrapperClasses}><UserIcon/></span><input type="text" placeholder="Nombre" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={loading} className={inputClasses}/></div>
                        <div className="relative"><span className={iconWrapperClasses}><UserIcon/></span><input type="text" placeholder="Apellido" value={lastName} onChange={e => setLastName(e.target.value)} disabled={loading} className={inputClasses}/></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="appearance-none pl-3 pr-8 py-3 border border-gray-300 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-meikan-teal">
                                <option>+58</option>
                            </select>
                        </div>
                        <div className="relative flex-grow">
                            <span className={iconWrapperClasses}><PhoneIcon/></span>
                            <input type="tel" placeholder="Número de Teléfono" value={localPhone} onChange={e => setLocalPhone(e.target.value)} disabled={loading} className={inputClasses}/>
                        </div>
                    </div>

                    <div className="relative"><span className={iconWrapperClasses}><MapPinIcon/></span><input type="text" placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} disabled={loading} className={inputClasses}/></div>
                    <div className="relative"><span className={iconWrapperClasses}><MapPinIcon/></span><input type="text" placeholder="Calle" value={street} onChange={e => setStreet(e.target.value)} disabled={loading} className={inputClasses}/></div>
                    <div className="relative"><span className={iconWrapperClasses}><MapPinIcon/></span><input type="text" placeholder="Dirección (Edificio, Apto)" value={address} onChange={e => setAddress(e.target.value)} disabled={loading} className={inputClasses}/></div>

                    <hr className="!my-6 border-gray-300"/>

                    <div className="relative"><span className={iconWrapperClasses}><MailIcon/></span><input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} className={inputClasses}/></div>
                    <div className="relative"><span className={iconWrapperClasses}><LockIcon/></span><input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} className={inputClasses}/></div>
                    
                    <div className="px-1 text-xs text-gray-500">
                        <ul className="list-disc list-inside space-y-1">
                            <li>Mínimo 6 caracteres</li>
                            <li>Debe contener al menos una mayúscula y un número</li>
                        </ul>
                    </div>

                    {/* Notificaciones */}
                    {error && <div className="flex items-center p-4 text-sm text-red-800 bg-red-100 rounded-lg"><ExclamationIcon /><span className="font-medium">{error}</span></div>}
                    {success && <div className="flex items-center p-4 text-sm text-green-800 bg-green-100 rounded-lg"><CheckIcon /><span className="font-medium">{success}</span></div>}
                    
                    <div className="!mt-6">
                        <button type="submit" disabled={loading || !!success} className="w-full px-4 py-3 font-bold font-display tracking-wide text-white bg-meikan-teal rounded-lg hover:bg-meikan-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meikan-teal transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center text-sm text-gray-500 pt-4">
                    <p>¿Ya tienes una cuenta?{' '}<span onClick={() => navigate('/login')} className="font-bold text-meikan-teal hover:underline cursor-pointer">Inicia sesión</span></p>
                </div>
            </div>
        </div>
    );
}

export default Register;