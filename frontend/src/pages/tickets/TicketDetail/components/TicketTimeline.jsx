import { 
    ClockIcon, 
    TagIcon, 
    ExclamationCircleIcon, 
    UserPlusIcon, 
    ChatBubbleLeftEllipsisIcon 
} from '@heroicons/react/24/outline';
import { AdjuntoChip } from './AdjuntoChip';

const getTrazaIcon = (tipo) => {
    switch (tipo) {
        case 'CREACION': return <TagIcon className="w-3.5 h-3.5 text-charcoal-400" />;
        case 'CAMBIO_ESTADO': return <ExclamationCircleIcon className="w-3.5 h-3.5 text-amber-500" />;
        case 'ASIGNACION': return <UserPlusIcon className="w-3.5 h-3.5 text-blue-500" />;
        default: return <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 text-primary" />;
    }
};

export const TicketTimeline = ({ ticket, handleDownload, user }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 print-section">
            <h2 className="text-[15px] font-black text-charcoal-900 mb-10 flex items-center gap-3 border-b border-gray-50 pb-5 print-section-title">
                <ClockIcon className="w-6 h-6 text-primary" /> 
                Cronología de Intervenciones
            </h2>

            <div className="relative border-l-2 border-gray-100 ml-6 space-y-10 max-h-[700px] overflow-y-auto no-scrollbar pr-6 pb-6 print:max-h-none print:overflow-visible">
                {ticket.trazas?.length === 0 && (
                    <p className="pl-8 text-[11px] text-charcoal-300 italic font-bold uppercase tracking-widest">Sin registros de auditoría técnicos.</p>
                )}
                {ticket.trazas?.map((traza, i) => (
                    <div key={i} className="relative pl-10 group print-section">
                        {/* Dot Indicator */}
                        <div className="absolute -left-[21px] top-0 bg-white border-2 border-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-sm no-print group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
                            {getTrazaIcon(traza.tipoTraza)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-3">
                            <span className="font-extrabold text-[12px] text-charcoal-800 uppercase tracking-widest">{traza.creadoPor?.nombre?.toLowerCase() || 'sistema automatizado'}</span>
                            <time className="text-[10px] font-bold text-charcoal-400 whitespace-nowrap opacity-60 uppercase tracking-widest">
                                {new Date(traza.creadoEn).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </time>
                        </div>
                        
                        <div className={`text-[13.5px] font-medium text-charcoal-600 leading-relaxed ${traza.tipoTraza === 'COMENTARIO' ? 'bg-gray-50/50 p-5 rounded-2xl border border-gray-100 italic shadow-sm' : ''}`}>
                            {traza.comentario}
                        </div>

                        {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                            <div className="mt-4 flex items-center gap-2.5">
                                <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[9px] font-bold border border-gray-200 line-through uppercase tracking-widest">{traza.estadoAnterior?.toLowerCase()}</span>
                                <span className="text-charcoal-300">→</span>
                                <span className="bg-blue-500/10 text-blue-600 px-4 py-1 rounded-full text-[9px] font-bold border border-blue-500/10 uppercase tracking-widest">{traza.estadoNuevo?.toLowerCase()}</span>
                            </div>
                        )}

                        {/* Adjuntos de la traza */}
                        {traza.adjuntos && traza.adjuntos.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 no-print">
                                {traza.adjuntos.map(doc => (
                                    <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Firma - Solo Impresión */}
            <div className="print-only signature-area mt-16 pt-8 border-t border-dashed border-gray-300 flex justify-between">
                <div className="w-[45%] text-center">
                    <div className="border-t border-charcoal-900 mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Analista Responsable</p>
                    <p className="text-[10px] text-charcoal-400 capitalize">{ticket.asignadoA?.nombre?.toLowerCase() || user?.nombre?.toLowerCase()}</p>
                </div>
                <div className="w-[45%] text-center">
                    <div className="border-t border-charcoal-900 mb-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Recibido a Satisfacción</p>
                    <p className="text-[10px] text-charcoal-400 capitalize">{ticket.funcionario?.nombre?.toLowerCase()}</p>
                </div>
            </div>
        </div>
    );
};
