// SITE TOKENS FOR TICKET STATUS & PRIORITY
const estadoBadgeColor = {
    CREADO: 'border-border-default text-text-muted',
    EN_CURSO: 'border-text-accent text-text-accent',
    EJECUCION: 'border-text-accent text-text-accent animate-pulse',
    SIN_RESPUESTA: 'border-text-accent text-text-accent bg-text-accent/5',
    RESUELTO: 'border-text-primary text-text-primary bg-text-accent/5',
    COMPLETADO: 'border-text-primary text-text-primary bg-text-accent/10 shadow-lg'
};

const prioridadColor = {
    BAJA: 'text-text-muted opacity-40',
    MEDIA: 'text-text-primary opacity-70',
    ALTA: 'text-text-primary font-black underline decoration-text-accent/30 decoration-2 underline-offset-4',
    CRITICA: 'text-text-accent font-black animate-pulse'
};

export const TicketHeader = ({ ticket, onBack }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 bg-bg-surface border border-border-default p-10 font-mono shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">HEADER_RX</div>
            <button 
                onClick={onBack} 
                className="px-6 py-3 text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent uppercase tracking-[0.4em] border border-border-default bg-bg-base transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
                [ &larr; BACK ]
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-6">
                    <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-text-primary tabular-nums">CASE_ID: #{ticket.id.toString().padStart(4, '0')}</h1>
                    <span className={`px-4 py-1.5 border text-[9px] font-black uppercase tracking-widest transition-all ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                        [{ticket.estado.replace('_', ' ')}]
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${prioridadColor[ticket.prioridad]}`}>
                        ::{ticket.prioridad}_PRIORITY
                    </span>
                </div>
                <p className="text-[12px] text-text-muted mt-4 uppercase tracking-tighter sm:tracking-tight font-black opacity-80 truncate bg-bg-base/30 px-3 py-1 border-l-2 border-border-default">
                    {ticket.titulo.replace(/ /g, '_')}
                </p>
            </div>
        </div>
    );
};
