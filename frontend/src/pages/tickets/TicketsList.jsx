import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ExclamationCircleIcon,
    ClockIcon,
    CheckCircleIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const TicketsList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarTickets();
    }, [estadoFiltro]);

    const cargarTickets = async () => {
        try {
            setLoading(true);
            const params = estadoFiltro ? { estado: estadoFiltro } : {};
            const res = await api.get('/tickets', { params });
            setTickets(res.data);
        } catch (error) {
            console.error('Error cargando tickets:', error);
            toast.error('Error al cargar la lista de casos');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoBadge = (estado) => {
        const config = {
            'CREADO': { cls: 'bg-gray-100 text-gray-800', Icon: QuestionMarkCircleIcon, label: 'Creado' },
            'EN_CURSO': { cls: 'bg-blue-100 text-blue-800', Icon: ClockIcon, label: 'En Curso' },
            'SIN_RESPUESTA': { cls: 'bg-red-100 text-red-800', Icon: ExclamationCircleIcon, label: 'Sin Respuesta' },
            'COMPLETADO': { cls: 'bg-green-100 text-green-800', Icon: CheckCircleIcon, label: 'Completado' }
        };
        const c = config[estado] || config['CREADO'];
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>
                <c.Icon className="w-3.5 h-3.5" />
                {c.label}
            </span>
        );
    };

    const getPrioridadBadge = (prioridad) => {
        const config = {
            'BAJA': 'bg-gray-100 text-gray-700',
            'MEDIA': 'bg-blue-100 text-blue-700',
            'ALTA': 'bg-orange-100 text-orange-700',
            'CRITICA': 'bg-red-100 text-red-800 font-bold'
        };
        return (
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${config[prioridad] || config['MEDIA']}`}>
                {prioridad}
            </span>
        );
    };

    const ticketsFiltrados = tickets.filter(t => {
        const term = searchTerm.toLowerCase();
        return (
            t.titulo?.toLowerCase().includes(term) ||
            t.funcionario?.nombre?.toLowerCase().includes(term) ||
            String(t.id).includes(term)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mesa de Ayuda (ITSM)</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de incidentes y requerimientos</p>
                </div>
                <button
                    onClick={() => navigate('/tickets/nuevo')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nuevo Caso
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por título, funcionario o ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="w-full sm:w-64 relative">
                    <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm appearance-none"
                    >
                        <option value="">Todos los estados</option>
                        <option value="CREADO">Creados</option>
                        <option value="EN_CURSO">En Curso</option>
                        <option value="SIN_RESPUESTA">Sin Respuesta</option>
                        <option value="COMPLETADO">Completados</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Caso</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Funcionario</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asignado a</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ticketsFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500">No se encontraron casos</p>
                                    </td>
                                </tr>
                            ) : (
                                ticketsFiltrados.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600">#{ticket.id}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{ticket.titulo}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{ticket.tipo}</span>
                                                <span className="text-gray-300">•</span>
                                                {getPrioridadBadge(ticket.prioridad)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mr-3">
                                                    {ticket.funcionario?.nombre?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{ticket.funcionario?.nombre}</p>
                                                    <p className="text-xs text-gray-500">{ticket.funcionario?.area || 'Sin área'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getEstadoBadge(ticket.estado)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {ticket.asignadoA ? ticket.asignadoA.nombre : <span className="text-gray-400 italic">Sin asignar</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(ticket.creadoEn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TicketsList;
