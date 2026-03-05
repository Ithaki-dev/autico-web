import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const VehicleFilters = ({ filters, onApplyFilters, onClearFilters }) => {
  const currentYear = new Date().getFullYear();
  const [localFilters, setLocalFilters] = useState(filters || {});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    setIsOpen(false);
  };

  const popularBrands = [
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Ford', 
    'Chevrolet', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi'
  ];

  return (
    <div className="bg-white rounded-xl shadow-metal border border-dark-200 overflow-hidden">
      {/* Header - Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-dark-50 border-b border-dark-200"
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-500" />
          <span className="font-bold text-dark-900">Filtros</span>
        </div>
        {isOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
      </button>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4 space-y-4`}>
        {/* Title - Desktop */}
        <div className="hidden md:flex items-center space-x-2 pb-2 border-b-2 border-primary-500">
          <Filter className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-display font-bold text-dark-900">Filtros</h3>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-semibold text-dark-800 mb-2">
            Marca
          </label>
          <select
            value={localFilters.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas las marcas</option>
            {popularBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-semibold text-dark-800 mb-2">
            Modelo
          </label>
          <input
            type="text"
            value={localFilters.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="Ej: Civic, Corolla..."
            className="w-full px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-semibold text-dark-800 mb-2">
            Año
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={localFilters.minYear || ''}
              onChange={(e) => handleChange('minYear', e.target.value)}
              placeholder="Desde"
              min="1900"
              max={currentYear + 1}
              className="px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="number"
              value={localFilters.maxYear || ''}
              onChange={(e) => handleChange('maxYear', e.target.value)}
              placeholder="Hasta"
              min="1900"
              max={currentYear + 1}
              className="px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-dark-800 mb-2">
            Precio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Mínimo"
              min="0"
              className="px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Máximo"
              min="0"
              className="px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-dark-800 mb-2">
            Estado
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border-2 border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            <option value="available">Disponible</option>
            <option value="sold">Vendido</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-2">
          <Button
            onClick={handleApply}
            variant="primary"
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            Aplicar Filtros
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
