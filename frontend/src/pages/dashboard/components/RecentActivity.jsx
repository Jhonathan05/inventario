import { useState } from 'react';

const RecentActivity = ({ activity }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    if (!activity || activity.length === 0) {
        return (
            <div className="bg-bg-surface border-4 border-border-default p-24 text-center font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] animate-fadeIn group">
                <div className="inline-block p-14 bg-bg-base border-4 border-dashed border-border-default/20 opacity-30 group-hover:opacity-100 transition-all duration-1000">
                     <p className="text-[16px] font-black text-text-muted uppercase tracking-[1em] animate-pulse group-hover:text-text-accent transition-colors">! NO_RECENT_ACTIVITY_STREAM_DETECTED</p>
                     <p className="text-[11px] font-black uppercase mt-8 tracking-[1em] italic opacity-40">LOG_BUFFER_EMPTY // EOF_0x00_WAITING_FOR_IO</p>
                </div>
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activity.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activity.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="bg-bg-surface border-4 border-border-default overflow-hidden flex flex-col h-full font-mono shadow-[0_60px_150px_rgba(0,0,0,0.7)] group/feed relative active:scale-[0.99] transition-all duration-700">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-xl font-black uppercase tracking-[2em] pointer-events-none group-hover/feed:opacity-20 transition-all group-hover/feed:translate-x-8 italic">SYS_EVT_STREAM_RX_0xFD</div>
            <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-text-accent/40 via-transparent to-transparent opacity-0 group-hover/feed:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="px-12 py-10 border-b-4 border-border-default bg-bg-elevated flex flex-col sm:flex-row items-center justify-between gap-8 group/head">
                <div className="flex items-center gap-8">
                    <div className="w-5 h-5 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.9)] group-hover/feed:rotate-[225deg] transition-all duration-1000">&beta;</div>
                    <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.8em] flex items-center gap-6">
                        <span className="text-text-accent opacity-20 group-hover/head:opacity-100 transition-opacity">#</span> / SYSTEM_ACTIVITY_FEED_TX
                    </h3>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-[11px] font-black text-text-muted opacity-40 uppercase tracking-[0.6em] italic border-r-4 border-border-default/40 pr-10 group-hover/head:opacity-80 transition-opacity">REALTIME_BUFF_SYNC_OK</div>
                    <div className="bg-bg-base border-4 border-border-default px-8 py-3 text-[13px] font-black text-text-accent tabular-nums shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)] whitespace-nowrap group-hover/head:border-text-accent/30 transition-all">
                        BUFF_LEN: {activity.length.toString().padStart(3, '0')}
                    </div>
                </div>
            </div>

            <ul className="divide-y-4 divide-border-default/10 flex-1 bg-bg-base/30 shadow-[inset_0_20px_80px_rgba(0,0,0,0.3)]">
                {currentItems.map((item, idx) => (
                    <li key={item.id} 
                        className="p-12 hover:bg-bg-elevated/40 transition-all duration-700 group/item border-l-[12px] border-l-transparent hover:border-l-text-accent cursor-default animate-fadeInUp"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex items-start gap-12">
                            <div className={`
                                flex-shrink-0 h-20 w-20 border-4 flex items-center justify-center font-black text-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover/item:scale-110 group-hover/item:-rotate-12 transition-all duration-1000 italic
                                ${item.type === 'MANTENIMIENTO' ? 'border-text-accent text-text-accent bg-text-accent/10 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]' : 'border-border-strong text-text-primary bg-bg-base/80'}
                            `}>
                                {item.type === 'MANTENIMIENTO' ? '&mu;' : '&tau;'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-6">
                                    <h3 className="text-[17px] font-black text-text-primary uppercase tracking-widest truncate group-hover/item:text-text-accent transition-all group-hover/item:tracking-[0.15em] tabular-nums duration-700 italic group-hover/item:not-italic">
                                        {item.description.toUpperCase().replace(/ /g, '_')}
                                    </h3>
                                    <div className="flex items-center gap-8">
                                        <div className="h-0.5 w-24 bg-text-accent/10 hidden xl:block group-hover/item:w-48 transition-all duration-1000 group-hover/item:bg-text-accent/30"></div>
                                        <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.4em] whitespace-nowrap bg-bg-base px-6 py-2.5 border-4 border-border-default/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] opacity-50 group-hover/item:opacity-100 group-hover/item:border-text-accent/40 transition-all tabular-nums italic">
                                            [{new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }).replace(', ', ' @ ').toUpperCase()}]
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-10 mt-8">
                                    <div className="flex items-center gap-8 group/user">
                                        <span className="text-[11px] font-black text-text-muted uppercase tracking-[1em] opacity-20 group-hover/item:opacity-40 transition-opacity italic">PTR_SESSION_UID:</span>
                                        <div className="bg-bg-surface px-6 py-2 border-2 border-border-default/40 italic text-[12px] font-black text-text-primary group-hover/item:text-text-accent group-hover/item:border-text-accent/30 transition-all shadow-xl group-hover/item:not-italic translate-x-0 group-hover/item:translate-x-4 duration-700">
                                            {item.user.toUpperCase().replace(/ /g, '_')}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-10 py-3 text-[11px] font-black uppercase tracking-[0.8em] border-4 transition-all duration-700 shadow-[0_20px_60px_rgba(0,0,0,0.7)] group-hover/item:scale-105
                                        ${item.status === 'FINALIZADO' || item.status === 'DISPONIBLE' ? 'border-border-strong text-text-primary bg-bg-base/50 opacity-40 group-hover/item:opacity-100 italic' :
                                            item.status === 'EN_PROCESO' ? 'border-text-accent text-text-accent bg-text-accent/10 animate-pulse shadow-[0_0_40px_rgba(var(--text-accent),0.3)] not-italic' :
                                                'border-border-default text-text-muted bg-bg-base opacity-20 italic'}
                                    `}>
                                        <div className={`w-3 h-3 mr-6 ${item.status === 'EN_PROCESO' ? 'bg-text-accent animate-ping shadow-[0_0_10px_orange]' : 'bg-current opacity-40'}`}></div>
                                        {item.status.replace(/_/g, '_').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination IO Layer Premium Control RX */}
            {totalPages > 1 && (
                <div className="px-12 py-10 border-t-8 border-border-default bg-bg-base/50 flex flex-col sm:flex-row items-center justify-between gap-12 group/pagination relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-text-accent/20 to-transparent"></div>
                    <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.8em] opacity-40 group-hover/pagination:opacity-100 transition-opacity duration-1000 tabular-nums bg-bg-surface px-10 py-4 border-4 border-border-strong shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] italic group-hover/pagination:not-italic group-hover/pagination:border-text-accent/30 scale-100 group-hover/pagination:scale-105 transition-all">
                        SLICE_ADDR: <span className="text-text-primary px-2 font-black">{(indexOfFirstItem + 1).toString().padStart(2, '0')}</span> &ndash; 
                        <span className="text-text-primary px-2 font-black">
                            {Math.min(indexOfLastItem, activity.length).toString().padStart(2, '0')}
                        </span> 
                        <span className="text-text-accent mx-6 font-normal opacity-40">//</span> 
                        BUF_CAP: <span className="text-text-accent font-black">{activity.length.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex gap-12">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-12 py-6 border-4 text-[13px] font-black transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.8)] uppercase tracking-[0.6em] active:scale-90 group/btn relative overflow-hidden ${currentPage === 1
                                    ? 'border-border-default text-text-muted opacity-5 cursor-not-allowed grayscale'
                                    : 'border-border-strong text-text-primary bg-bg-surface hover:text-text-accent hover:border-text-accent hover:bg-bg-elevated hover:shadow-[0_0_50px_rgba(var(--text-accent),0.2)]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center group-hover/btn:-translate-x-4 transition-transform duration-700 italic">
                                <span className="mr-6 opacity-40 group-hover/btn:opacity-100 transition-opacity">&laquo;&laquo;</span> PREV_BUF
                            </span>
                             <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-12 py-6 border-4 text-[13px] font-black transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.8)] uppercase tracking-[0.6em] active:scale-90 group/btn relative overflow-hidden ${currentPage === totalPages
                                    ? 'border-border-default text-text-muted opacity-5 cursor-not-allowed grayscale'
                                    : 'border-border-strong text-text-primary bg-bg-surface hover:text-text-accent hover:border-text-accent hover:bg-bg-elevated hover:shadow-[0_0_50px_rgba(var(--text-accent),0.2)]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center group-hover/btn:translate-x-4 transition-transform duration-700 italic">
                                NEXT_BUF <span className="ml-6 opacity-40 group-hover/btn:opacity-100 transition-opacity">&raquo;&raquo;</span>
                            </span>
                             <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            )}
            <div className="px-12 py-6 bg-bg-surface border-t-4 border-border-default opacity-20 flex justify-between group-hover/feed:opacity-50 transition-opacity duration-1000 italic">
                <p className="text-[10px] font-black uppercase tracking-[1.5em]">SYSTEM_IO_STREAM_ENCRYPTION_v4.2 // AES_256_ACTIVE</p>
                <p className="text-[10px] font-black uppercase tracking-[1em]">CRC_32_VERIFIED_SYNC_OK</p>
            </div>
        </div>
    );
};

export default RecentActivity;
