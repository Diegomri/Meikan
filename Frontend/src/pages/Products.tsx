import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateProductModal from '../components/CreateProductModal'; // Asegúrate que la ruta sea correcta
import ProductFilters from '../components/ProductFilters'; 
import type { Filters } from '../components/ProductFilters'; 
import mainBanner from '../assets/banner-principal.jpg';   // <-- REEMPLAZA
import facialBanner from '../assets/banner-facial.jpg'; // <-- REEMPLAZA
import corporalBanner from '../assets/banner-corporal.jpg'; // <-- REEMPLAZA

// --- Iconos ---
const ShoppingBagIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.913 3.28 6 4.234 6 5.414v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg> );
  
interface Product { id: string; name: string; description: string; stock: number; price: number; type: string; imgUrl: string; }



// --- Componente Principal ---
function Products() {
    // --- ESTADOS ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        line: 'Todos',
        sortBy: 'name-asc',
    });

    const bannerContent = {
        Todos: {
            image: mainBanner,
            title: 'Nuestra Colección',
            subtitle: 'Descubre la belleza espiritual en cada producto.',
        },
        Facial: {
            image: facialBanner,
            title: 'Línea Facial',
            subtitle: 'Renueva y revitaliza la piel de tu rostro.',
        },
        Corporal: {
            image: corporalBanner,
            title: 'Línea Corporal',
            subtitle: 'Nutrición e hidratación profunda para tu cuerpo.',
        }
    };

    const currentBanner = bannerContent[filters.line];

    // --- MANEJADOR Y EFECTO DE CARGA ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Descomponer el valor de sortBy para la API
            const [sortBy, order] = filters.sortBy.split('-');

            // Construir los parámetros de la URL
            const params = new URLSearchParams({
                sortBy: sortBy,
                order: order,
            });
            
            if (filters.line !== 'Todos') {
                params.append('line', filters.line);
            }

            const response = await axios.get<Product[]>(`https://localhost:7032/api/Products?${params.toString()}`);
            setProducts(response.data);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [filters]); // Esta función se recrea solo cuando los filtros cambian

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };


    const handleAddToCart = async (product: Product) => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setNotification(`Agregando ${product.name}...`);
        try {
            await axios.post(`https://localhost:7032/api/Products/AddToCart?UserId=${user?.id}`, { productId: product.id });
            setNotification(`${product.name} fue agregado al carrito! ✅`);
        } catch (err) {
            setNotification('Hubo un error al agregar el producto. ❌');
        } finally {
            setTimeout(() => setNotification(null), 3000);
        }
    };

     if (error && !loading) return <div className="text-center py-20 px-4"><p>{error}</p></div>;
     
    const handleProductCreated = (newProduct: Product) => {
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        setIsModalOpen(false);
        setNotification('¡Producto creado exitosamente! ✅');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) newSet.delete(productId);
            else newSet.add(productId);
            return newSet;
        });
    };

    const handleConfirmDelete = async () => {
        if (selectedProducts.size === 0) return;
        setIsDeleting(true);
        try {
            await axios.delete('https://localhost:7032/api/Products', { data: { productIds: Array.from(selectedProducts) } });
            setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)));
            setNotification(`${selectedProducts.size} producto(s) eliminado(s) exitosamente. ✅`);
        } catch (err) {
            setNotification('Error al eliminar los productos. ❌');
        } finally {
            setIsDeleting(false);
            setIsDeleteMode(false);
            setSelectedProducts(new Set());
            setTimeout(() => setNotification(null), 4000);
        }
    };

    // --- RENDERIZADO ---
    if (loading) return <div className="text-center py-20"><p>Cargando...</p></div>;
    if (error) return <div className="text-center py-20 px-4"><p>{error}</p></div>;

    return (
        <div className="bg-white">
            {notification && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          {notification}
        </div>
      )}
             <div className="bg-meikan-light font-sans">
            <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductCreated={handleProductCreated} />
            
            {/* --- BANNER HERO --- */}
           {/* --- BANNER HERO DINÁMICO --- */}
            <div className="relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-12 lg:px-16 rounded-b-3xl overflow-hidden">
                <img 
                    key={currentBanner.image} // <-- 3. La key fuerza el re-renderizado de la imagen
                    src={currentBanner.image} // <-- Usa la imagen dinámica
                    alt="Banner de la línea de productos" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-500"
                />
                <div className="relative text-center">
                    <h1 className="text-4xl font-display font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {currentBanner.title} {/* <-- Usa el título dinámico */}
                    </h1>
                    <p className="mt-4 text-xl text-gray-200">
                        {currentBanner.subtitle} {/* <-- Usa el subtítulo dinámico */}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* COLUMNA DE FILTROS */}
                    <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
                    
                    {/* COLUMNA DE PRODUCTOS */}
                    <main className="w-full lg:w-3/4">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold font-display text-meikan-charcoal">
                                {filters.line === 'Todos' ? 'Todos los Productos' : `Línea ${filters.line}`}
                            </h3>
                            {isAdmin && (
                                <div className="flex gap-4">
                                    {isDeleteMode ? (
                                        <>
                                            <button onClick={handleConfirmDelete} className="bg-red-600 ... disabled:bg-red-400" disabled={isDeleting || selectedProducts.size === 0}>{isDeleting ? 'Eliminando...' : `Eliminar (${selectedProducts.size})`}</button>
                                            <button onClick={() => { setIsDeleteMode(false); setSelectedProducts(new Set()); }} className="bg-gray-300 ..." disabled={isDeleting}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 ...">Crear Producto</button>
                                            <button onClick={() => setIsDeleteMode(true)} className="bg-red-600 ... flex items-center"><TrashIcon/>Gestionar</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {loading ? ( <div className="text-center py-20">Cargando...</div> ) 
                        : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                                {products.map((product) => (
                                    <div key={product.id} className="group text-center">
                                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                                            <img src={product.imgUrl} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                                            
                                            {/* Overlay para acciones */}
                                            {!isDeleteMode ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <button onClick={() => handleAddToCart(product)} className="p-3 bg-white/80 backdrop-blur-sm rounded-full text-meikan-charcoal hover:bg-white shadow-lg transform transition-transform hover:scale-110">
                                                        <ShoppingBagIcon />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={`absolute inset-0 cursor-pointer ...`} onClick={() => !isDeleting && handleProductSelect(product.id)}>
                                                    <input type="checkbox" checked={selectedProducts.has(product.id)} readOnly className="h-4 w-4 rounded-full border-gray-300 text-red-600 focus:ring-0" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Información del producto */}
                                        <h4 className="mt-4 text-md font-semibold text-meikan-charcoal font-display">{product.name}</h4>
                                        <p className="mt-1 text-lg text-gray-800">${product.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : ( <div className="text-center py-20">No se encontraron productos.</div> )}
                    </main>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Products;