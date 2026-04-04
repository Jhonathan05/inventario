import { generateTicketReport } from '../../reports/TicketReport';

export const TicketManagement = ({ 
    ticket, 
    user, 
    tecnicoAsignado, 
    setTecnicoAsignado, 
    tecnicos, 
    handleAsignarTecnico, 
    nuevoEstado, 
    setNuevoEstado, 
    handleCambiarEstado 
}) => {
    const selectCls = "flex-1 bg-bg-base border-4 border-border-default px-6 py-4 text-[13px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)]";
    const btnCls = "px-10 py-4 bg-bg-elevated border-4 border-border-strong text-[11px] font-black text-text-muted hover:text-text-primary hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.4em] transition-all disabled:opacity-20 active:scale-95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group/exec relative overflow-hidden";
    const labelCls = "text-[12px] font-black text-text-muted uppercase tracking-[0.5em] block mb-4 opacity-60 group-hover/field:text-text-accent transition-colors italic border-l-4 border-border-default pl-6 group-hover/field:border-text-accent";

    return (
        <div className="bg-bg-surface border-2 sm:border-4 border-border-default p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12 font-mono no-print shadow-xl relative overflow-hidden group/main hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[1.5em] group-hover/main:opacity-20 transition-all italic hidden sm:block">CTRL_PANEL_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent/60 via-transparent to-transparent opacity-20"></div>
            
            <div className="flex items-center gap-4 sm:gap-6 border-b-2 sm:border-b-4 border-border-default pb-4 sm:pb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 sm:border-4 border-text-accent text-text-accent font-black text-base sm:text-xl bg-bg-base shadow-xl italic flex-shrink-0">&sigma;</div>
                <h3 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                     OPERATIONAL_FLOW_CONTROL_HUB
                </h3>
            </div>
            
            <div className="space-y-8 sm:space-y-12 relative z-10">
                {/* Analyst Assignment Stream */}
                <div className="group/field">
                    <label className={labelCls}>:: ASSIGN_TECHNICAL_RESOURCE_ALLOC</label>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative flex-1 group/sel">
                            <select 
                                value={tecnicoAsignado} 
                                onChange={e => setTecnicoAsignado(e.target.value)}
                                className={selectCls}
                            >
                                <option value="" className="italic">[ -- UNASSIGNED_CORE_RESOURCE -- ]</option>
                                {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre.toUpperCase().replace(/ /g, '_')}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none opacity-40 text-text-accent font-black group-hover/sel:scale-150 transition-transform">
                                &raquo;
                            </div>
                        </div>
                        <button 
                            onClick={handleAsignarTecnico}
                            disabled={String(tecnicoAsignado) === String(ticket.asignadoAId || '')}
                            className={btnCls}
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                <span className="opacity-40 font-normal">#</span> EXEC_ALLOC
                            </span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/exec:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>

                {/* Status Protocol Control */}
                <div className="group/field">
                    <label className={labelCls}>:: STATE_MACHINE_PROTOCOL_UPDATE</label>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative flex-1 group/sel">
                            <select 
                                value={nuevoEstado} 
                                onChange={e => setNuevoEstado(e.target.value)}
                                className={selectCls}
                            >
                                <option value="CREADO">INITIALIZED_RX</option>
                                <option value="EN_CURSO">PROCESSING_BUF</option>
                                <option value="EJECUCION">EXECUTING_TX</option>
                                <option value="SIN_RESPUESTA">NO_IO_RESPONSE_ALRT</option>
                                <option value="RESUELTO">RESOLVED_TX_COMPLETE</option>
                                <option value="COMPLETADO">CLOSED_NODE_SYNC</option>
                            </select>
                            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none opacity-40 text-text-accent font-black group-hover/sel:scale-150 transition-transform">
                                &raquo;
                            </div>
                        </div>
                        <button 
                            onClick={handleCambiarEstado} 
                            disabled={nuevoEstado === ticket.estado}
                            className={btnCls}
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                <span className="opacity-40 font-normal">#</span> PUSH_STATE
                            </span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/exec:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t-4 border-border-default/30 space-y-6">
                <button
                    onClick={() => generateTicketReport(ticket, user)}
                    className="w-full py-4 sm:py-6 bg-text-primary border-2 sm:border-4 border-text-primary text-bg-base font-black text-[12px] sm:text-[13px] hover:bg-text-accent hover:border-text-accent transition-all duration-700 flex items-center justify-center gap-6 sm:gap-8 shadow-xl group/print active:scale-95 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] animate-shine"></div>
                    <span className="relative z-10 flex items-center gap-6 group-hover/print:tracking-[0.8em] transition-all duration-1000">
                        <span className="opacity-40 group-hover/print:rotate-180 transition-transform duration-1000">[REPORT_PDF]</span>
                        <span>EXEC_GENERATE_LIFECYCLE_MANIFEST</span>
                        <span className="opacity-40 group-hover/print:translate-y-2 transition-transform">&darr;</span>
                    </span>
                </button>
                <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic text-center animate-pulse">
                     _REPORTS_ENGINE_v4.2_STANDBY_
                </div>
            </div>
            
            <div className="pt-6 flex justify-between items-center opacity-10 font-black text-[9px] uppercase tracking-[1em] italic group-hover/main:opacity-40 transition-opacity pointer-events-none">
                 <span>HD_CORE_CTRL_PANEL</span>
                 <span>_0xFD42_SYNCED</span>
            </div>
        </div>
    );
};
