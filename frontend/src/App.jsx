import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/usuarios/UsuariosList';
import Categorias from './pages/categorias/CategoriasList';
import Activos from './pages/activos/ActivosList';
import ActivoDetail from './pages/activos/ActivoDetail';
import Funcionarios from './pages/funcionarios/FuncionariosList';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/activos" element={<Activos />} />
                            <Route path="/activos/:id" element={<ActivoDetail />} />
                            <Route path="/funcionarios" element={<Funcionarios />} />
                            <Route path="/usuarios" element={<Usuarios />} />
                            <Route path="/categorias" element={<Categorias />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
