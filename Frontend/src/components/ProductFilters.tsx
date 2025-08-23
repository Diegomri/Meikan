import React from 'react';

// Tipos para las props que este componente recibirá
export interface Filters {
    line: 'Todos' | 'Facial' | 'Corporal';
    sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
}

interface ProductFiltersProps {
    filters: Filters;
    onFilterChange: (newFilters: Partial<Filters>) => void;
}

// Icono para el dropdown personalizado
const ChevronDownIcon = () => (
    <svg className="fill-current h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
    </svg>
);

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
    return (
        <aside className="w-full lg:w-1/4 font-sans">
            <div className="sticky top-28 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold font-display text-meikan-charcoal mb-6">Filtros</h3>

                {/* --- Filtro por Línea (Controles Personalizados) --- */}
                <div className="mb-8">
                    <h4 className="font-semibold font-display text-meikan-charcoal mb-3">Línea</h4>
                    <div className="space-y-3">
                        {['Todos', 'Facial', 'Corporal'].map(line => (
                            <button
                                key={line}
                                onClick={() => onFilterChange({ line: line as Filters['line'] })}
                                className={`w-full text-left p-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meikan-teal ${
                                    filters.line === line
                                        ? 'bg-meikan-teal text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {line}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Ordenar por (Dropdown Personalizado) --- */}
                <div>
                    <h4 className="font-semibold font-display text-meikan-charcoal mb-2">Ordenar por</h4>
                    <div className="relative">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => onFilterChange({ sortBy: e.target.value as Filters['sortBy'] })}
                            className="w-full appearance-none bg-white p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meikan-teal focus:border-transparent transition"
                        >
                            <option value="name-asc">Nombre (A-Z)</option>
                            <option value="name-desc">Nombre (Z-A)</option>
                            <option value="price-asc">Precio (Menor a Mayor)</option>
                            <option value="price-desc">Precio (Mayor a Menor)</option>
                        </select>
                        {/* Flecha personalizada para el dropdown */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                           <ChevronDownIcon />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProductFilters;