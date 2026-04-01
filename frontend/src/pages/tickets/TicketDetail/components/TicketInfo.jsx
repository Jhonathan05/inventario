import { CalendarDaysIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { AdjuntoChip } from './AdjuntoChip';

export const TicketInfo = ({ ticket, onDownload }) => {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 print-section">
                <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider print-section-title">Información General</h3>
                <div className="grid">
                    <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Tipo de Caso</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.tipo}</span>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Prioridad</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.prioridad}</span>
                    </div>
                    <div className="no-print-essential">
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Estado actual</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.estado.replace('_', ' ')}</span>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Fecha Creación</span>
                        <div className="flex items-center text-sm text-gray-900 gap-1">
                            <CalendarDaysIcon className="w-4 h-4 text-gray-400 no-print" />
                            {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                    </div>
                </div>
                {ticket.cerradoEn && (
                    <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5 uppercase tracking-tighter">Fecha de Cierre / Resolución</span>
                        <span className="text-sm text-green-700 font-bold">{new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
                    </div>
                )}
                <div className="grid-1-col">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Descripción del Requerimiento / Falla</span>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border leading-relaxed">{ticket.descripcion}</p>
                </div>
            </div>

            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 print-section no-print">
                    <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-1.5 print-section-title">
                        <PaperClipIcon className="w-3.5 h-3.5" /> Evidencias Adjuntas ({ticket.adjuntos.length})
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
