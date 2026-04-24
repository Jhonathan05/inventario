import { ArrowDownTrayIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
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
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 no-print">
            <h3 className="text-[11px] font-bold uppercase text-charcoal-400 tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-primary" />
                Control de Gestión TI
            </h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-charcoal-400 block mb-2 uppercase tracking-widest opacity-70">Ingeniero Responsable</label>
                    <div className="flex gap-2">
                        <select 
                            value={tecnicoAsignado} 
                            onChange={e => setTecnicoAsignado(e.target.value)}
                            className="flex-1 text-[13px] font-bold border border-gray-100 rounded-full bg-gray-50/50 focus:ring-primary focus:border-primary px-5 py-3 transition-all outline-none"
                        >
                            <option value="">-- Sin Asignar --</option>
                            {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                        </select>
                        <button 
                            onClick={handleAsignarTecnico}
                            disabled={String(tecnicoAsignado) === String(ticket.asignadoAId || '')}
                            className="px-6 py-2 bg-charcoal-900 border border-charcoal-900 rounded-full text-[10px] font-bold text-white hover:bg-black disabled:opacity-50 disabled:grayscale transition-all uppercase tracking-widest"
                        >
                            Fijar
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-charcoal-400 block mb-2 uppercase tracking-widest opacity-70">Estado Operativo</label>
                    <div className="flex gap-2">
                        <select 
                            value={nuevoEstado} 
                            onChange={e => setNuevoEstado(e.target.value)}
                            className="flex-1 text-[13px] font-bold border border-gray-100 rounded-full bg-gray-50/50 focus:ring-primary focus:border-primary px-5 py-3 transition-all outline-none"
                        >
                            <option value="CREADO">Creado</option>
                            <option value="EN_CURSO">En Curso</option>
                            <option value="EJECUCION">En Ejecución</option>
                            <option value="SIN_RESPUESTA">Sin Respuesta</option>
                            <option value="RESUELTO">Resuelto</option>
                            <option value="COMPLETADO">Completado</option>
                        </select>
                        <button 
                            onClick={handleCambiarEstado} 
                            disabled={nuevoEstado === ticket.estado}
                            className="px-6 py-2 bg-charcoal-900 border border-charcoal-900 rounded-full text-[10px] font-bold text-white hover:bg-black disabled:opacity-50 disabled:grayscale transition-all uppercase tracking-widest"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-gray-50">
                <button
                    onClick={() => generateTicketReport(ticket, user)}
                    className="w-full py-4 bg-primary text-white rounded-full text-[11px] font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 border border-primary uppercase tracking-widest"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Expedir Reporte Técnico (PDF)
                </button>
            </div>
        </div>
    );
};
