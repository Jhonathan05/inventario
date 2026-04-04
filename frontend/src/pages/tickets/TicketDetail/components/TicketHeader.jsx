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
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 bg-bg-surface border-8 border-border-default p-12 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[2em] group-hover:opacity-20 transition-all italic italic">ITSM_HEADER_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <button 
                onClick={onBack} 
                className="px-8 py-5 text-[12px] font-black text-text-muted hover:text-text-primary hover:border-text-accent uppercase tracking-[0.6em] border-4 border-border-strong bg-bg-base/50 transition-all flex items-center gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] active:scale-90 group/back relative overflow-hidden shrink-0"
            >
                <span className="relative z-10 flex items-center gap-6">
                    <span className="opacity-30 group-hover/back:-translate-x-3 transition-transform italic">&larr;</span> 
                    [ ABORT_VIEW_TX ]
                </span>
                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/back:opacity-100 transition-opacity"></div>
            </button>

            <div className="flex-1 min-w-0 relative z-10 w-full lg:w-auto">
                <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-6 bg-bg-base/80 px-6 py-2 border-4 border-border-default shadow-inner">
                         <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.6)]"></div>
                         <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary tabular-nums">ID: 0x{ticket.id.toString(16).toUpperCase().padStart(4, '0')}</h1>
                    </div>
                    
                    <span className={`px-6 py-2 border-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all italic shadow-2xl ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                        ::{ticket.estado.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center gap-6 border-l-4 border-border-default/30 pl-8">
                         {getPrioridadBadgeComponent(ticket.prioridad)}
                    </div>
                </div>
                
                <div className="mt-8 group/title">
                     <p className="text-[16px] text-text-primary uppercase tracking-[0.2em] font-black group-hover/title:text-text-accent transition-all group-hover/title:tracking-[0.3em] truncate bg-bg-base/20 px-6 py-3 border-l-8 border-text-accent/30 shadow-inner italic italic duration-700">
                        {ticket.titulo.replace(/ /g, '_')}
                    </p>
                    <div className="flex items-center gap-4 mt-4 opacity-20 font-black text-[9px] uppercase tracking-[1em] pl-6 pointer-events-none group-hover/title:opacity-40 transition-opacity">
                         TX_TITLE_UID_DESCRIPTOR_MAPPED_OK
                    </div>
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
