import { useSearchParams } from 'react-router-dom';
import { Car, ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFilters from '../components/vehicles/VehicleFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useVehicles } from '../hooks/useVehicles';

const VehiclesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
  };

  const { vehicles, loading, pagination, applyFilters, clearFilters, changePage } = useVehicles(initialFilters);

  const handleApplyFilters = (newFilters) => {
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    clearFilters();
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    changePage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
            Catálogo de Vehículos
          </h1>
          <p className="text-lg text-dark-600">
            {pagination.total > 0 
              ? `${pagination.total} vehículo${pagination.total !== 1 ? 's' : ''} disponible${pagination.total !== 1 ? 's' : ''}`
              : 'Explora nuestra selección'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <VehicleFilters
              filters={initialFilters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Vehicles Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" text="Cargando vehículos..." />
              </div>
            ) : vehicles.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No se encontraron vehículos"
                description="Intenta ajustar los filtros de búsqueda para encontrar más resultados"
                action={handleClearFilters}
                actionLabel="Limpiar Filtros"
              />
            ) : (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.pages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first, last, current, and adjacent pages
                        const shouldShow =
                          pageNumber === 1 ||
                          pageNumber === pagination.pages ||
                          (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1);

                        if (!shouldShow && pageNumber === 2) {
                          return <span key={pageNumber} className="px-2 text-dark-400">...</span>;
                        }
                        if (!shouldShow && pageNumber === pagination.pages - 1) {
                          return <span key={pageNumber} className="px-2 text-dark-400">...</span>;
                        }
                        if (!shouldShow) return null;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`
                              w-10 h-10 rounded-lg font-semibold transition-all
                              ${
                                pageNumber === pagination.page
                                  ? 'bg-primary-500 text-white shadow-metal'
                                  : 'bg-white text-dark-700 hover:bg-dark-50 border border-dark-200'
                              }
                            `}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VehiclesList;
