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
        <div className="font-mono animate-fadeIn mb-24 selection:bg-text-accent selection:text-bg-base">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16 px-10">
                <div className="flex items-center gap-8 group">
                    <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.6)]"></div>
                    <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em] relative leading-none">
                        / LICENSED_SOFTWARE_RESOURCES_ENUM
                        <div className="h-1 w-1/3 bg-text-accent/20 absolute bottom-[-16px] left-0">
                             <div className="h-full bg-text-accent w-1/2 animate-loadingBarSlow"></div>
                        </div>
                    </h3>
                </div>
                {canEdit && (
                    <button
                        onClick={() => setIsAssignModalOpen(true)}
                        className="bg-bg-elevated border-8 border-border-strong px-14 py-6 text-[13px] font-black text-text-accent hover:text-text-primary hover:border-text-accent uppercase tracking-[0.6em] transition-all shadow-[0_30px_80px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-[0.9] group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-6">
                            [ + ] LINK_NEW_LICENSE_POOL_RX
                        </span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                )}
            </div>

            <div className="bg-bg-surface border-8 border-border-default shadow-[0_60px_180px_rgba(0,0,0,0.9)] overflow-hidden group/sw hover:border-text-accent/10 transition-all duration-1000 relative">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-xl font-black uppercase tracking-[2.5em] group-hover/sw:text-text-accent group-hover/sw:opacity-20 transition-all italic italic">SW_VOL_TRACE_STREAM_RX_v4</div>
                <div className="absolute top-0 left-0 w-4 h-full bg-text-accent/10 opacity-30 group-hover/sw:opacity-100 transition-opacity"></div>
                
                <div className="overflow-x-auto custom-scrollbar bg-bg-base/30">
                    <table className="w-full text-left border-collapse border-spacing-0 min-w-[1000px]">
                        <thead>
                            <tr className="bg-bg-base/95 backdrop-blur-md border-b-8 border-border-default shadow-2xl relative z-10">
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-accent border-r-4 border-border-default/30 shadow-inner">:: SOFTWARE_NODE_NAME</th>
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: ALLOC_PROTOCOL</th>
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: KEY_HEX_BUFFER_RX</th>
                                {canEdit && <th className="px-12 py-10 text-right text-[13px] font-black uppercase tracking-[0.8em] text-text-muted shadow-inner bg-bg-surface/50">_IO_CMD</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-border-default/10">
                            {licencias.map((lic) => (
                                <tr key={lic.id} className="hover:bg-text-accent/5 transition-all group/row border-l-8 border-l-transparent hover:border-l-text-accent cursor-default relative">
                                    <td className="px-12 py-10 text-[14px] font-black text-text-primary uppercase tracking-widest border-r-4 border-border-default/10 group-hover:bg-bg-elevated/40 transition-colors">
                                        <div className="flex items-center gap-6 group-hover:translate-x-4 transition-transform italic group-hover:not-italic">
                                             <span className="text-text-accent opacity-20 group-hover:opacity-100 transition-opacity font-normal">ROOT:</span>
                                             {lic.software.toUpperCase().replace(/ /g, '_')} <span className="opacity-40 text-[11px] font-normal not-italic px-4 py-1 border border-border-default ml-2">VER_{lic.version}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 border-r-4 border-border-default/10">
                                        <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em] bg-bg-base border-4 border-border-default px-6 py-2 group-hover/row:border-text-accent transition-all shadow-xl block text-center">
                                            /{lic.tipoLicencia}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 border-r-4 border-border-default/10 group-hover:bg-bg-base/40 transition-colors">
                                        <div className="text-[12px] font-black text-text-muted font-mono tracking-[0.3em] opacity-40 uppercase overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] group-hover:opacity-100 transition-opacity italic">
                                            {lic.llaveLicencia || 'NULL_KEY_OR_OEM_VOL_ACK_RX'}
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-12 py-10 text-right whitespace-nowrap bg-bg-surface/20 group-hover:bg-bg-base/40 transition-colors">
                                            <button
                                                onClick={() => {
                                                    if(window.confirm(`¿CONFIRMAR_DESVINCULACION_DE_${lic.software.toUpperCase()}? (PREVENT_SW_INCONSISTENCY)`)) {
                                                        unassignMutation.mutate(lic.id);
                                                    }
                                                }}
                                                className="inline-flex items-center justify-center text-[11px] font-black text-text-muted border-4 border-border-default bg-bg-base px-8 py-5 uppercase tracking-[0.4em] hover:text-text-accent hover:border-text-accent transition-all shadow-xl active:scale-95 group/unlink relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-4">
                                                     <span className="opacity-40 group-hover/unlink:translate-x-2 transition-transform font-bold">!</span>
                                                     [ UNLINK_RESOURCE_TX ]
                                                </span>
                                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/unlink:opacity-100 transition-opacity"></div>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {licencias.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-48 text-center text-text-muted text-[18px] font-black uppercase tracking-[1.2em] opacity-20 italic animate-pulse">
                                        ! NO_LICENSED_SOFTWARE_ALLOCATED_IN_THIS_BUFFER_CORE
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Inner graphical decoration */}
                <div className="bg-bg-base/80 px-12 py-6 border-t-8 border-border-default border-opacity-30 flex justify-between items-center opacity-40 italic shadow-inner">
                     <span className="text-[10px] font-black uppercase tracking-[1.5em]">SOFTWARE_INVENTORY_v4.2 // NODE_POOL_AF22</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.8em] text-text-accent animate-pulse"># READY_BUFF_TX_0xAF</span>
                </div>
            </div>

            {/* Link Assignment Modal Bridge Overlay */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-6 text-center">
                        <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn duration-500" onClick={() => setIsAssignModalOpen(false)}></div>
                        <div className="relative bg-bg-surface border-4 border-border-default p-14 text-left shadow-[0_60px_150px_rgba(0,0,0,0.9)] w-full max-w-3xl z-10 overflow-hidden animate-fadeInUp group/modal hover:border-text-accent/30 transition-colors">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.8em] italic">POOL_VIRTUAL_ALLOCATION_HOOK_RX</div>
                            
                            <div className="flex items-center justify-between mb-16 border-b-4 border-border-default pb-12 relative">
                                <div className="flex items-center gap-8">
                                     <div className="w-5 h-5 bg-text-accent animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.6)]"></div>
                                     <div>
                                         <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.6em] leading-none mb-4">
                                             / link_new_license_pool_asset
                                         </h3>
                                         <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic">SOURCE_REPOSITORY: software_pool_main.db // 0xFD42_SYNC</p>
                                     </div>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90 p-4 bg-bg-base/30 border-2 border-transparent hover:border-border-default">
                                    [ &times; ]
                                </button>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-16 animate-fadeIn">
                                <div className="space-y-8">
                                    <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-hover/modal:border-text-accent transition-colors italic opacity-60">:: SELECT_POOL_NODE_FOR_SUTURE_RX</label>
                                    <div className="relative group/sel">
                                        <select 
                                            className="block w-full bg-bg-base border-4 border-border-default py-8 px-12 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-[inset_0_5px_30px_rgba(0,0,0,0.4)] relative z-10"
                                            value={selectedLicenciaId}
                                            onChange={e => setSelectedLicenciaId(e.target.value)}
                                            required
                                        >
                                            <option value="" className="bg-bg-surface text-text-muted opacity-40 italic">[ SELECT_AVAILABLE_STREAM_TX ]</option>
                                            {dispLicencias.map(l => (
                                                <option key={l.id} value={l.id} className="bg-bg-surface">
                                                    {l.software.toUpperCase()} {l.version} // {l.tipoLicencia} // {l.llaveLicencia ? l.llaveLicencia.substring(0,12)+'...' : 'OEM_VOL_ACK'}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-text-muted opacity-20 group-hover/sel:opacity-100 group-hover/sel:text-text-accent transition-all z-0 font-black text-2xl animate-bounceFast italic">
                                             &raquo;
                                        </div>
                                    </div>
                                    {dispLicencias.length === 0 && !assignMutation.isLoading && (
                                        <div className="mt-8 p-6 bg-text-accent/5 border-l-8 border-text-accent animate-pulse shadow-xl">
                                             <p className="text-[11px] text-text-accent font-black uppercase tracking-[0.4em]">! CRITICAL ALERT: NO_AVAILABLE_LICENSES_IN_POOL_TX</p>
                                             <p className="text-[9px] text-text-accent opacity-60 font-black uppercase tracking-widest mt-2 italic">ALLOCATE_NEW_POOL_RESOURCES_BEFORE_SUTURE</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t-8 border-border-default/50">
                                    <button
                                        type="button"
                                        onClick={() => setIsAssignModalOpen(false)}
                                        className="flex-1 px-12 py-6 text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.6em] border-4 border-border-strong hover:border-text-accent transition-all bg-bg-base/60 shadow-2xl active:scale-95 group/disc relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-6">
                                             <span className="opacity-30 group-hover/disc:-translate-x-4 transition-transform">&larr;</span> [ DISCARD_TX_MOD ]
                                        </span>
                                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/disc:opacity-100 transition-opacity"></div>
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={assignMutation.isLoading || !selectedLicenciaId}
                                        className="flex-[2] px-14 py-6 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_20px_80px_rgba(var(--text-primary),0.3)] disabled:opacity-20 uppercase tracking-[0.8em] relative overflow-hidden group/exec active:scale-95"
                                    >
                                        {assignMutation.isLoading ? (
                                            <span className="relative z-10 flex items-center justify-center gap-8 animate-pulse">
                                                 <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                                 RX_INITIAL_SYNC...
                                            </span>
                                        ) : (
                                            <span className="relative z-10 flex items-center justify-center gap-8">
                                                 [ EXECUTE_LINK_TX ]
                                                 <span className="opacity-20 group-hover/exec:translate-x-4 transition-all">&raquo;</span>
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/exec:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>
                            </form>
                            <div className="mt-10 text-center opacity-10 text-[8px] font-black uppercase tracking-[2em] italic">ALLOC_NODE_CONTROLLER_v4.2 // VOL_AF22</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivoLicenciasList;
