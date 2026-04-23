import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ticketsService } from '../../api/tickets.service';
import Pagination from '../../components/Pagination';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ExclamationCircleIcon,
    ClockIcon,
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    TicketIcon,
    ArrowPathIcon,
    UserIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const TicketsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...(estadoFiltro && { estado: estadoFiltro }),
        ...(searchTerm && { search: searchTerm })
    };

    const { data: responseData, isLoading: loading } = useQuery({
        queryKey: ['tickets', queryParams],
        queryFn: () => ticketsService.getAll(queryParams),
    });

    const tickets = responseData?.data || [];
    const pagination = responseData?.pagination || { page: 1, pages: 1, total: tickets.length };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleEstadoChange = (val) => {
        setEstadoFiltro(val);
        setCurrentPage(1);
    };

    const getEstadoBadge = (estado) => {
        const config = {
            'CREADO': { cls: 'bg-gray-50 text-gray-700 border-gray-100', Icon: QuestionMarkCircleIcon, label: 'Creado' },
            'EN_CURSO': { cls: 'bg-blue-50 text-blue-700 border-blue-100', Icon: ClockIcon, label: 'En Curso' },
            'SIN_RESPUESTA': { cls: 'bg-red-50 text-red-700 border-red-100', Icon: ExclamationCircleIcon, label: 'Sin Respuesta' },
            'COMPLETADO': { cls: 'bg-green-50 text-green-700 border-green-100', Icon: CheckCircleIcon, label: 'Completado' }
        };
        const c = config[estado] || config['CREADO'];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${c.cls}`}>
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
            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${config[prioridad] || config['MEDIA']}`}>
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

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <TicketIcon className="h-6 w-6 text-fnc-600" />
                            </div>
                            Mesa de Ayuda (ITSM)
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Gestión de incidentes y requerimientos técnicos
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/tickets/nuevo')}
                            className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-bold text-sm uppercase tracking-widest"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nuevo Caso
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Buscar por título, funcionario o ID..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 transition-all text-sm font-medium bg-white shadow-sm"
                            />
                        </div>
                        <div className="w-full sm:w-64 relative">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            <select
                                value={estadoFiltro}
                                onChange={(e) => handleEstadoChange(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fnc-500 bg-white text-sm appearance-none font-medium transition-all"
                            >
                                <option value="">Todos los estados</option>
                                <option value="COMPLETADO">Completados</option>
                                <option value="CREADO">Creados</option>
                                <option value="EN_CURSO">En Curso</option>
                                <option value="SIN_RESPUESTA">Sin Respuesta</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-fnc-400 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Cargando casos...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Caso</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Funcionario</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Asignado a</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {ticketsFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-20 text-center bg-gray-50/20">
                                                        <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                                                        <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron casos</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                ticketsFiltrados.map((ticket) => (
                                                    <tr
                                                        key={ticket.id}
                                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                        className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-black text-fnc-600">#{ticket.id}</td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-bold text-charcoal-900 truncate max-w-xs">{ticket.titulo}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{ticket.tipo}</span>
                                                                <span className="text-charcoal-200">•</span>
                                                                {getPrioridadBadge(ticket.prioridad)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full bg-fnc-50 text-fnc-700 flex items-center justify-center font-black text-xs mr-3 border border-fnc-100 shadow-sm">
                                                                    {ticket.funcionario?.nombre?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-charcoal-900">{ticket.funcionario?.nombre}</p>
                                                                    <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{ticket.funcionario?.area || 'Sin área'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">{getEstadoBadge(ticket.estado)}</td>
                                                        <td className="px-6 py-4 text-xs font-bold text-charcoal-600">
                                                            {ticket.asignadoA ? ticket.asignadoA.nombre : <span className="text-charcoal-300 italic font-normal">Sin asignar</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-bold text-charcoal-500">
                                                            {new Date(ticket.creadoEn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                {ticketsFiltrados.map((ticket) => (
                                    <div 
                                        key={ticket.id} 
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 active:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-fnc-600 uppercase tracking-widest bg-fnc-50 px-2 py-0.5 rounded border border-fnc-100">#{ticket.id}</span>
                                            {getEstadoBadge(ticket.estado)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-charcoal-900 text-sm">{ticket.titulo}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{ticket.tipo}</span>
                                                <span className="text-charcoal-200">•</span>
                                                {getPrioridadBadge(ticket.prioridad)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold border-t border-gray-50 pt-3 text-charcoal-500 italic">
                                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {ticket.funcionario?.nombre}</span>
                                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {new Date(ticket.creadoEn).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                {ticketsFiltrados.length === 0 && (
                                    <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
                                        <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                                        <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron casos</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {!loading && tickets.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.pages || 1}
                            totalItems={pagination.total || tickets.length}
                            itemsPerPage={itemsPerPage}
                            currentCount={tickets.length}
                            onPageChange={(p) => {
                                setCurrentPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsList;
