import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFilters from '../components/vehicles/VehicleFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useVehicles } from '../hooks/useVehicles';

const VehiclesList = () => {
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;
  const { vehicles, loading, error, loadMore } = useVehicles(LIMIT, offset);

  const handleNextPage = () => {
    loadMore(LIMIT, offset + LIMIT);
    setOffset(offset + LIMIT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      loadMore(LIMIT, offset - LIMIT);
      setOffset(offset - LIMIT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            Explora nuestra selección de vehículos disponibles
          </p>
        </div>

        {/* Vehicles Grid */}
        <main>
          {loading && !vehicles.length ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Cargando vehículos..." />
            </div>
          ) : error ? (
            <EmptyState
              icon={Car}
              title="Error al cargar vehículos"
              description={error}
            />
          ) : vehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No se encontraron vehículos"
              description="No hay vehículos disponibles en este momento"
            />
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <span className="text-dark-600 font-medium">
                  Mostrando {vehicles.length} vehículos
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={vehicles.length < LIMIT}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default VehiclesList;
