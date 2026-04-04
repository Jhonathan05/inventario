// SITE TOKENS FOR TICKET STATUS & PRIORITY RX
const estadoBadgeColor = {
    CREADO: 'border-border-default text-text-muted opacity-40',
    EN_CURSO: 'border-text-accent text-text-accent bg-text-accent/5 shadow-[0_0_20px_rgba(var(--text-accent),0.1)]',
    EJECUCION: 'border-text-accent text-text-accent animate-pulse bg-text-accent/10 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]',
    SIN_RESPUESTA: 'border-text-accent text-text-accent animate-pulse bg-text-accent/10 shadow-[0_0_40px_rgba(var(--text-accent),0.3)]',
    RESUELTO: 'border-text-primary text-text-primary bg-text-primary/5 opacity-60',
    COMPLETADO: 'border-text-primary text-text-primary bg-text-primary/10 shadow-2xl opacity-60'
};

const prioridadColor = {
    BAJA: 'text-text-muted opacity-30',
    MEDIA: 'text-text-primary opacity-60',
    ALTA: 'text-text-primary font-black underline decoration-text-accent/60 decoration-8 underline-offset-[12px] group-hover:text-text-accent transition-all',
    CRITICA: 'text-text-accent font-black animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.3)] bg-text-accent/5 px-4 py-1 border-2 border-text-accent/20'
};

export const TicketHeader = ({ ticket, onBack }) => {
    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6 lg:gap-8 bg-bg-surface border-border-default border-2 p-4 sm:p-6 font-mono shadow-lg relative overflow-hidden group hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-20 transition-all italic hidden sm:block">ITSM_HEADER</div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <button 
                onClick={onBack} 
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black text-text-muted hover:text-text-primary hover:border-text-accent uppercase tracking-[0.2em] sm:tracking-[0.4em] border-2 border-border-strong bg-bg-base/50 transition-all flex items-center gap-2 sm:gap-4 shadow-lg active:scale-90 group/back relative overflow-hidden shrink-0"
            >
                <span className="relative z-10 flex items-center gap-2 sm:gap-4">
                    <span className="opacity-30 group-hover/back:-translate-x-1.5 transition-transform italic">&larr;</span> 
                    <span className="hidden xs:inline">[ RETURN ]</span>
                    <span className="xs:hidden">&larr;</span>
                </span>
                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/back:opacity-100 transition-opacity"></div>
            </button>

            <div className="flex-1 min-w-0 relative z-10 w-full lg:w-auto">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
                    <div className="flex items-center gap-2 sm:gap-3 bg-bg-base/80 px-2 sm:px-4 py-1 sm:py-1.5 border-2 border-border-default shadow-inner">
                         <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-text-accent animate-pulse"></div>
                         <h1 className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-text-primary tabular-nums">ID: 0x{ticket.id.toString(16).toUpperCase().padStart(4, '0')}</h1>
                    </div>
                    
                    <span className={`px-2 sm:px-4 py-1 sm:py-1.5 border-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all italic shadow-md ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                        ::{ticket.estado.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center gap-2 sm:gap-3 border-l-2 border-border-default/30 pl-3 sm:pl-4">
                         {getPrioridadBadgeComponent(ticket.prioridad)}
                    </div>
                </div>
                
                <div className="mt-3 sm:mt-4 group/title text-left">
                     <p className="text-[11px] sm:text-[13px] text-text-primary uppercase tracking-[0.1em] font-black group-hover/title:text-text-accent transition-all truncate bg-bg-base/20 px-3 sm:px-4 py-1.5 sm:py-2 border-l-4 border-text-accent/30 shadow-inner italic duration-700">
                        {ticket.titulo.replace(/ /g, '_')}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Helper for consistency
const getPrioridadBadgeComponent = (prioridad) => {
    const config = {
        'BAJA': 'text-text-muted opacity-30',
        'MEDIA': 'text-text-primary opacity-60',
        'ALTA': 'text-text-primary font-black underline decoration-text-accent/60 decoration-8 underline-offset-[12px] group-hover:text-text-accent transition-all',
        'CRITICA': 'text-text-accent font-black animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.3)] bg-text-accent/5 px-4 py-1 border-2 border-text-accent/20'
    };
    return (
        <span className={`inline-flex text-[11px] uppercase tracking-[0.5em] font-black ${config[prioridad] || config['MEDIA']}`}>
            ::{prioridad}_PRIORITY
        </span>
    );
};
