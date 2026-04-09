import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ArrowRight, Shield, Clock, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { vehicleService } from '../api/vehicleService';
import VehicleCard from '../components/vehicles/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();
  const [latestVehicles, setLatestVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLatestVehicles();
  }, []);

  const loadLatestVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles({ limit: 6, status: 'available' });
      if (response.success) {
        setLatestVehicles(response.data);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/vehicles');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Verificación de usuarios y vehículos para tu tranquilidad',
    },
    {
      icon: Clock,
      title: 'Rápido y Fácil',
      description: 'Publica tu vehículo en menos de 5 minutos',
    },
    {
      icon: TrendingUp,
      title: 'Mejor Precio',
      description: 'Sin intermediarios, trato directo con el vendedor',
    },
  ];

  const categories = [
    { name: 'Sedán', count: 234, icon: '🚗' },
    { name: 'SUV', count: 189, icon: '🚙' },
    { name: 'Pickup', count: 156, icon: '🛻' },
    { name: 'Deportivo', count: 89, icon: '🏎️' },
    { name: 'Clásico', count: 67, icon: '🚘' },
    { name: 'Eléctrico', count: 45, icon: '⚡' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
                Encuentra el <span className="text-warning-400">Vehículo</span>
                <br />
                de tus Sueños
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                La plataforma profesional para comprar y vender automóviles de forma segura y confiable
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl shadow-metal-xl">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-dark-400 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar marca, modelo..."
                    className="w-full bg-transparent border-none focus:outline-none text-dark-900 placeholder:text-dark-400"
                  />
                </div>
                <Button type="submit" variant="warning" size="lg" className="sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-12 text-sm md:text-base"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning-400 rounded-full animate-pulse" />
                <span className="font-semibold">+1,200 Vehículos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning-400 rounded-full animate-pulse" />
                <span className="font-semibold">+500 Vendedores</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning-400 rounded-full animate-pulse" />
                <span className="font-semibold">100% Seguro</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-metal hover:shadow-metal-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-warning-400 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-dark-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-4">
              Categorías Populares
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Encuentra el tipo de vehículo que buscas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/vehicles?category=${category.name}`}
                className="bg-gray-50 hover:bg-primary-50 border-2 border-dark-200 hover:border-primary-500 rounded-xl p-6 text-center transition-all group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-dark-900 group-hover:text-primary-600 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-dark-500">{category.count} anuncios</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
                Últimas Publicaciones
              </h2>
              <p className="text-lg text-dark-600">
                Los vehículos más recientes en venta
              </p>
            </div>
            <Link to="/vehicles">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Cargando vehículos..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-display font-black mb-6">
              ¿Listo para Vender tu Vehículo?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Publica tu anuncio gratis y llega a miles de compradores potenciales
            </p>
            <Link to="/register">
              <Button variant="warning" size="xl">
                Publicar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
