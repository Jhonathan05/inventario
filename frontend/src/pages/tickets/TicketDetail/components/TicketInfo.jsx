import { CalendarDaysIcon, PaperClipIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { AdjuntoChip } from './AdjuntoChip';

export const TicketInfo = ({ ticket, onDownload }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 print-section">
                <h3 className="text-[11px] font-bold uppercase text-charcoal-400 tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4 print-section-title">
                    <InformationCircleIcon className="w-4 h-4 text-primary" />
                    Información Estructural del Caso
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                        <span className="text-[10px] font-bold text-charcoal-400 block mb-1.5 uppercase tracking-widest opacity-70">Categoría de Servicio</span>
                        <span className="text-[13px] font-bold text-charcoal-800 capitalize tracking-tight">{ticket.tipo?.toLowerCase()}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-charcoal-400 block mb-1.5 uppercase tracking-widest opacity-70">Nivel de Prioridad</span>
                        <span className="text-[13px] font-bold text-charcoal-800 capitalize tracking-tight">{ticket.prioridad?.toLowerCase()}</span>
                    </div>
                    <div className="no-print-essential">
                        <span className="text-[10px] font-bold text-charcoal-400 block mb-1.5 uppercase tracking-widest opacity-70">Estado Operativo</span>
                        <span className="text-[13px] font-bold text-charcoal-800 capitalize tracking-tight">{ticket.estado?.replace(/_/g, ' ')?.toLowerCase()}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-charcoal-400 block mb-1.5 uppercase tracking-widest opacity-70">Registro Inicial</span>
                        <div className="flex items-center text-[13px] font-bold text-charcoal-800 gap-2 tracking-tight">
                            <CalendarDaysIcon className="w-4 h-4 text-charcoal-300 no-print" />
                            {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                    </div>
                </div>
                {ticket.cerradoEn && (
                    <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
                        <span className="text-[10px] font-bold text-green-700 block mb-1 uppercase tracking-widest">Resolución Finalizada</span>
                        <span className="text-[14px] text-green-800 font-black">{new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
                    </div>
                )}
                <div className="grid-1-col space-y-3">
                    <span className="text-[10px] font-bold text-charcoal-400 block uppercase tracking-widest opacity-70">Motivo del requerimiento</span>
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 leading-relaxed">
                        <p className="text-[13px] text-charcoal-700 whitespace-pre-wrap font-medium italic">"{ticket.descripcion}"</p>
                    </div>
                </div>
            </div>

            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 print-section no-print">
                    <h3 className="text-[11px] font-bold uppercase text-charcoal-400 tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-3 print-section-title">
                        <PaperClipIcon className="w-4 h-4 text-primary" /> 
                        Evidencias Documentales ({ticket.adjuntos.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {ticket.adjuntos.map(doc => (
                            <AdjuntoChip key={doc.id} doc={doc} onDownload={onDownload} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
