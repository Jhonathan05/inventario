import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const estadoBadgeColor = {
    CREADO: 'bg-gray-100 text-gray-700 border-gray-200',
    EN_CURSO: 'bg-blue-100 text-blue-700 border-blue-200',
    EJECUCION: 'bg-amber-100 text-amber-700 border-amber-200',
    SIN_RESPUESTA: 'bg-red-100 text-red-700 border-red-200',
    RESUELTO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETADO: 'bg-indigo-100 text-indigo-700 border-indigo-200'
};

const prioridadColor = {
    BAJA: 'bg-gray-100 text-gray-700',
    MEDIA: 'bg-blue-100 text-blue-700',
    ALTA: 'bg-orange-100 text-orange-700',
    CRITICA: 'bg-red-100 text-red-800 font-bold'
};

export const TicketHeader = ({ ticket, onBack }) => {
    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900">Caso #{ticket.id}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                        {ticket.estado.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${prioridadColor[ticket.prioridad]}`}>
                        {ticket.prioridad}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{ticket.titulo}</p>
            </div>
        </div>
    );
};
