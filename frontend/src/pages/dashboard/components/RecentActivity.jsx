import { useState } from 'react';
import { formatDate } from '../../../lib/utils';

const RecentActivity = ({ activity }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    if (!activity || activity.length === 0) {
        return (
            <div className="bg-bg-surface border-4 border-border-default p-24 text-center font-mono shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-fadeIn group">
                <div className="inline-block p-14 bg-bg-base border-4 border-dashed border-border-default/20 opacity-30 group-hover:opacity-100 transition-all duration-700">
                     <p className="text-[14px] font-black text-text-muted uppercase tracking-[0.8em] animate-pulse">! NO_RECENT_ACTIVITY_DETECTED</p>
                     <p className="text-[10px] font-black uppercase mt-6 tracking-[0.5em] italic">LOG_BUFFER_EMPTY // EOF_0x00</p>
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
        <div className="bg-bg-surface border-4 border-border-default overflow-hidden flex flex-col h-full font-mono shadow-3xl group/feed relative active:scale-[0.99] transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-sm font-black uppercase tracking-[2em] pointer-events-none group-hover/feed:opacity-20 transition-all group-hover/feed:translate-x-4">SYS_EVT_STREAM_RX</div>
            <div className="absolute top-0 left-0 w-2 h-full bg-text-accent opacity-0 group-hover/feed:opacity-20 transition-opacity"></div>
            
            <div className="px-10 py-8 border-b-4 border-border-default bg-bg-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)] group-hover/feed:rotate-45 transition-transform"></div>
                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.6em] flex items-center gap-4">
                        # <span className="text-text-accent opacity-40">/</span> SYSTEM_ACTIVITY_FEED
                    </h3>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-[10px] font-black text-text-muted opacity-40 uppercase tracking-[0.4em] italic border-r-2 border-border-default pr-6">REALTIME_BUFF_SYNC_OK</div>
                    <div className="bg-bg-base border border-border-default px-4 py-1 text-[11px] font-black text-text-accent tabular-nums shadow-inner whitespace-nowrap">
                        BUFF_LEN: {activity.length.toString().padStart(3, '0')}
                    </div>
                </div>
            </div>

            <ul className="divide-y divide-border-default/20 flex-1 bg-bg-base/20 shadow-inner">
                {currentItems.map((item) => (
                    <li key={item.id} className="p-10 hover:bg-bg-elevated/50 transition-all group/item border-l-8 border-l-transparent hover:border-l-text-accent cursor-default">
                        <div className="flex items-start gap-10">
                            <div className={`
                                flex-shrink-0 h-16 w-16 border-4 flex items-center justify-center font-black text-[18px] shadow-2xl group-hover/item:scale-110 group-hover/item:-rotate-12 transition-all duration-500
                                ${item.type === 'MANTENIMIENTO' ? 'border-text-accent text-text-accent bg-text-accent/5' : 'border-border-default text-text-secondary bg-bg-base'}
                            `}>
                                {item.type === 'MANTENIMIENTO' ? 'MT' : 'TX'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-4">
                                    <h3 className="text-[15px] font-black text-text-primary uppercase tracking-tight truncate group-hover/item:text-text-accent transition-all group-hover/item:tracking-[0.05em] tabular-nums">
                                        {item.description.toUpperCase().replace(/ /g, '_')}
                                    </h3>
                                    <div className="flex items-center gap-6">
                                        <div className="h-px w-20 bg-border-default/20 hidden xl:block"></div>
                                        <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] whitespace-nowrap bg-bg-base px-5 py-2 border-2 border-border-default/50 shadow-inner opacity-70 group-hover/item:opacity-100 group-hover/item:border-text-accent/30 transition-all tabular-nums">
                                            [{new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }).replace(', ', ' @ ').toUpperCase()}]
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-8 mt-6">
                                    <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] font-black flex items-center gap-4">
                                        <span className="opacity-20">UID_SESSION:</span>
                                        <span className="text-text-primary opacity-80 group-hover/item:opacity-100 group-hover/item:translate-x-2 transition-all bg-bg-base px-4 py-1 border border-border-default/40 italic">{item.user.toUpperCase().replace(/ /g, '_')}</span>
                                    </p>
                                    <span className={`inline-flex items-center px-6 py-2 text-[10px] font-black uppercase tracking-[0.5em] border-2 transition-all shadow-xl active:scale-90
                                        ${item.status === 'FINALIZADO' || item.status === 'DISPONIBLE' ? 'border-text-primary text-text-primary bg-bg-base opacity-40 group-hover/item:opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.05)]' :
                                            item.status === 'EN_PROCESO' ? 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.2)]' :
                                                'border-border-default text-text-muted bg-bg-base opacity-20'}
                                    `}>
                                        <div className={`w-2 h-2 mr-4 ${item.status === 'EN_PROCESO' ? 'bg-text-accent animate-ping' : 'bg-current opacity-40'}`}></div>
                                        [{item.status.replace(/_/g, '_').toUpperCase()}]
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination IO Layer */}
            {totalPages > 1 && (
                <div className="px-10 py-8 border-t-4 border-border-default bg-bg-base flex flex-col sm:flex-row items-center justify-between gap-10">
                    <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40 group-hover/feed:opacity-80 transition-opacity tabular-nums bg-bg-surface px-6 py-2 border-2 border-border-default shadow-inner">
                        SLICE_ADDR: <span className="text-text-primary">{(indexOfFirstItem + 1).toString().padStart(2, '0')}</span> – 
                        <span className="text-text-primary">
                            {Math.min(indexOfLastItem, activity.length).toString().padStart(2, '0')}
                        </span> <span className="text-text-accent mx-2">//</span> BUF_CAP: {activity.length}
                    </div>
                    <div className="flex gap-10">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`px-10 py-5 border-2 text-[12px] font-black transition-all shadow-2xl uppercase tracking-[0.4em] active:scale-90 group/btn relative overflow-hidden ${currentPage === 1
                                    ? 'border-border-default text-text-muted opacity-5 cursor-not-allowed'
                                    : 'border-border-default text-text-primary bg-bg-surface hover:text-text-accent hover:border-text-accent hover:bg-bg-elevated'
                                }`}
                        >
                            <span className="relative z-10 flex items-center group-hover/btn:-translate-x-2 transition-transform">
                                <span className="mr-4">&lsaquo;&lsaquo;</span> PREV_BUF
                            </span>
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`px-10 py-5 border-2 text-[12px] font-black transition-all shadow-2xl uppercase tracking-[0.4em] active:scale-90 group/btn relative overflow-hidden ${currentPage === totalPages
                                    ? 'border-border-default text-text-muted opacity-5 cursor-not-allowed'
                                    : 'border-border-default text-text-primary bg-bg-surface hover:text-text-accent hover:border-text-accent hover:bg-bg-elevated'
                                }`}
                        >
                            <span className="relative z-10 flex items-center group-hover/btn:translate-x-2 transition-transform">
                                NEXT_BUF <span className="ml-4">&rsaquo;&rsaquo;</span>
                            </span>
                        </button>
                    </div>
                </div>
            )}
            <div className="px-10 py-4 bg-bg-surface border-t border-border-default opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[1em]">IO_STREAM_ENCRYPTION_AES256_ACTIVE // CRC_32_VERIFIED</p>
            </div>
        </div>
    );
};

export default RecentActivity;
