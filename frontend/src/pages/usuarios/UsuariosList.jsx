import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../../api/usuarios.service';
import UsuarioForm from './components/UsuarioForm';
import Pagination from '../../components/Pagination';

const Usuarios = () => {
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

    if (loading && usuarios.length === 0) return <div className="p-4">Cargando usuarios...</div>;


    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Usuarios</h1>
                    <p className="text-sm text-gray-500">Lista de todos los usuarios del sistema con acceso administrativo o de analista.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Agregar Usuario
                    </button>
                </div>
            </div>

            {error && <div className="mt-4 p-4 text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}

            <div className="mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><span className="sr-only">Editar</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{usuario.nombre}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{usuario.email}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${usuario.rol === 'ADMIN' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : 'bg-blue-50 text-blue-700 ring-blue-700/10'}`}>
                                                {usuario.rol === 'ANALISTA_TIC' ? 'Analista TIC' : usuario.rol}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${usuario.activo ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button onClick={() => handleEdit(usuario)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {!loading && usuarios.length > 0 && (
                    <div className="mt-6">
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

export default Usuarios;
