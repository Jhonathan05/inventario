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
    const selectCls = "flex-1 bg-bg-base border border-border-default px-5 py-3 text-[11px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-border-strong transition-all appearance-none cursor-pointer shadow-inner";
    const btnCls = "px-6 py-3 bg-bg-elevated border border-border-default text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent uppercase tracking-[0.3em] transition-all disabled:opacity-30 active:scale-95 shadow-xl";
    const labelCls = "text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-3 opacity-60 group-hover/field:text-text-accent transition-colors";

    return (
        <div className="bg-bg-surface border border-border-default p-10 space-y-10 font-mono no-print shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">CTRL_PANEL_RX</div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-8 border-b border-border-default pb-4">/ FLOW_CONTROL_SYSTEM</h3>
            
            <div className="space-y-10">
                <div className="group/field">
                    <label className={labelCls}>:: ASSIGNED_ANALYST_NODE</label>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <select 
                                value={tecnicoAsignado} 
                                onChange={e => setTecnicoAsignado(e.target.value)}
                                className={selectCls}
                            >
                                <option value="">[ -- UNASSIGNED_CORE -- ]</option>
                                {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre.toUpperCase().replace(/ /g, '_')}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40 text-[8px]">
                                [ &darr; ]
                            </div>
                        </div>
                        <button 
                            onClick={handleAsignarTecnico}
                            disabled={String(tecnicoAsignado) === String(ticket.asignadoAId || '')}
                            className={btnCls}
                        >
                            EXEC_ASSIGN
                        </button>
                    </div>
                </div>

                <div className="group/field">
                    <label className={labelCls}>:: CASE_STATUS_PROTOCOL</label>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <select 
                                value={nuevoEstado} 
                                onChange={e => setNuevoEstado(e.target.value)}
                                className={selectCls}
                            >
                                <option value="CREADO">INITIALIZED</option>
                                <option value="EN_CURSO">PROCESSING_BUF</option>
                                <option value="EJECUCION">EXECUTING_RX</option>
                                <option value="SIN_RESPUESTA">NO_IO_RESPONSE</option>
                                <option value="RESUELTO">RESOLVED_TX</option>
                                <option value="COMPLETADO">CLOSED_SUCCESS</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40 text-[8px]">
                                [ &darr; ]
                            </div>
                        </div>
                        <button 
                            onClick={handleCambiarEstado} 
                            disabled={nuevoEstado === ticket.estado}
                            className={btnCls}
                        >
                            PUSH_UPDATE
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-border-default/30">
                <button
                    onClick={() => generateTicketReport(ticket, user)}
                    className="w-full py-5 bg-bg-elevated border border-border-strong text-text-accent font-black text-[12px] hover:text-text-primary uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-5 shadow-3xl group/print active:scale-95"
                >
                    <span className="opacity-40 group-hover/print:scale-125 transition-transform">#</span>
                    <span>[ GENERATE_LIFE_CYCLE_REPORT_PDF ]</span>
                    <span className="opacity-40 group-hover/print:translate-y-1 transition-transform">v</span>
                </button>
            </div>
            
            <div className="text-[8px] font-black text-text-muted uppercase tracking-[0.4em] opacity-10">
                 SYSTEM_FLOW_REPORTS_ENABLED: V.4.0
            </div>
        </div>
    );
};
