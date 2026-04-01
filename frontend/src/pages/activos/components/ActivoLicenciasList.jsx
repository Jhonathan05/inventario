import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { licenciasService } from '../../../api/licencias.service';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ActivoLicenciasList = ({ activoId, licencias = [], onUpdate }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const queryClient = useQueryClient();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedLicenciaId, setSelectedLicenciaId] = useState('');

    // Fetch available licenses (unassigned)
    const { data: availableLicenciasRes } = useQuery({
        queryKey: ['licencias_disponibles'],
        queryFn: () => licenciasService.getAll({ asignada: 'false', limit: 100 }),
        enabled: isAssignModalOpen,
    });

    const dispLicencias = availableLicenciasRes?.data || [];

    const assignMutation = useMutation({
        mutationFn: (id) => licenciasService.update(id, { activoId }),
        onSuccess: () => {
            queryClient.invalidateQueries(['licencias_disponibles']);
            toast.success('Licencia asignada exitosamente');
            setIsAssignModalOpen(false);
            onUpdate();
        },
        onError: () => toast.error('Error al asignar licencia')
    });

    const unassignMutation = useMutation({
        mutationFn: (id) => licenciasService.update(id, { activoId: null }),
        onSuccess: () => {
             toast.success('Licencia desasignada exitosamente');
             onUpdate();
        },
        onError: () => toast.error('Error al desasignar licencia')
    });

    const handleAssign = (e) => {
        e.preventDefault();
        if (!selectedLicenciaId) return;
        assignMutation.mutate(selectedLicenciaId);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Software Instalado</h3>
                {canEdit && (
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Vincular Licencia
                    </button>
                )}
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Software</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Key / Serial</th>
                            {canEdit && <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {licencias.map((lic) => (
                            <tr key={lic.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                    {lic.software} {lic.version}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {lic.tipoLicencia}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">
                                    {lic.llaveLicencia || '-'}
                                </td>
                                {canEdit && (
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                        <button
                                            onClick={() => {
                                                if(window.confirm(`¿Liberar esta licencia de ${lic.software}?`)) {
                                                    unassignMutation.mutate(lic.id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Desvincular
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {licencias.length === 0 && (
                            <tr><td colSpan="4" className="py-6 text-center text-gray-500">No hay software licenciado en este equipo.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Asignación */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Vincular Nueva Licencia</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
                        </div>
                        <form onSubmit={handleAssign} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Software del Pool</label>
                                <select 
                                    className="w-full border rounded-md p-2 text-sm"
                                    value={selectedLicenciaId}
                                    onChange={e => setSelectedLicenciaId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Escoger licencia disponible --</option>
                                    {dispLicencias.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.software} {l.version} ({l.tipoLicencia}) - {l.llaveLicencia ? l.llaveLicencia.substring(0,8)+'...' : 'OEM'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={assignMutation.isLoading || !selectedLicenciaId} className="flex-1 bg-indigo-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-500 disabled:bg-gray-400">
                                    Vincular Software
                                </button>
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 bg-white border border-gray-300 text-gray-700 rounded-md py-2 text-sm font-semibold hover:bg-gray-50">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivoLicenciasList;
