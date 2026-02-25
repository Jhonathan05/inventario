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
import MantenimientosList from './pages/mantenimientos/MantenimientosList';
import BackupSoporte from './pages/backup/BackupSoporte';
import TicketsList from './pages/tickets/TicketsList';
import TicketForm from './pages/tickets/TicketForm';
import TicketDetail from './pages/tickets/TicketDetail';


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<MainLayout />}>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/activos" element={<Activos />} />
                            <Route path="/activos/:id" element={<ActivoDetail />} />
                            <Route path="/funcionarios" element={<Funcionarios />} />
                            <Route path="/categorias" element={<Categorias />} />
                            <Route path="/reportes" element={<Reportes />} />
                            <Route path="/actas" element={<ActasList />} />
                            <Route path="/mantenimientos" element={<MantenimientosList />} />
                        </Route>

                        {/* Solo ADMIN y TECNICO */}
                        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECNICO', 'CONSULTA']} />}>
                            <Route path="/tickets" element={<TicketsList />} />
                            <Route path="/tickets/nuevo" element={<TicketForm />} />
                            <Route path="/tickets/:id" element={<TicketDetail />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECNICO']} />}>
                            <Route path="/actas/generar" element={<GenerarActa />} />
                            <Route path="/importar" element={<ImportarDatos />} />
                        </Route>

                        {/* Solo ADMIN */}
                        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/usuarios" element={<Usuarios />} />
                            <Route path="/soporte" element={<BackupSoporte />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
