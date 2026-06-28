import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Home from './pages/Home';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import Splits from './pages/Splits';
import Calories from './pages/Calories';
import Analytics from './pages/Analytics';
import Buddy from './pages/Buddy';
import LogWorkout from './pages/LogWorkout';
import LiveSession from './pages/LiveSession';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Dashboard Layout with nested children */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested child routes render in DashboardLayout's <Outlet /> */}
            <Route index element={<DashboardHome />} />
            <Route path="workout" element={<Workout />} />
            <Route path="progress" element={<Progress />} />
            <Route path="splits" element={<Splits />} />
            <Route path="nutrition" element={<Calories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="buddy" element={<Buddy />} />
            <Route path="log-workout" element={<LogWorkout />} />
            <Route path="live-session" element={<LiveSession />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
