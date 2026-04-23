import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    UserGroupIcon, 
    UserPlusIcon, 
    MagnifyingGlassIcon, 
    EnvelopeIcon, 
    ShieldCheckIcon, 
    CheckCircleIcon, 
    XCircleIcon 
} from '@heroicons/react/24/outline';
import { usuariosService } from '../../api/usuarios.service';
import UsuarioForm from './components/UsuarioForm';
import Pagination from '../../components/Pagination';

const UsuariosList = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const { data: usuarios = [], isLoading: loading, error } = useQuery({
        queryKey: ['usuarios'],
        queryFn: usuariosService.getAll,
    });

    // Paginación client-side
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(usuarios.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = usuarios.slice(startIndex, startIndex + itemsPerPage);

    const handleCreate = () => {
        setSelectedUsuario(null);
        setIsModalOpen(true);
    };

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    const handleCloseModal = (shouldRefresh) => {
        setIsModalOpen(false);
        setSelectedUsuario(null);
        if (shouldRefresh) {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <UserGroupIcon className="w-6 h-6 text-fnc-600" />
                            </div>
                            Usuarios
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Control de acceso y gestión de perfiles de usuario
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-bold text-sm uppercase tracking-wider"
                        >
                            <UserPlusIcon className="w-4 h-4" />
                            Agregar Usuario
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Rol</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                                                <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {currentItems.map((usuario) => (
                                                <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-charcoal-900">{usuario.nombre}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-charcoal-500">{usuario.email}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase border ${usuario.rol === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                            {usuario.rol === 'ANALISTA_TIC' ? 'Analista TIC' : usuario.rol}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase border ${usuario.activo ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                            {usuario.activo ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleEdit(usuario)} 
                                                            className="text-[10px] font-black text-fnc-600 hover:bg-fnc-50 px-3 py-1.5 rounded-lg transition-all uppercase"
                                                        >
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                {currentItems.map((usuario) => (
                                    <div key={usuario.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-charcoal-900 text-sm">{usuario.nombre}</p>
                                                <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">{usuario.email}</p>
                                            </div>
                                            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase border ${usuario.activo ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold border-t border-gray-50 pt-3">
                                            <span className="text-charcoal-400 uppercase tracking-widest flex items-center gap-1">
                                                <ShieldCheckIcon className="w-3 h-3" /> {usuario.rol}
                                            </span>
                                            <button 
                                                onClick={() => handleEdit(usuario)} 
                                                className="text-fnc-600 font-black uppercase"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {error && <div className="p-4 text-red-600 bg-red-50 border-t border-red-100 font-bold text-xs uppercase tracking-widest">{error}</div>}

                {!loading && usuarios.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={usuarios.length}
                            itemsPerPage={itemsPerPage}
                            currentCount={currentItems.length}
                            onPageChange={(p) => {
                                setCurrentPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <UsuarioForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    usuario={selectedUsuario}
                />
            )}
        </div>
    );
};

export default UsuariosList;
