import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import UsuarioForm from './components/UsuarioForm';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Error desconocido';
            setError(`Error al cargar usuarios: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

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
            fetchUsuarios();
        }
    };

    if (loading && usuarios.length === 0) return <div className="p-4">Cargando usuarios...</div>;

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Usuarios</h1>
                        Lista de todos los usuarios del sistema con acceso administrativo o de analista.
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

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Nombre
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Rol
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Estado
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Editar</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {usuario.nombre}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{usuario.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${usuario.rol === 'ADMIN' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' : 'bg-blue-50 text-blue-700 ring-blue-700/10'
                                                    }`}>
                                                    {usuario.rol === 'ANALISTA_TIC' ? 'Analista TIC' : usuario.rol}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${usuario.activo ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'
                                                    }`}>
                                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => handleEdit(usuario)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Editar<span className="sr-only">, {usuario.nombre}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
