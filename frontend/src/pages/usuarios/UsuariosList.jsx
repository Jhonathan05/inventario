import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    UserGroupIcon, 
    UserPlusIcon, 
    MagnifyingGlassIcon, 
    EnvelopeIcon, 
    ShieldCheckIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { usuariosService } from '../../api/usuarios.service';
import UsuarioForm from './components/UsuarioForm';
import Pagination from '../../components/Pagination';

const UsuariosList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [search, setSearch] = useState('');

    const { data: usuarios = [], isLoading: loading, error } = useQuery({
        queryKey: ['usuarios'],
        queryFn: usuariosService.getAll,
    });

    const filteredUsuarios = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Paginación client-side
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredUsuarios.slice(startIndex, startIndex + itemsPerPage);

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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative group w-full max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Busca por nombre o email..."
                            className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="btn-primary w-full md:w-auto"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        Crear Usuario
                    </button>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando perfiles...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Usuario</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Email</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Rol / Permisos</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Estado</th>
                                            <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {currentItems.map((usuario) => (
                                            <tr key={usuario.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-charcoal-400">
                                                            {usuario.nombre?.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-charcoal-800 text-[13px] capitalize tracking-tight">{usuario.nombre?.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-[12px] font-medium text-charcoal-500">{usuario.email}</td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold capitalize border ${usuario.rol === 'ADMIN' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}>
                                                        {usuario.rol === 'ANALISTA_TIC' ? 'Analista tic' : usuario.rol?.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold capitalize border ${usuario.activo ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                                    <button 
                                                        onClick={() => handleEdit(usuario)} 
                                                        className="text-charcoal-300 hover:text-primary p-2 rounded-full hover:bg-primary/5 transition-all"
                                                        title="Editar Usuario"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {currentItems.map((usuario) => (
                                    <div key={usuario.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-charcoal-400">
                                                    {usuario.nombre?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-charcoal-800 text-sm capitalize">{usuario.nombre?.toLowerCase()}</p>
                                                    <p className="text-[11px] text-charcoal-400 font-medium">{usuario.email}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${usuario.activo ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold border-t border-gray-50 pt-4">
                                            <span className="text-charcoal-400 capitalize tracking-tight flex items-center gap-1.5 opacity-70">
                                                <ShieldCheckIcon className="w-4 h-4" /> {usuario.rol?.toLowerCase()}
                                            </span>
                                            <button 
                                                onClick={() => handleEdit(usuario)} 
                                                className="text-primary font-bold capitalize bg-primary/10 px-4 py-1.5 rounded-full"
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

                {error && <div className="p-6 text-rose-600 bg-rose-50/50 border-t border-rose-100 font-bold text-[11px] uppercase tracking-widest">{error.message}</div>}

                {!loading && filteredUsuarios.length > 0 && (
                    <div className="p-4 border-t border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredUsuarios.length}
                            itemsPerPage={itemsPerPage}
                            currentCount={currentItems.length}
                            onPageChange={setCurrentPage}
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
