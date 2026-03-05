import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Plus, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../api/vehicleService';
import { questionService } from '../../api/questionService';
import Button from '../../components/common/Button';
import VehicleCard from '../../components/vehicles/VehicleCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    totalQuestions: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [vehiclesResponse, questionsResponse] = await Promise.all([
        vehicleService.getMyVehicles(),
        questionService.getMyQuestions().catch(() => ({ data: [] })),
      ]);

      if (vehiclesResponse.success) {
        const vehicles = vehiclesResponse.data;
        setStats({
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter((v) => v.status === 'available').length,
          soldVehicles: vehicles.filter((v) => v.status === 'sold').length,
          totalQuestions: questionsResponse.data?.length || 0,
        });
        setRecentVehicles(vehicles.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Vehículos',
      value: stats.totalVehicles,
      icon: Car,
      color: 'from-primary-500 to-primary-600',
      trend: 'total',
    },
    {
      title: 'Disponibles',
      value: stats.availableVehicles,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      trend: 'up',
    },
    {
      title: 'Vendidos',
      value: stats.soldVehicles,
      icon: Eye,
      color: 'from-secondary-500 to-secondary-600',
      trend: 'neutral',
    },
    {
      title: 'Preguntas',
      value: stats.totalQuestions,
      icon: MessageCircle,
      color: 'from-warning-400 to-warning-500',
      trend: 'info',
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
            Bienvenido, {user?.username}
          </h1>
          <p className="text-lg text-dark-600">Gestiona tus vehículos y actividad</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-metal border border-dark-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-black text-dark-900 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-dark-600">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-dark-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/dashboard/vehicles/new">
              <Button variant="primary" className="w-full">
                <Plus className="w-5 h-5 mr-2" />
                Publicar Vehículo
              </Button>
            </Link>
            <Link to="/dashboard/vehicles">
              <Button variant="outline" className="w-full">
                <Car className="w-5 h-5 mr-2" />
                Mis Vehículos
              </Button>
            </Link>
            <Link to="/dashboard/questions">
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-5 h-5 mr-2" />
                Mis Preguntas
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Vehicles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-dark-900">
              Tus Vehículos Recientes
            </h2>
            <Link to="/dashboard/vehicles">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>

          {recentVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-12 text-center">
              <Car className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-900 mb-2">
                No tienes vehículos publicados
              </h3>
              <p className="text-dark-600 mb-6">
                Comienza a vender publicando tu primer vehículo
              </p>
              <Link to="/dashboard/vehicles/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Publicar Ahora
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
