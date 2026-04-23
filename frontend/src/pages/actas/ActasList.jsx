import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowDownTrayIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
                responseType: 'blob', // Importante para descargar archivos
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
        // Parsear detalles si vienen como string
        const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;

        // Texto de los activos involucrados
        const activosTexto = snapshot?.activos?.map(a => `${a.placa} ${a.serial} ${a.tipo}`).join(' ') || '';

        // Funcionarios involucrados
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
            {/* Sección de Encabezado: Título y Descripción */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <DocumentTextIcon className="h-6 w-6 text-fnc-600" />
                            </div>
                            Actas y Novedades
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Historial de asignaciones, devoluciones y traslados
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/actas/generar')}
                            className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-bold text-sm"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Generar Novedad
                        </button>
                    )}
                </div>
            </div>

            {/* Sección de Contenido: Filtros y Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar placa, serial, funcionario..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 text-sm bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-16 text-charcoal-400 font-medium">Cargando actas...</div>
                    ) : filteredActas.length === 0 ? (
                        <div className="text-center py-16 text-charcoal-400 font-medium font-bold italic">
                            No se encontraron actas con los criterios de búsqueda.
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Tipo</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Activos</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Entrega</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Recibe</th>
                                                <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
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
                                                    <tr key={acta.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-700 font-bold">
                                                            {formatDate(acta.fecha)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-black rounded-lg uppercase tracking-wider border
                                                            ${acta.tipo === 'ASIGNACION' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                    acta.tipo === 'DEVOLUCION' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                                {acta.tipo}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-charcoal-900 max-w-[180px]">
                                                            <div className="flex flex-wrap gap-1">
                                                                {snapshot?.activos?.map(a => (
                                                                    <span key={a.id} className="bg-fnc-50 border border-fnc-100 px-1.5 py-0.5 rounded text-[10px] font-black text-fnc-700">
                                                                        {a.placa}
                                                                    </span>
                                                                )) || <span className="text-charcoal-400 italic text-xs">Antiguo</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-charcoal-600 font-bold">{entrega}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-charcoal-600 font-bold">{recibe}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => handleDownload(acta.id)}
                                                                className="inline-flex items-center text-[10px] font-black text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-3 py-1.5 transition-all shadow-sm gap-1"
                                                            >
                                                                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                                                                XLS
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
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
                                        <div key={acta.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">{formatDate(acta.fecha)}</p>
                                                    <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-black rounded-lg uppercase tracking-wider border
                                                    ${acta.tipo === 'ASIGNACION' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            acta.tipo === 'DEVOLUCION' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                        {acta.tipo}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDownload(acta.id)}
                                                    className="p-2 text-fnc-600 bg-fnc-50 rounded-lg border border-fnc-100 shadow-sm"
                                                >
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">Activos</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {snapshot?.activos?.map(a => (
                                                        <span key={a.id} className="bg-fnc-50 border border-fnc-100 px-1.5 py-0.5 rounded text-[10px] font-black text-fnc-700">
                                                            {a.placa}
                                                        </span>
                                                    )) || <span className="text-charcoal-400 italic text-xs">Antiguo</span>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
                                                <div>
                                                    <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">Entrega</p>
                                                    <p className="text-xs font-bold text-charcoal-700 truncate">{entrega}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest text-right">Recibe</p>
                                                    <p className="text-xs font-bold text-charcoal-700 truncate text-right">{recibe}</p>
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
