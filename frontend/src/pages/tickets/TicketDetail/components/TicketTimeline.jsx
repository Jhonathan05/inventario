import { 
    ClockIcon, 
    TagIcon, 
    ExclamationCircleIcon, 
    UserPlusIcon, 
    ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';
import { AdjuntoChip } from './AdjuntoChip';

const getTrazaIcon = (tipo) => {
    switch (tipo) {
        case 'CREACION': return <TagIcon className="w-3.5 h-3.5 text-gray-500" />;
        case 'CAMBIO_ESTADO': return <ExclamationCircleIcon className="w-3.5 h-3.5 text-orange-500" />;
        case 'ASIGNACION': return <UserPlusIcon className="w-3.5 h-3.5 text-blue-500" />;
        default: return <ChatBubbleLeftIcon className="w-3.5 h-3.5 text-emerald-500" />;
    }
};

export const TicketTimeline = ({ ticket, handleDownload, user }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 print-section">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 print-section-title">
                <ClockIcon className="w-5 h-5 text-gray-400 no-print" /> Historia Detallada de Eventos (Trazabilidad)
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 max-h-[500px] overflow-y-auto pr-2 pb-2 print:max-h-none print:overflow-visible">
                {ticket.trazas?.length === 0 && (
                    <p className="pl-6 text-sm text-gray-400 italic">Sin historial de eventos.</p>
                )}
                {ticket.trazas?.map((traza, i) => (
                    <div key={i} className="relative pl-6 print-section">
                        <div className="absolute -left-2.5 top-0.5 bg-white border-2 border-gray-200 rounded-full w-5 h-5 flex items-center justify-center no-print">
                            {getTrazaIcon(traza.tipoTraza)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <span className="font-semibold text-sm text-gray-900 uppercase text-[10px] tracking-wider">{traza.creadoPor?.nombre || 'SISTEMA'}</span>
                            <time className="text-[10px] text-gray-400 whitespace-nowrap">
                                {new Date(traza.creadoEn).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </time>
                        </div>
                        <div className={`mt-1 text-sm text-gray-700 ${traza.tipoTraza === 'COMENTARIO' ? 'bg-gray-50 p-2 rounded border border-gray-100' : ''}`}>
                            {traza.comentario}
                        </div>
                        {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold">
                                <span className="text-gray-400 line-through">{traza.estadoAnterior}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-blue-600 uppercase italic">{traza.estadoNuevo}</span>
                            </div>
                        )}
                        {/* Adjuntos de la traza */}
                        {traza.adjuntos && traza.adjuntos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5 no-print">
                                {traza.adjuntos.map(doc => (
                                    <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Firma - Solo Impresión */}
            <div className="print-only signature-area mt-12 pt-6 border-t border-dashed border-gray-300 flex justify-between">
                <div className="w-[45%] text-center">
                    <div className="border-t border-black mb-1"></div>
                    <p className="text-[10px] font-bold uppercase">Firma del Analista Responsable</p>
                    <p className="text-[10px] text-gray-500">{ticket.asignadoA?.nombre || user?.nombre}</p>
                </div>
                <div className="w-[45%] text-center">
                    <div className="border-t border-black mb-1"></div>
                    <p className="text-[10px] font-bold uppercase">Recibido a Satisfacción (Funcionario)</p>
                    <p className="text-[10px] text-gray-500">{ticket.funcionario?.nombre}</p>
                </div>
            </div>
        </div>
    );
};
