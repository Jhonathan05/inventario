import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowDownTrayIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../lib/utils';

const ActasList = () => {
    const navigate = useNavigate();
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                        Actas y Novedades
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Historial de asignaciones, devoluciones y traslados</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar placa, serial, funcionario..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/actas/generar')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 shrink-0 shadow-sm"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Generar Novedad</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
            </div>

            <div className="glass rounded-2xl border border-charcoal-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead className="bg-charcoal-50 border-b border-charcoal-100 text-xs uppercase tracking-wider text-charcoal-500">
                            <tr>
                                <th className="px-6 py-4 font-bold">Fecha</th>
                                <th className="px-6 py-4 font-bold">Tipo</th>
                                <th className="px-6 py-4 font-bold">Activos (Placa)</th>
                                <th className="px-6 py-4 font-bold">Entregado Por</th>
                                <th className="px-6 py-4 font-bold">Recibido Por</th>
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center text-charcoal-400 font-medium">Cargando...</td></tr>
                            ) : filteredActas.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center text-charcoal-400 font-medium">No se encontraron actas</td></tr>
                            ) : (
                                filteredActas.map(acta => {
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
                                        <tr key={acta.id} className="hover:bg-fnc-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-500 font-medium">
                                                {formatDate(acta.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 inline-flex text-[10px] leading-5 font-black rounded-lg uppercase tracking-wider border border-opacity-50
                                                ${acta.tipo === 'ASIGNACION' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        acta.tipo === 'DEVOLUCION' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'} py-1`}>
                                                    {acta.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-charcoal-900 max-w-[180px]">
                                                <div className="flex flex-wrap gap-1">
                                                    {snapshot?.activos?.map(a => (
                                                        <span key={a.id} className="bg-charcoal-50 border border-charcoal-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-charcoal-700">
                                                            {a.placa}
                                                        </span>
                                                    )) || <span className="text-charcoal-400 italic text-xs">Antiguo</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-700 font-semibold">{entrega}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-700 font-semibold">{recibe}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDownload(acta.id)}
                                                    className="inline-flex items-center text-xs font-bold text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-3 py-1.5 transition-colors shadow-sm gap-1 ml-auto"
                                                    title="Re-generar y descargar Excel"
                                                >
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                    XLS
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActasList;
