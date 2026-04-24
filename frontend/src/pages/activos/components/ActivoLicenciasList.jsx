import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { licenciasService } from '../../../api/licencias.service';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h3 className="text-xl font-black text-charcoal-900 tracking-tight capitalize">Software Instalado</h3>
                {canEdit && (
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="btn-primary"
                    >
                        Vincular Licencia
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-transparent border-b border-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Software</th>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo</th>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Key / Serial</th>
                            {canEdit && <th className="px-6 py-4 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {licencias.map((lic) => (
                            <tr key={lic.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="whitespace-nowrap px-6 py-4 text-[13px] font-semibold text-charcoal-800">
                                    {lic.software} {lic.version}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/10">
                                        {lic.tipoLicencia?.toLowerCase()}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-[12px] text-charcoal-500 font-mono">
                                    {lic.llaveLicencia || '-'}
                                </td>
                                {canEdit && (
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                if(window.confirm(`¿Liberar esta licencia de ${lic.software}?`)) {
                                                    unassignMutation.mutate(lic.id);
                                                }
                                            }}
                                            className="text-rose-600 hover:text-rose-800 font-bold text-[11px] hover:underline"
                                        >
                                            Desvincular
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {licencias.length === 0 && (
                            <tr><td colSpan="4" className="py-12 text-center text-charcoal-300 italic font-bold text-[11px]">No hay software licenciado en este equipo.</td></tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Asignación */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight">Vincular Nueva Licencia</h3>
                                <p className="text-[11px] font-bold text-charcoal-400 capitalize mt-1">Gestión de activos digitales</p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAssign} className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Seleccionar Software del Pool *</label>
                                <select 
                                    className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none"
                                    value={selectedLicenciaId}
                                    onChange={e => setSelectedLicenciaId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Escoger licencia disponible --</option>
                                    {dispLicencias.map(l => (
                                        <option key={l.id} value={l.id}>
                                            {l.software} {l.version} ({l.tipoLicencia})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    type="submit" 
                                    disabled={assignMutation.isLoading || !selectedLicenciaId} 
                                    className="flex-1 btn-primary"
                                >
                                    Vincular Software
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsAssignModalOpen(false)} 
                                    className="flex-1 btn-secondary"
                                >
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
