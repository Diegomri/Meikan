import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// --- Iconos (sin cambios) ---
const UserCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const ShoppingBagIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg> );

function Account() {
  const { user, isAuthenticated, logout, loading, updateUserContext } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      firstName: '', lastName: '', phoneNumber: '', city: '', street: '', address: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\d{7,10}$/;
        return phoneRegex.test(phone);
    };

  useEffect(() => {
      if (user) {
          setFormData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              phoneNumber: user.phone || '',
              city: user.city || '',
              street: user.street || '',
              address: user.address || ''
          });
      }
  }, [user]);

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-50">Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const handleLogout = () => { logout(); };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(null);
        if (isEditing && user) {
            setFormData({
                firstName: user.firstName || '', lastName: user.lastName || '',
                phoneNumber: user.phone || '', city: user.city || '',
                street: user.street || '', address: user.address || ''
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        
        e.preventDefault();
        setError(null);

        if (Object.values(formData).some(value => value.trim() === '')) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        // 2. Comprobar el formato del número de teléfono
        if (!validatePhone(formData.phoneNumber)) {
            setError("El formato del número de teléfono no es válido.");
            return;
        }
        setSubmitting(true);
        try {
            
            await axios.put('https://localhost:7032/api/account/info', formData);

            window.location.reload();
            
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar la información.');
            setSubmitting(false); // Importante: solo detener la carga si hay un error
        } 
        // No hay `finally` porque en caso de éxito, la página se recarga y el estado se pierde.
    };

    const fullAddress = [user?.address, user?.street, user?.city].filter(Boolean).join(', ');
    const inputClasses = "w-full mt-1 p-2 border border-gray-300 rounded-md text-lg text-meikan-charcoal focus:ring-meikan-teal focus:border-meikan-teal";

    return (
        <div className="bg-meikan-light min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold font-display text-meikan-charcoal">Mi Cuenta</h1>
                    <p className="mt-2 text-lg text-gray-500">Bienvenido de nuevo, {user?.firstName || user?.email}.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1 flex flex-col space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-meikan-teal rounded-full flex items-center justify-center text-white text-4xl font-display mb-4">
                                {user?.email.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold font-display text-meikan-charcoal">{user?.fullName}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <nav className="bg-white p-4 rounded-xl shadow-lg flex-grow">
                            <ul className="space-y-1">
                                <li><a href="#" className="flex items-center px-4 py-3 text-meikan-teal bg-teal-50 rounded-lg font-bold"><UserCircleIcon /> Perfil</a></li>
                                <li><a href="#" className="flex items-center px-4 py-3 text-meikan-charcoal hover:bg-gray-100 rounded-lg font-semibold"><ShoppingBagIcon /> Historial de Pedidos</a></li>
                            </ul>
                            <button onClick={handleLogout} className="w-full flex items-center mt-6 px-4 py-3 text-meikan-charcoal hover:bg-gray-100 rounded-lg font-semibold">
                                <LogoutIcon /> Cerrar Sesión
                            </button>
                        </nav>
                    </aside>

                    <main className="lg:col-span-3">
                        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold font-display text-meikan-charcoal border-b border-gray-200 pb-4">
                                Información Personal
                            </h3>
                            <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-500">Nombre</label>
                                        {isEditing ? <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClasses}/> : <p className="mt-1 text-lg text-meikan-charcoal">{user?.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-500">Apellido</label>
                                        {isEditing ? <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClasses}/> : <p className="mt-1 text-lg text-meikan-charcoal">{user?.lastName}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">Correo (no editable)</label>
                                    <p className="mt-1 text-lg text-gray-500">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">Teléfono</label>
                                    {isEditing ? <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClasses}/> : <p className="mt-1 text-lg text-meikan-charcoal">{user?.phone}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">Dirección Completa</label>
                                    {isEditing ? (
                                        <div className="mt-2 space-y-4">
                                            <input name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} className={inputClasses} />
                                            <input name="street" placeholder="Calle" value={formData.street} onChange={handleChange} className={inputClasses} />
                                            <input name="address" placeholder="Dirección (Apto, Edificio)" value={formData.address} onChange={handleChange} className={inputClasses} />
                                        </div>
                                    ) : <p className="mt-1 text-lg text-meikan-charcoal">{fullAddress || 'No especificada'}</p>}
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end gap-4">
                                {isEditing ? (
                                    <>
                                        <button type="button" onClick={handleEditToggle} className="px-6 py-2 text-sm font-bold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300">
                                            Cancelar
                                        </button>
                                        <button type="submit" disabled={submitting} className="px-6 py-2 text-sm font-bold text-white bg-meikan-teal rounded-full hover:bg-meikan-teal-dark disabled:opacity-50">
                                            {submitting ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={handleEditToggle} className="px-6 py-2 text-sm font-bold text-white bg-meikan-teal rounded-full hover:bg-meikan-teal-dark transition-colors shadow-sm">
                                        Editar Información
                                    </button>
                                )}
                            </div>
                            {error && <p className="text-red-500 text-right mt-4">{error}</p>}
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Account;