import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../lib/utils';

const ActasList = () => {
    const navigate = useNavigate();
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
        link.setAttribute('download', 'Acta.xls');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                        Actas y Novedades
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Historial de asignaciones, devoluciones y traslados</p>
                </div>
                <button
                    onClick={() => navigate('/actas/generar')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Generar Novedad
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funcionario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realizado Por</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Cargando...</td></tr>
                        ) : actas.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay actas registradas</td></tr>
                        ) : (
                            actas.map(acta => (
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {acta.funcionario?.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {acta.creadoPor?.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {acta.archivoUrl && (
                                            <button
                                                onClick={() => handleDownload(acta.archivoUrl)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                Descargar XLS
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActasList;
