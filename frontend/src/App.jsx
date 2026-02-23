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
import Reportes from './pages/reportes/Reportes';
import ActasList from './pages/actas/ActasList';
import GenerarActa from './pages/actas/GenerarActa';
import ImportarDatos from './pages/importar/ImportarDatos';
import Catalogos from './pages/configuracion/CatalogosList';
import MantenimientosList from './pages/mantenimientos/MantenimientosList';


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
                            <Route path="/reportes" element={<Reportes />} />
                            <Route path="/actas" element={<ActasList />} />
                            <Route path="/actas/generar" element={<GenerarActa />} />
                            <Route path="/importar" element={<ImportarDatos />} />
                            <Route path="/configuracion/catalogos" element={<Catalogos />} />
                            <Route path="/mantenimientos" element={<MantenimientosList />} />


                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
