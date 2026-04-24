import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
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
    CalendarIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '9999px',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: '600',
        borderColor: state.isFocused ? '#8d1024' : '#f3f4f6',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        '&:hover': {
            borderColor: '#8d1024'
        },
        transition: 'all 0.2s ease',
        textTransform: 'capitalize'
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '12px',
        fontWeight: state.isSelected ? '700' : '600',
        backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : 'transparent',
        color: state.isSelected ? '#111827' : '#4b5563',
        cursor: 'pointer',
        padding: '10px 16px',
        textTransform: 'capitalize',
        '&:active': {
            backgroundColor: '#f3f4f6'
        }
    }),
    valueContainer: (base) => ({
        ...base,
        textTransform: 'capitalize'
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        padding: '4px',
        zIndex: 50
    })
};

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

    const getEstadoBadge = (estado) => {
        const config = {
            'CREADO': { cls: 'bg-gray-500/10 text-gray-600 border-gray-500/20', Icon: QuestionMarkCircleIcon, label: 'creado' },
            'EN_CURSO': { cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20', Icon: ClockIcon, label: 'en curso' },
            'SIN_RESPUESTA': { cls: 'bg-rose-500/10 text-rose-600 border-rose-500/20', Icon: ExclamationCircleIcon, label: 'sin respuesta' },
            'COMPLETADO': { cls: 'bg-green-500/10 text-green-600 border-green-500/20', Icon: CheckCircleIcon, label: 'completado' }
        };
        const c = config[estado] || config['CREADO'];
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold capitalize border ${c.cls}`}>
                <c.Icon className="w-3.5 h-3.5" />
                {c.label}
            </span>
        );
    };

    const getPrioridadBadge = (prioridad) => {
        const config = {
            'BAJA': 'bg-gray-500/10 text-gray-500',
            'MEDIA': 'bg-blue-500/10 text-blue-500',
            'ALTA': 'bg-amber-500/10 text-amber-500',
            'CRITICA': 'bg-rose-500/10 text-rose-600 font-bold'
        };
        return (
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold capitalize border border-transparent ${config[prioridad] || config['MEDIA']}`}>
                {prioridad?.toLowerCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Mesa de Ayuda TIC</h1>
                    <p className="page-header-subtitle">
                        Centro de gestión de incidentes y servicios tecnológicos ({pagination.total || 0} tickets)
                    </p>
                </div>
                {canEdit && (
                    <button
                        type="button"
                        onClick={() => navigate('/tickets/nuevo')}
                        className="btn-primary"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nuevo Ticket
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="relative group w-full xl:max-w-md">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Busca por título, funcionario o ID..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                        <div className="w-full xl:w-64">
                            <Select
                                styles={customSelectStyles}
                                options={[
                                    { value: '', label: 'Cualquier Estado' },
                                    { value: 'COMPLETADO', label: 'Completado' },
                                    { value: 'CREADO', label: 'Creado' },
                                    { value: 'EN_CURSO', label: 'En curso' },
                                    { value: 'SIN_RESPUESTA', label: 'Sin respuesta' }
                                ]}
                                value={{ value: estadoFiltro, label: estadoFiltro ? estadoFiltro.replace('_', ' ')?.toLowerCase() : 'Cualquier Estado' }}
                                onChange={o => { setEstadoFiltro(o?.value || ''); setCurrentPage(1); }}
                                isSearchable={false}
                            />
                        </div>
                        {(searchTerm || estadoFiltro) && (
                            <button
                                onClick={() => { setSearchTerm(''); setEstadoFiltro(''); setCurrentPage(1); }}
                                className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100"
                                title="Limpiar filtros"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando casos...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Ticket</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Solicitante</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Estado</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Responsable</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Fecha</th>
                                            <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {tickets.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-20 text-center bg-gray-50/20">
                                                    <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">No se encontraron tickets registrados</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            tickets.map((ticket) => (
                                                <tr
                                                    key={ticket.id}
                                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                    className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                                                >
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-primary tracking-tight">#{ticket.id}</span>
                                                            <p className="text-[13px] font-semibold text-charcoal-800 truncate max-w-[200px] capitalize tracking-tight">{ticket.titulo?.toLowerCase()}</p>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <span className="text-[10px] font-bold text-charcoal-400 capitalize opacity-70">{ticket.tipo?.toLowerCase()}</span>
                                                                <span className="text-charcoal-200">•</span>
                                                                {getPrioridadBadge(ticket.prioridad)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-gray-50 text-charcoal-400 border border-gray-100 flex items-center justify-center font-bold text-[11px]">
                                                                {ticket.funcionario?.nombre?.charAt(0) || '?'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-[12px] font-semibold text-charcoal-700 capitalize tracking-tight">{ticket.funcionario?.nombre?.toLowerCase()}</p>
                                                                <p className="text-[10px] font-bold text-charcoal-400 capitalize opacity-70">{ticket.funcionario?.area?.toLowerCase() || 'sin área'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">{getEstadoBadge(ticket.estado)}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        {ticket.asignadoA ? (
                                                            <span className="text-[12px] text-charcoal-700 font-semibold capitalize tracking-tight bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{ticket.asignadoA.nombre?.toLowerCase()}</span>
                                                        ) : (
                                                            <span className="text-[10px] text-charcoal-300 font-bold italic capitalize">esperando técnico</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-6 text-[12px] font-mono text-charcoal-400 opacity-80">
                                                        {new Date(ticket.creadoEn).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <button className="p-2 rounded-full text-charcoal-300 group-hover:text-primary transition-all">
                                                            <ChevronRightIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {tickets.map((ticket) => (
                                    <div 
                                        key={ticket.id} 
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 active:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full border border-primary/10">#{ticket.id}</span>
                                            {getEstadoBadge(ticket.estado)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-charcoal-800 text-[13px] capitalize">{ticket.titulo?.toLowerCase()}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-[10px] font-bold text-charcoal-400 capitalize opacity-70">{ticket.tipo?.toLowerCase()}</span>
                                                <span className="text-charcoal-200">•</span>
                                                {getPrioridadBadge(ticket.prioridad)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold border-t border-gray-50 pt-4 opacity-70">
                                            <span className="flex items-center gap-1.5 capitalize"><UserIcon className="w-4 h-4 text-primary" /> {ticket.funcionario?.nombre?.toLowerCase()}</span>
                                            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-primary" /> {new Date(ticket.creadoEn).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {!loading && tickets.length > 0 && (
                    <div className="p-4 border-t border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.pages || 1}
                            totalItems={pagination.total || tickets.length}
                            itemsPerPage={itemsPerPage}
                            currentCount={tickets.length}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsList;
