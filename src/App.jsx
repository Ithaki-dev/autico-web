import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import VehiclesList from './pages/VehiclesList';
import VehicleDetail from './pages/VehicleDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import VerifyEmail from './pages/VerifyEmail';
import Verify2FA from './pages/Verify2FA';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyVehicles from './pages/dashboard/MyVehicles';
import CreateVehicle from './pages/dashboard/CreateVehicle';
import EditVehicle from './pages/dashboard/EditVehicle';
import MyQuestions from './pages/dashboard/MyQuestions';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/vehicles" element={<VehiclesList />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
            </Route>

            {/* Auth Routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-2fa" element={<Verify2FA />} />
            <Route path="/auth/google/callback" element={<GoogleAuthSuccess />} />
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

            {/* Protected Dashboard Routes with Layout */}
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/vehicles"
                element={
                  <ProtectedRoute>
                    <MyVehicles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/vehicles/new"
                element={
                  <ProtectedRoute>
                    <CreateVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/vehicles/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditVehicle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/questions"
                element={
                  <ProtectedRoute>
                    <MyQuestions />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
