import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Menu, X, Car, LogOut, User, Settings, Plus, Home, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { questionService } from '../../api/questionService';
import { vehicleService } from '../../api/vehicleService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getEntityId = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    return entity._id || entity.id || null;
  };

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated()) {
      setNotificationsCount(0);
      return;
    }

    try {
      const [myQuestionsResponse, myVehiclesResponse] = await Promise.all([
        questionService.getMyQuestions().catch(() => ({ data: [] })),
        vehicleService.getMyVehicles().catch(() => ({ data: [] })),
      ]);

      const myQuestions = Array.isArray(myQuestionsResponse?.data)
        ? myQuestionsResponse.data
        : [];
      const myVehicles = Array.isArray(myVehiclesResponse?.data)
        ? myVehiclesResponse.data
        : [];

      // Mensajes no respondidos para el usuario que pregunta.
      const pendingForBuyerCount = myQuestions.filter((question) => !question?.answer).length;

      const myUserId = getEntityId(user);

      const ownedVehicles = myVehicles.filter((vehicle) => {
        const vehicleOwnerId = getEntityId(vehicle?.owner);
        return Boolean(myUserId && vehicleOwnerId === myUserId);
      });

      const sellerQuestionLists = await Promise.all(
        ownedVehicles.map((vehicle) =>
          questionService.getVehicleQuestions(vehicle._id).catch(() => [])
        )
      );

      // Mensajes no respondidos para el vendedor.
      const pendingForSellerCount = sellerQuestionLists
        .flat()
        .filter((question) => !question?.answer).length;

      setNotificationsCount(pendingForBuyerCount + pendingForSellerCount);
    } catch (error) {
      setNotificationsCount(0);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadNotifications();

    if (!isAuthenticated()) return undefined;

    const intervalId = setInterval(loadNotifications, 15000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, loadNotifications, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/vehicles', label: 'Vehículos', icon: Car },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-dark-950 shadow-metal-lg border-b-2 border-warning-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logo_movile.png"
              alt="Autico"
              className="h-11 w-auto md:hidden"
            />
            <img
              src="/logo_web.png"
              alt="Autico"
              className="hidden md:block h-16 lg:h-20 w-auto md:-translate-y-1 lg:-translate-y-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all font-semibold"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated() ? (
              <>
                <Link
                  to="/dashboard/questions"
                  className="relative p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                  title="Notificaciones de preguntas"
                >
                  <Bell className="w-5 h-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-secondary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notificationsCount > 99 ? '99+' : notificationsCount}
                    </span>
                  )}
                </Link>

                <Link to="/dashboard/vehicles/new">
                  <Button variant="warning" size="sm" className="ml-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Publicar
                  </Button>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-dark-800 rounded-lg transition-all">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">{user?.username}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-metal-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-3 text-dark-800 hover:bg-gray-50 rounded-t-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Mi Cuenta</span>
                    </Link>
                    <Link
                      to="/dashboard/vehicles"
                      className="flex items-center space-x-2 px-4 py-3 text-dark-800 hover:bg-gray-50 transition-colors"
                    >
                      <Car className="w-4 h-4" />
                      <span>Mis Vehículos</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-dark-900">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="warning" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-dark-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900 border-t border-dark-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/dashboard/questions"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                  >
                    <span className="flex items-center space-x-2">
                      <Bell className="w-5 h-5" />
                      <span>Notificaciones</span>
                    </span>
                    {notificationsCount > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1.5 bg-secondary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {notificationsCount > 99 ? '99+' : notificationsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/dashboard/vehicles/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-warning-400 hover:bg-dark-800 rounded-lg transition-all font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Publicar Vehículo</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Mi Cuenta</span>
                  </Link>
                  <Link
                    to="/dashboard/vehicles"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                  >
                    <Car className="w-5 h-5" />
                    <span>Mis Vehículos</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-dark-800 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3"
                  >
                    <Button variant="outline" className="w-full text-white border-white">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3"
                  >
                    <Button variant="warning" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
