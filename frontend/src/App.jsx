import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ClientLayout from './layouts/ClientLayout';
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
import MantenimientosList from './pages/mantenimientos/MantenimientosList';
import BackupSoporte from './pages/backup/BackupSoporte';
import TicketsList from './pages/tickets/TicketsList';
import TicketForm from './pages/tickets/TicketForm';
import TicketDetail from './pages/tickets/TicketDetail';
import LicenciasList from './pages/licencias/LicenciasList';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60 * 1000,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            <Route element={<ClientLayout><Outlet /></ClientLayout>}>
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/activos" element={<Activos />} />
                                    <Route path="/activos/:id" element={<ActivoDetail />} />
                                    <Route path="/funcionarios" element={<Funcionarios />} />
                                    <Route path="/reportes" element={<Reportes />} />
                                    <Route path="/actas" element={<ActasList />} />
                                    <Route path="/mantenimientos" element={<MantenimientosList />} />
                                    <Route path="/tickets" element={<TicketsList />} />
                                    <Route path="/tickets/:id" element={<TicketDetail />} />
                                    <Route path="/licencias" element={<LicenciasList />} />
                                </Route>

                                {/* ADMIN y ANALISTA TIC */}
                                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ANALISTA_TIC']} />}>
                                    <Route path="/categorias" element={<Categorias />} />
                                    <Route path="/actas/generar" element={<GenerarActa />} />
                                    <Route path="/importar" element={<ImportarDatos />} />
                                    <Route path="/tickets/nuevo" element={<TicketForm />} />
                                </Route>

                                {/* Solo ADMIN */}
                                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                    <Route path="/usuarios" element={<Usuarios />} />
                                    <Route path="/soporte" element={<BackupSoporte />} />
                                </Route>

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Route>
                        </Routes>
                    </ErrorBoundary>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
