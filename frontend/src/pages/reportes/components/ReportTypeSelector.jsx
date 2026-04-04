import { REPORT_TYPES } from '../reportConfigs';

export const ReportTypeSelector = ({ onSelect }) => {
    return (
        <div className="font-mono animate-fadeIn px-4 sm:px-6 lg:px-12 mb-40 max-w-[1800px] mx-auto border-l-8 border-l-border-default/10">
            {/* Main Header / Analytics Hub Commander RX Premium */}
            <div className="mb-20 bg-bg-surface border-8 border-border-default p-16 shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-text-accent transition-all duration-1000">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[3em] group-hover:opacity-20 group-hover:translate-x-8 transition-all duration-1000 italic">ANALYTIC_CORE_IO_v4.2_AF22</div>
                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-40 animate-pulse"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-10 mb-8 group/title">
                         <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl rotate-45 group-hover:rotate-[225deg] transition-all duration-1000 shadow-[0_0_40px_rgba(var(--text-accent),0.4)] bg-bg-base">&alpha;</div>
                         <h1 className="text-6xl font-black uppercase tracking-[0.5em] text-text-primary leading-none flex items-center gap-10">
                            <span className="text-text-accent opacity-20 text-7xl font-normal">/</span> report_hub
                         </h1>
                    </div>
                    <div className="mt-10 flex flex-wrap items-center gap-16 border-l-8 border-text-accent/20 pl-16 italic">
                        <div className="space-y-4">
                             <p className="text-[14px] text-text-muted font-black uppercase tracking-[0.6em] bg-bg-base px-10 py-3 border-4 border-border-default shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)] group-hover:text-text-accent transition-colors duration-700">STATUS: READY_FOR_TX_STREAM</p>
                        </div>
                        <span className="text-border-default h-10 w-[3px] opacity-10"></span>
                        <p className="text-[13px] text-text-muted font-black uppercase tracking-[0.5em] opacity-40 flex items-center gap-6 group-hover:opacity-100 transition-opacity">
                            <span className="text-text-accent animate-pulse">&bull;</span> ESTABLISHING_NODE_TRACEABILITY_GATEWAY // 0xAF92_SECURE
                        </p>
                    </div>
                </div>
            </div>

            {/* Selection Grid / Payload Hook Selection RX */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {REPORT_TYPES.map((report) => (
                    <button 
                        key={report.id} 
                        onClick={() => onSelect(report)}
                        className="text-left bg-bg-surface border-4 border-border-default p-16 hover:border-text-accent group transition-all duration-1000 font-mono relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] hover:shadow-[0_60px_180px_rgba(251,97,7,0.3)] active:scale-95 group/card"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-[14px] font-black uppercase tracking-[1.5em] group-hover:opacity-40 group-hover:text-text-accent transition-all duration-1000 italic">
                            {report.id.toUpperCase()}_HOOK_RX_0xFD
                        </div>
                        
                        <div className="flex items-center justify-between mb-16 border-b-4 border-border-default group-hover:border-text-accent/40 transition-colors duration-1000 pb-12">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                     <div className="w-8 h-8 flex items-center justify-center border-4 border-border-default text-text-muted font-black text-xs group-hover:border-text-accent group-hover:text-text-accent transition-all duration-1000 italic">&beta;</div>
                                     <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.4em] group-hover:text-text-accent transition-all duration-700 leading-tight">
                                        [ {report.name.replace(/ /g, '_')} ]
                                    </h3>
                                </div>
                                <span className="text-[11px] font-black text-text-muted opacity-20 uppercase tracking-[0.4em] italic group-hover:opacity-60 transition-opacity duration-1000 border-l-4 border-border-default/20 pl-6 group-hover:border-text-accent/30 pl-6">VIRTUAL_DATA_DESCRIPTOR_NODE</span>
                            </div>
                            <span className="text-[120px] opacity-[0.03] group-hover:opacity-80 transition-all duration-1500 transform scale-100 group-hover:scale-110 grayscale group-hover:grayscale-0 rotate-12 group-hover:rotate-0 drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] absolute -right-4 -top-4 pointer-events-none italic">
                                {report.icon}
                            </span>
                        </div>
                        
                        <div className="min-h-[120px] relative mt-8">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-text-accent opacity-10 group-hover:opacity-60 group-hover:w-3 transition-all duration-1000"></div>
                            <p className="text-[13px] text-text-muted uppercase tracking-[0.3em] leading-relaxed font-black pl-12 italic group-hover:not-italic group-hover:text-text-primary transition-all duration-700">
                                :: {report.description.toUpperCase().replace(/ /g, '_')}
                                <span className="block mt-6 opacity-20 text-[9px] group-hover:opacity-40 transition-opacity italic tracking-[1em]">DESC_PAYLOAD_MAP_RX_0x{(report.description.length).toString(16).toUpperCase()}</span>
                            </p>
                        </div>
                        
                        <div className="mt-16 pt-12 border-t-4 border-border-default/30 flex items-center justify-between group-hover:translate-x-4 transition-transform duration-1000">
                            <div className="flex items-center gap-6">
                                <div className="w-5 h-5 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.8)] group-hover:rotate-[360deg] duration-1000"></div>
                                <span className="text-[12px] font-black text-text-accent uppercase tracking-[0.8em] opacity-40 group-hover:opacity-100 italic transition-all">INITIALIZE_CALL_READY</span>
                            </div>
                            <span className="text-text-accent text-5xl font-black group-hover:translate-x-10 transition-transform duration-1000 italic">&rsaquo;</span>
                        </div>
                        
                        {/* Interactive hover background dynamic detail RX */}
                        <div className="absolute bottom-0 left-0 w-0 h-3 bg-text-accent group-hover:w-full transition-all duration-1500 ease-in-out shadow-[0_0_40px_rgba(var(--text-accent),0.6)]"></div>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    </button>
                ))}
            </div>

            {/* Controller Footer Identification RX Premium */}
            <div className="mt-40 flex flex-col xl:flex-row justify-between items-center gap-16 p-16 bg-bg-surface/60 border-8 border-border-default shadow-[inset_0_20px_100px_rgba(0,0,0,0.5)] group/footer hover:border-text-accent/30 transition-all duration-1000 relative overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-shine"></div>
                
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[1em] flex items-center gap-10 group-hover:text-text-primary transition-all relative z-10">
                     <div className="w-5 h-5 bg-text-accent rotate-45 animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.8)] group-hover:rotate-[225deg] transition-transform duration-1000"></div>
                     HUB_CONTROLLER_MASTER_v4.2 // STREAM: BI_RX_0xFD42_SYNC
                </div>
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.6em] italic flex items-center gap-12 relative z-10 group-hover:text-text-accent transition-colors duration-1000">
                     <div className="w-24 h-[3px] bg-border-default opacity-40 group-hover:w-48 group-hover:bg-text-accent transition-all duration-1000"></div>
                     ITSM_REPORT_INITIALIZATION_FACILITY // PARITY_ACK: 0xFD_OK
                </div>
            </div>
        </div>
    );
};
