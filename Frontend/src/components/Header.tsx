import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> );
const ShoppingBagIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
    stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" 
    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> );

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const cartItemCount = 0;

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const NavItem = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => {
    const isActive = location.pathname === to;
    const textColor = 'text-meikan-charcoal'; 
        return (
            <div className="relative group">
                <p
                    onClick={() => { navigate(to); setIsMenuOpen(false); }}
                    className={`font-semibold transition-colors duration-300 cursor-pointer ${isActive ? 'text-meikan-teal' : `${textColor} hover:text-meikan-teal`} ${className}`}
                >
                    {children}
                </p>
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-meikan-teal transition-transform duration-300 scale-x-0 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-50'}`}></span>
            </div>
        );
    };

    const headerClasses = `fixed top-0 left-0 right-0 z-50 py-4 font-sans transition-transform duration-300 ease-in-out bg-white/95 shadow-lg backdrop-blur-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`;

    return (
        <header className={headerClasses}>
            {/* --- PRIMERA FILA --- */}
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-8">
                <div className="flex flex-1 justify-start">
                    <NavItem to="/locations" className="hidden lg:block text-md leading-6">Ubícanos</NavItem>
                </div>
                <div onClick={() => navigate("/")} className="cursor-pointer">
                    <img className="h-16 w-auto" src="/src/assets/LOGO-1.png" alt="Logo Meikan" />
                </div>
                <div className="flex flex-1 justify-end items-center gap-x-5 text-meikan-charcoal">
                    {isAuthenticated ? (
                        <div onClick={() => navigate("/account")} className="transition-colors hover:text-meikan-teal cursor-pointer"><UserIcon /></div>
                    ) : (
                        <button onClick={() => navigate("/login")} className="hidden lg:block px-5 py-2 text-sm font-bold bg-meikan-teal text-white rounded-full hover:bg-meikan-teal-dark transition-colors shadow-sm">
                            Iniciar Sesión
                        </button>
                    )}
                    <div className="relative" onClick={() => navigate("/cart")}>
                        <div className="transition-colors hover:text-meikan-teal cursor-pointer"><ShoppingBagIcon /></div>
                        {cartItemCount > 0 && <span className="absolute ...">{cartItemCount}</span>}
                    </div>
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-10"><MenuIcon /></button>
                    </div>
                </div>
            </div>

            {/* --- SEGUNDA FILA (NAVEGACIÓN) --- */}
            <nav className="hidden lg:flex mx-auto mt-4 max-w-7xl items-center justify-center gap-x-12 px-4 lg:px-8">
                <NavItem to="/gallery" className="text-sm">Galería</NavItem>
                <NavItem to="/products" className="text-sm">Productos</NavItem>
                <NavItem to="/offers" className="text-sm">Ofertas</NavItem>
                <NavItem to="/universe" className="text-sm">Universo Meikan</NavItem>
            </nav>

            {/* --- PANEL DE MENÚ MÓVIL --- */}
            <div className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* ... (La estructura del menú móvil no necesita cambios, ya era blanca) ... */}
            </div>
        </header>
    );
}

export default Header;