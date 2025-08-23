import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
const TrashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.913 3.28 6 4.234 6 5.414v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg> );
const EmptyCartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> );

// --- Interfaces (sin cambios) ---
interface CartProduct {
    productId: string;
    name: string;
    price: number;
    imgUrl: string;
    quantity: number;
}
interface Cart {
    cartId: string;
    totalPrice: number;
    products: CartProduct[];
}

// --- Componente principal ---
function Cart() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carga inicial del carrito
    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        const fetchCart = async () => {
            try {
                const response = await axios.get('https://localhost:7032/api/cart');
                setCart(response.data);
            } catch (err) {
                setError("No se pudo cargar tu carrito.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [isAuthenticated, authLoading]);

    // --- MANEJADORES DE CANTIDAD ---

    const handleQuantityChange = (productId: string, change: 'increase' | 'decrease') => {
        if (!cart) return;

        const product = cart.products.find(p => p.productId === productId);
        if (!product) return;

        // Optimistic UI Update
        const newQuantity = change === 'increase' ? product.quantity + 1 : product.quantity - 1;

        if (newQuantity < 0) return; // No permitir cantidad negativa

        // Si la cantidad llega a 0, se elimina todo el producto
        if (newQuantity === 0) {
            deleteProduct(productId, product.quantity); // Pasa la cantidad total a eliminar
            return;
        }
        
        // Actualiza el estado local inmediatamente
        const newProducts = cart.products.map(p => 
            p.productId === productId ? { ...p, quantity: newQuantity } : p
        );
        const newTotalPrice = change === 'increase' 
            ? cart.totalPrice + product.price 
            : cart.totalPrice - product.price;

        setCart({ ...cart, products: newProducts, totalPrice: newTotalPrice });

        // Llamada a la API en segundo plano
        if (change === 'increase') {
            axios.post('https://localhost:7032/api/cart/products', { productId })
                .catch(err => {
                    console.error("Error al incrementar:", err);
                    // Opcional: Revertir el estado si la API falla
                    setError("No se pudo actualizar la cantidad.");
                });
        } else {
            axios.delete(`https://localhost:7032/api/cart/products/${productId}/one`)
                .catch(err => {
                    console.error("Error al decrementar:", err);
                    setError("No se pudo actualizar la cantidad.");
                });
        }
    };

    const deleteProduct = (productId: string, quantity: number) => {
        if (!cart) return;
        const product = cart.products.find(p => p.productId === productId);
        if(!product) return;

        // Optimistic UI Update para eliminar todo
        const newProducts = cart.products.filter(p => p.productId !== productId);
        const newTotalPrice = cart.totalPrice - (product.price * quantity);
        setCart({ ...cart, products: newProducts, totalPrice: newTotalPrice });
        
        // Llamada a la API para eliminar todas las instancias
        axios.delete(`https://localhost:7032/api/cart/products/${productId}`) // Ya está apuntando al endpoint correcto
        .catch(err => {
            console.error("Error al eliminar:", err);
            setError("No se pudo eliminar el producto.");
        });
    };

    // --- RENDERIZADO ---
    if (authLoading || loading) return <div className="text-center p-10">Cargando...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!cart || cart.products.length === 0) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
                <Link to="/products" className="text-blue-600 hover:underline">Ver productos</Link>
            </div>
        );
    }

    return (
       <div className="bg-meikan-light min-h-screen font-sans">
            <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display tracking-tight text-meikan-charcoal sm:text-5xl">
                        Tu Carrito
                    </h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Columna de Productos */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
                        {cart.products.map(item => (
                            <div key={item.productId} className="flex flex-col sm:flex-row py-4 items-center gap-4 border-b last:border-b-0">
                                <img src={item.imgUrl} alt={item.name} className="w-28 h-28 object-cover rounded-lg shadow-sm" />
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold font-display text-meikan-charcoal text-lg">{item.name}</h3>
                                    <p className="text-gray-600 font-semibold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Controles de Cantidad */}
                                    <div className="flex items-center border border-gray-200 rounded-full">
                                        <button onClick={() => handleQuantityChange(item.productId, 'decrease')} className="px-3 py-1 text-lg text-gray-500 hover:text-meikan-teal">-</button>
                                        <span className="px-4 py-1 text-meikan-charcoal font-semibold">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.productId, 'increase')} className="px-3 py-1 text-lg text-gray-500 hover:text-meikan-teal">+</button>
                                    </div>
                                    {/* Botón de Eliminar */}
                                    <button onClick={() => deleteProduct(item.productId, item.quantity)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold font-display text-meikan-charcoal border-b pb-4 mb-4">Resumen del Pedido</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${cart.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="font-semibold">Gratis</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg text-meikan-charcoal">
                                <span>Total</span>
                                <span>${cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="w-full mt-6 bg-meikan-teal text-white font-bold font-display py-3 rounded-lg hover:bg-meikan-teal-dark transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meikan-teal">
                                FINALIZAR COMPRA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;