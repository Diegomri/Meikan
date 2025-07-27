import React, { useState, useEffect } from 'react';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

function Header() {
  const cartItemCount = 3; 
  

  /* ----- VISIBILIDAD HEADER ------- */
  // 1. Estados para la visibilidad y la posición del scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 2. useEffect para manejar el evento de scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si el scroll actual es mayor que el anterior, es un scroll hacia abajo
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Actualiza la última posición del scroll
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Limpia el evento al desmontar el componente
    return () => window.removeEventListener('scroll', handleScroll);

  }, [lastScrollY]);


  return (
    // 3. Clases dinámicas para la transición
    <header className={`bg-gray-200 shadow-sm sticky top-0 z-50 py-4 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      
      {/*PRIMERA FILA*/}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-8">
        
        {/* Lado Izquierdo*/}
        <div className="flex flex-1 justify-start">
          <a href="/locations" className="text-md font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors duration-200">
          Ubicanos
        </a>
        </div>
        
        {/* Centro*/}
        <div className="flex justify-center">
          <a href="/" className="-m-1.5 p-1.5">
            <img className="h-16 w-auto" src="src/assets/LOGO-1.png" alt="Logo Meikan" />
          </a>
        </div>
        
        {/* Lado Derecho*/}
        <div className="flex flex-row flex-1 justify-end">
          <div className="relative flex flex-row items-center gap-x-6">
            <a href="/account" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <span className="sr-only">Cuenta</span>
            <UserIcon />
          </a>
          <div className="relative">
            <a href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <span className="sr-only">Carrito</span>
              <ShoppingBagIcon />
            </a>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-medium text-white">
                {cartItemCount}
              </span>
            )}
            </div>
          </div>
        </div>
      </div>
      
      {/*SEGUNDA FILA*/}
      <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-center gap-x-8 px-4 lg:px-8">
        <a href="/gallery" className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors duration-200">
          Galería
        </a>
        <a href="/products" className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors duration-200">
          Productos
        </a>
        <a href="/offers" className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors duration-200">
          Ofertas
        </a>
        <a href="/universe" className="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors duration-200">
          Universo Meikan
        </a>
      </nav>

    </header>
  )
}

export default Header;