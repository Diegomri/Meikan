import React from 'react';

function Locations() {
  return (
    // Contenedor principal que organiza la página en dos filas: cabecera y mapa.
    // `h-screen` asegura que ocupe toda la altura de la ventana.
    <div className="flex flex-col h-screen bg-white">
      
      {/* --- SECCIÓN 1: CABECERA DE LA PÁGINA --- */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display tracking-tight text-meikan-charcoal sm:text-5xl">
            Encuéntranos
          </h1>
          <p className="mt-4 text-lg text-gray-500 font-sans max-w-2xl mx-auto">
            Visita nuestras sedes para una atención personalizada. Utiliza el mapa interactivo para explorar nuestras ubicaciones.
          </p>
        </div>
      </header>

      {/* --- SECCIÓN 2: EL MAPA --- */}
      {/* 
        `flex-grow`: Hace que esta sección ocupe todo el espacio vertical restante.
        `relative overflow-hidden`: Necesario para que el truco de CSS del iframe funcione.
      */}
      <main className="flex-grow relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/d/embed?mid=1RBKjzGXFIW3rf8lutwe6coDkwCv9Zd0" // Tu URL de embed
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
              border: 0, 
              // El truco de CSS para ocultar la barra de Google se mantiene
              top: '-60px',
              height: 'calc(100% + 60px)'
          }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </main>
      
    </div>
  );
}

export default Locations;