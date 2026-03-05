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
        <div className="p-6">
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activos (Placa)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregado Por</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recibido Por</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center">Cargando...</td></tr>
                        ) : filteredActas.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No se encontraron actas</td></tr>
                        ) : (
                            filteredActas.map(acta => {
                                const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;

                                // Lógica de entrega/recepción para la tabla
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
                                    <tr key={acta.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(acta.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${acta.tipo === 'ASIGNACION' ? 'bg-green-100 text-green-800' :
                                                    acta.tipo === 'DEVOLUCION' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {acta.tipo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs overflow-hidden">
                                            <div className="flex flex-wrap gap-1">
                                                {snapshot?.activos?.map(a => (
                                                    <span key={a.id} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                                                        {a.placa}
                                                    </span>
                                                )) || <span className="text-gray-400 italic">Antiguo</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {entrega}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {recibe}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDownload(acta.id)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                                                title="Re-generar y descargar Excel"
                                            >
                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                Descargar XLS
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
    );
};

export default ActasList;
