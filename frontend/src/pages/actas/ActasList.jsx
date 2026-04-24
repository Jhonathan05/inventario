import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { 
    PlusIcon, 
    ArrowDownTrayIcon, 
    DocumentTextIcon, 
    MagnifyingGlassIcon,
    ArrowPathIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const ActasList = () => {
    const navigate = useNavigate();
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    useEffect(() => {
        loadActas();
    }, []);

    const loadActas = async () => {
        try {
            const res = await axios.get('/actas');
            setActas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (actaId) => {
        try {
            const response = await axios({
                url: `/actas/${actaId}/download-xlsx`,
                method: 'GET',
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Acta_${actaId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error descargando el acta:', err);
            alert('Error al generar el archivo para descargar.');
        }
    };

    const filteredActas = actas.filter(acta => {
        const s = searchTerm.toLowerCase();
        const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;
        const activosTexto = snapshot?.activos?.map(a => `${a.placa} ${a.serial} ${a.tipo}`).join(' ') || '';
        const funcionarioOrigen = snapshot?.funcionarioOrigen?.nombre || acta.funcionario?.nombre || '';
        const funcionarioDestino = snapshot?.funcionarioDestino?.nombre || (acta.tipo === 'ASIGNACION' ? acta.funcionario?.nombre : '');
        const realizadoPor = acta.creadoPor?.nombre || '';

        return (
            acta.tipo.toLowerCase().includes(s) ||
            funcionarioOrigen.toLowerCase().includes(s) ||
            funcionarioDestino.toLowerCase().includes(s) ||
            realizadoPor.toLowerCase().includes(s) ||
            activosTexto.toLowerCase().includes(s)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Libro de Actas & Novedades</h1>
                    <p className="page-header-subtitle">
                        Historial normativo de asignaciones, devoluciones y movimientos ({filteredActas.length || 0} actas)
                    </p>
                </div>
                {canEdit && (
                    <button
                        type="button"
                        onClick={() => navigate('/actas/generar')}
                        className="btn-primary"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Generar Registro
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
                                placeholder="Busca por placa, funcionario, tipo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100"
                                title="Limpiar búsqueda"
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
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando archivo documental...</p>
                        </div>
                    ) : filteredActas.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/20">
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">No se encontraron registros de actas</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Fecha registro</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo movimiento</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Activos vinculados</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Origen / Entrega</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Destino / Recibe</th>
                                            <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filteredActas.map(acta => {
                                            const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;
                                            let entrega = '';
                                            let recibe = '';
                                            if (acta.tipo === 'ASIGNACION') {
                                                entrega = acta.creadoPor?.nombre;
                                                recibe = acta.funcionario?.nombre;
                                            } else if (acta.tipo === 'DEVOLUCION') {
                                                entrega = acta.funcionario?.nombre;
                                                recibe = acta.creadoPor?.nombre;
                                            } else if (acta.tipo === 'TRASLADO') {
                                                entrega = snapshot?.funcionarioOrigen?.nombre || acta.funcionario?.nombre;
                                                recibe = snapshot?.funcionarioDestino?.nombre || '-';
                                            }

                                            return (
                                                <tr key={acta.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-6 text-[12px] font-semibold text-charcoal-600">
                                                        {formatDate(acta.fecha)}
                                                    </td>
                                                    <td className="px-6 py-6 transition-transform group-hover:translate-x-1">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize border 
                                                        ${acta.tipo === 'ASIGNACION' ? 'bg-green-500/10 text-green-600 border-green-500/10' :
                                                                acta.tipo === 'DEVOLUCION' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : 'bg-blue-500/10 text-blue-600 border-blue-500/10'}`}>
                                                            {acta.tipo?.toLowerCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 max-w-[200px]">
                                                        <div className="flex flex-wrap gap-1.5 font-bold">
                                                            {snapshot?.activos?.map(a => (
                                                                <span key={a.id} className="bg-primary/5 border border-primary/10 px-2 py-1 rounded-full text-[9px] text-primary">
                                                                    {a.placa}
                                                                </span>
                                                            )) || <span className="text-charcoal-300 italic text-[10px]">Sin inventario</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-[11px] font-bold text-charcoal-400 capitalize tracking-tight">{entrega?.toLowerCase()}</td>
                                                    <td className="px-6 py-6 text-[11px] font-bold text-charcoal-400 capitalize tracking-tight">{recibe?.toLowerCase()}</td>
                                                    <td className="px-6 py-6 text-right">
                                                        <button
                                                            onClick={() => handleDownload(acta.id)}
                                                            className="inline-flex items-center gap-2 p-2 text-charcoal-400 hover:text-primary rounded-full hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
                                                            title="Descargar Excel"
                                                        >
                                                            <TableCellsIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {filteredActas.map(acta => {
                                    const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;
                                    let entrega = '';
                                    let recibe = '';
                                    if (acta.tipo === 'ASIGNACION') {
                                        entrega = acta.creadoPor?.nombre;
                                        recibe = acta.funcionario?.nombre;
                                    } else if (acta.tipo === 'DEVOLUCION') {
                                        entrega = acta.funcionario?.nombre;
                                        recibe = acta.creadoPor?.nombre;
                                    } else if (acta.tipo === 'TRASLADO') {
                                        entrega = snapshot?.funcionarioOrigen?.nombre || acta.funcionario?.nombre;
                                        recibe = snapshot?.funcionarioDestino?.nombre || '-';
                                    }

                                    return (
                                        <div key={acta.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-charcoal-400">{formatDate(acta.fecha)}</p>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize border 
                                                    ${acta.tipo === 'ASIGNACION' ? 'bg-green-500/10 text-green-600 border-green-500/10' :
                                                            acta.tipo === 'DEVOLUCION' ? 'bg-rose-500/10 text-rose-600 border-rose-500/10' : 'bg-blue-500/10 text-blue-600 border-blue-500/10'}`}>
                                                        {acta.tipo?.toLowerCase()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDownload(acta.id)}
                                                    className="p-3 text-primary bg-primary/5 rounded-full border border-primary/10 shadow-sm"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-charcoal-400">Activos vinculados</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {snapshot?.activos?.map(a => (
                                                        <span key={a.id} className="bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-full text-[9px] font-bold text-primary">
                                                            {a.placa}
                                                        </span>
                                                    )) || <span className="text-charcoal-300 italic text-[10px]">Sin registro</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 font-bold">
                                                <div>
                                                    <p className="text-[10px] text-charcoal-400">Origen</p>
                                                    <p className="text-[11px] text-charcoal-700 capitalize truncate">{entrega?.toLowerCase()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-charcoal-400 text-right">Destino</p>
                                                    <p className="text-[11px] text-charcoal-700 capitalize truncate text-right">{recibe?.toLowerCase()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActasList;
