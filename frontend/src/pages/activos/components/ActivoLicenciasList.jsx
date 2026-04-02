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
            toast.success('LICENCIA_VINCULADA_CON_EXITO');
            setIsAssignModalOpen(false);
            onUpdate();
        },
        onError: () => toast.error('!! LINK_FAULT :: REPOSITORY_REJECTED_TX_0x66')
    });

    const unassignMutation = useMutation({
        mutationFn: (id) => licenciasService.update(id, { activoId: null }),
        onSuccess: () => {
             toast.success('LICENCIA_LIBERADA_EN_BUFFER');
             onUpdate();
        },
        onError: () => toast.error('!! UNLINK_FAULT :: BUFFER_STUCK_INTERRUPT')
    });

    const handleAssign = (e) => {
        e.preventDefault();
        if (!selectedLicenciaId) return;
        assignMutation.mutate(selectedLicenciaId);
    };

    return (
        <div className="font-mono animate-fadeIn mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12 px-6">
                <div className="flex items-center gap-6">
                    <div className="w-3 h-3 bg-text-accent animate-pulse"></div>
                    <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.6em]">/ licensed_software_resources_inventory</h3>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="bg-bg-elevated border-2 border-border-strong px-12 py-4 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] transition-all shadow-3xl hover:scale-105 active:scale-95 group relative overflow-hidden"
                    >
                        <span className="relative z-10">[ + ] LINK_NEW_LICENSE_POOL</span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                )}
            </div>

            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden group/sw hover:border-border-strong transition-all relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/sw:text-text-accent transition-colors">SW_VOL_TRACE_STREAM_RX</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse border-spacing-0 min-w-[900px]">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: SOFTWARE_NODE_NAME</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: LICENSE_PROTOCOL</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: KEY_HEX_BUFFER</th>
                                {canEdit && <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {licencias.map((lic) => (
                                <tr key={lic.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                    <td className="px-10 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">
                                        {lic.software.toUpperCase().replace(/ /g, '_')} <span className="text-text-muted opacity-40 ml-4">v{lic.version}</span>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <span className="text-[10px] font-black text-text-primary uppercase tracking-widest bg-bg-base border-2 border-border-default px-4 py-1 group-hover/row:border-text-accent transition-all shadow-md">
                                            /{lic.tipoLicencia}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <div className="text-[11px] font-black text-text-muted font-mono tracking-widest opacity-60 uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px] group-hover/row:opacity-100 transition-opacity">
                                            {lic.llaveLicencia || 'NULL_KEY_OR_OEM_VOL'}
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-10 py-8 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    if(window.confirm(`¿CONFIRMAR_DESVINCULACION_DE_${lic.software.toUpperCase()}? (PREVENT_SW_INCONSISTENCY)`)) {
                                                        unassignMutation.mutate(lic.id);
                                                    }
                                                }}
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest hover:text-text-accent hover:border-text-accent transition-all shadow-xl active:scale-95 group/unlink"
                                            >
                                                <span className="opacity-40 group-hover/unlink:translate-x-1 transition-transform mr-2">!</span>
                                                [ UNLINK_RESOURCE_TX ]
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {licencias.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center text-text-muted text-[12px] font-black uppercase tracking-[0.5em] opacity-40 italic">
                                        ! NO_LICENSED_SOFTWARE_ALLOCATED_IN_THIS_BUFFER_POOL
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Link Assignment Modal Bridge */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-6 text-center">
                        <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn" onClick={() => setIsAssignModalOpen(false)}></div>
                        <div className="relative bg-bg-surface border-2 border-border-default p-12 text-left shadow-3xl w-full max-w-2xl z-10 overflow-hidden animate-fadeInUp">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">POOL_VIRTUAL_ALLOC_TX</div>
                            
                            <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                         <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                                         <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.5em]">
                                             / link_new_license_pool_asset
                                         </h3>
                                    </div>
                                    <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">SOURCE_REPOSITORY: software_pool_main.db</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90">
                                    [ &times; ]
                                </button>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-12">
                                <div className="space-y-6">
                                    <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: SELECT_POOL_NODE_FOR_SUTURE</label>
                                    <div className="relative group">
                                        <select 
                                            className="block w-full bg-bg-base border-2 border-border-default py-6 px-10 text-[13px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner relative z-10"
                                            value={selectedLicenciaId}
                                            onChange={e => setSelectedLicenciaId(e.target.value)}
                                            required
                                        >
                                            <option value="" className="bg-bg-surface text-text-muted opacity-40">[ SELECT_AVAILABLE_LICENSE_STREAM ]</option>
                                            {dispLicencias.map(l => (
                                                <option key={l.id} value={l.id} className="bg-bg-surface">
                                                    {l.software.toUpperCase()} {l.version} // {l.tipoLicencia} // {l.llaveLicencia ? l.llaveLicencia.substring(0,10)+'...' : 'OEM_VOL'}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-hover:text-text-accent transition-colors z-0 font-black text-lg">
                                             &darr;
                                        </div>
                                    </div>
                                    {dispLicencias.length === 0 && !assignMutation.isLoading && (
                                        <p className="text-[9px] text-text-accent font-black uppercase tracking-widest animate-pulse mt-4">! ALERT: NO_AVAILABLE_LICENSES_IN_CURRENT_BUFFER_TX</p>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-border-default/20">
                                    <button
                                        type="button"
                                        onClick={() => setIsAssignModalOpen(false)}
                                        className="flex-1 px-10 py-5 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default hover:border-text-accent transition-all bg-bg-base shadow-xl active:scale-95"
                                    >
                                        [ DISCARD_TX_MOD ]
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={assignMutation.isLoading || !selectedLicenciaId}
                                        className="flex-1 px-10 py-5 text-[12px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.6em] relative overflow-hidden group/exec active:scale-95"
                                    >
                                        <span className="relative z-10">{assignMutation.isLoading ? '[ INITIALIZING_SYNC... ]' : '[ EXECUTE_LINK_TX ]'}</span>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/exec:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivoLicenciasList;
