import { ChevronLeftIcon, TicketIcon } from '@heroicons/react/24/outline';

const estadoBadgeColor = {
    CREADO: 'bg-gray-500/10 text-gray-600 border-gray-500/10',
    EN_CURSO: 'bg-blue-500/10 text-blue-600 border-blue-500/10',
    EJECUCION: 'bg-amber-500/10 text-amber-600 border-amber-500/10',
    SIN_RESPUESTA: 'bg-rose-500/10 text-rose-600 border-rose-500/10',
    RESUELTO: 'bg-green-500/10 text-green-600 border-green-500/10',
    COMPLETADO: 'bg-primary/10 text-primary border-primary/10'
};

const prioridadColor = {
    BAJA: 'bg-gray-500/10 text-gray-600 border-transparent',
    MEDIA: 'bg-blue-500/10 text-blue-600 border-transparent',
    ALTA: 'bg-orange-500/10 text-orange-600 border-transparent',
    CRITICA: 'bg-rose-500/10 text-rose-700 border-transparent font-black'
};

export const TicketHeader = ({ ticket, onBack }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="bg-gray-50 p-3 rounded-full border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-charcoal-400 group-hover:text-primary" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-xl font-black text-charcoal-900 tracking-tight flex items-center gap-2">
                                <TicketIcon className="w-6 h-6 text-primary opacity-20" />
                                Bitácora de Caso #{ticket.id}
                            </h1>
                            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                                {ticket.estado?.replace('_', ' ')?.toLowerCase()}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${prioridadColor[ticket.prioridad]}`}>
                                {ticket.prioridad?.toLowerCase()}
                            </span>
                        </div>
                        <p className="text-charcoal-400 text-xs font-medium capitalize truncate max-w-xl">
                            {ticket.titulo?.toLowerCase()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
