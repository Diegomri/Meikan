import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Icono y Tipos (sin cambios) ---

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);
  
interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  type: string;
  imgUrl: string;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Product[]>('https://localhost:7032/api/Products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  // --- Estados de Carga y Error (sin cambios) ---
  if (loading) {
    return <div className="text-center py-20"><p className="text-gray-500">Cargando...</p></div>;
  }
  if (error) {
    return <div className="text-center py-20 px-4"><p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p></div>;
  }

  // --- Renderizado Principal con el nuevo diseño ---
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Contenedor principal de 2 columnas */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* COLUMNA IZQUIERDA: Cuadrícula de productos */}
          <main className="w-full lg:w-3/4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
              Productos
            </h2>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  // Contenedor 'group' para controlar el hover de los hijos
                  <div key={product.id} className="group relative aspect-square overflow-hidden rounded-lg">
                    {/* 1. Imagen del producto */}
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    
                    {/* 2. Overlay que aparece en hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 p-4 text-white opacity-0 transition-all duration-300 group-hover:bg-opacity-60 group-hover:opacity-100">
                      <h3 className="text-lg font-bold text-center">{product.name}</h3>
                      <p className="mt-1 text-lg">${product.price.toFixed(2)}</p>
                      <button className="mt-4 flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-200 transition-colors">
                        <ShoppingBagIcon />
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No se encontraron productos.</p>
            )}
          </main>

          {/* COLUMNA DERECHA: Filtros y buscador */}
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-28 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-800">Filtros</h3>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-gray-500">
                  El buscador y filtro.
                </p>
                {/* Aquí irían los componentes de búsqueda, categorías, rango de precios, etc. */}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default Products;