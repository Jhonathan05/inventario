import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user && allowedRoles && !allowedRoles.includes(user.rol)) {
            toast.error('Acceso denegado: Tu rol no tiene los permisos suficientes.');
        }
    }, [user, allowedRoles]);

    if (loading) {
        return <div className="flex min-h-screen justify-center items-center">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
