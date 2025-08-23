import React, { useState } from 'react';
import axios from 'axios';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: (newProduct: any) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onProductCreated }) => {
    // --- ESTADOS DEL FORMULARIO ---
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [imgUrl, setImgUrl] = useState(''); // <-- Este estado almacenará la URL final, sin importar el método.
    
    // --- ESTADOS DE LA UI Y LÓGICA ---
    const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file'); // 'file' por defecto
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    // Limpia el formulario y resetea los estados al cerrar
    const handleClose = () => {
        setName('');
        setDescription('');
        setStock('');
        setPrice('');
        setType('');
        setImgUrl('');
        setUploadMethod('file');
        setErrors([]);
        onClose();
    };

    // Maneja la subida del archivo de imagen
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);
            setErrors([]);
            setImgUrl(''); // Limpiar la URL previa
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await axios.post('https://localhost:7032/api/Products/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setImgUrl(response.data.url);
            } catch (err) {
                setErrors(['Error al subir la imagen.']);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Maneja el envío del formulario completo
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        // --- VALIDACIÓN CORREGIDA ---
        if (!name || !description  || !price || !type || !imgUrl) {
            setErrors(["Todos los campos son obligatorios y se requiere una imagen (subida o por URL)."]);
            return;
        }

        setSubmitting(true);
        const productData = { name, description, stock: 0, price: parseFloat(price), type, imgUrl };

        try {
            const response = await axios.post('https://localhost:7032/api/Products', productData);
            onProductCreated(response.data);
            handleClose(); // Cierra y limpia el modal en caso de éxito
        } catch (err: any) {
            if (err.response?.data?.Errors) {
                setErrors(err.response.data.Errors);
            } else {
                setErrors(['Error al crear el producto.']);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos de texto del producto */}
                    <input type="text" placeholder="Nombre del Producto" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg" />
                    <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border rounded-lg" rows={3} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" step="0.01" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 border rounded-lg" min="0.01" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Linea del producto</label>
                        <div className="flex rounded-lg border p-1 bg-gray-100">
                            <button type="button" onClick={() => setType('Facial')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === 'Facial' ? 'bg-white shadow' : 'text-gray-600'}`}>Facial</button>
                            <button type="button" onClick={() => setType('Corporal')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === 'Corporal' ? 'bg-white shadow' : 'text-gray-600'}`}>Corporal</button>
                        </div>
                    </div>

                    {/* --- SELECCIÓN DE MÉTODO DE IMAGEN --- */}
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                        <div className="flex rounded-lg border p-1 bg-gray-100">
                            <button type="button" onClick={() => setUploadMethod('file')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${uploadMethod === 'file' ? 'bg-white shadow' : 'text-gray-600'}`}>Subir Archivo</button>
                            <button type="button" onClick={() => setUploadMethod('url')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${uploadMethod === 'url' ? 'bg-white shadow' : 'text-gray-600'}`}>Usar URL</button>
                        </div>
                    </div>
                    
                    {/* --- INPUTS CONDICIONALES --- */}
                    {uploadMethod === 'file' && (
                        <div>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {isUploading && <p className="text-sm text-gray-500 mt-2">Subiendo...</p>}
                        </div>
                    )}
                    
                    {uploadMethod === 'url' && (
                        <input type="url" placeholder="https://ejemplo.com/imagen.jpg" value={imgUrl} onChange={e => setImgUrl(e.target.value)} className="w-full p-3 border rounded-lg" />
                    )}
                    
                    {/* Vista Previa de la Imagen (si hay URL) */}
                    {imgUrl && !isUploading && (
                        <div className="border p-2 rounded-lg">
                            <p className="text-sm text-green-700 font-medium mb-2">Vista previa:</p>
                            <img src={imgUrl} alt="Vista previa" className="h-24 w-24 object-cover rounded-md"/>
                        </div>
                    )}

                    {/* Muestra de errores */}
                    {errors.length > 0 && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <ul className="list-disc list-inside">
                                {errors.map((error, index) => <li key={index}>{error}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={handleClose} disabled={submitting} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={submitting || isUploading} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {submitting ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;