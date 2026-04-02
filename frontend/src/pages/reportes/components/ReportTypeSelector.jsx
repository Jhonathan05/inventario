import { REPORT_TYPES } from '../reportConfigs';

export const ReportTypeSelector = ({ onSelect }) => {
    return (
        <div className="font-mono animate-fadeIn px-4 sm:px-6 lg:px-8 mb-24">
            {/* Main Header / Analytics Hub Commander */}
            <div className="mb-16 bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-20 group-hover:text-text-accent transition-all">ANALYTIC_CORE_IO</div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black uppercase tracking-[0.5em] text-text-primary leading-none">
                        / analytics_reporting_hub
                    </h1>
                    <div className="mt-6 flex flex-wrap items-center gap-8">
                        <div className="flex items-center gap-4">
                             <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_8px_rgba(var(--text-accent),0.5)]"></div>
                             <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.4em]">SELECT_SYSTEM_POOL_TO_INITIALIZE_DATA_TX</p>
                        </div>
                        <span className="text-border-default h-6 w-[1px]"></span>
                        <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">ESTABLISHING_NODE_TRACEABILITY_ACTIVE // 0xAF92</p>
                    </div>
                </div>
                {/* Subtle scanning animation line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-text-accent opacity-20 animate-loadingBar"></div>
            </div>

            {/* Selection Grid / Payload Hook Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {REPORT_TYPES.map((report) => (
                    <button 
                        key={report.id} 
                        onClick={() => onSelect(report)}
                        className="text-left bg-bg-surface border-2 border-border-default p-12 hover:border-text-accent group transition-all font-mono relative overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(251,97,7,0.1)] active:scale-95"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[0.5em] group-hover:opacity-30 group-hover:text-text-accent transition-all">
                            {report.id.substring(0,4).toUpperCase()}_HOOK_RX
                        </div>
                        
                        <div className="flex items-center justify-between mb-12 border-b border-border-default group-hover:border-text-accent/30 transition-colors pb-8">
                            <h3 className="text-[13px] font-black text-text-primary uppercase tracking-[0.3em] group-hover:text-text-accent transition-colors leading-tight">
                                [ {report.name.replace(/ /g, '_')} ]
                            </h3>
                            <span className="text-6xl opacity-5 group-hover:opacity-60 transition-all transform scale-100 group-hover:scale-125 grayscale group-hover:grayscale-0 rotate-12 group-hover:rotate-0 duration-500">
                                {report.icon}
                            </span>
                        </div>
                        
                        <div className="min-h-[80px]">
                            <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity border-l-2 border-border-default group-hover:border-text-accent pl-6">
                                :: {report.description.toUpperCase()}
                            </p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t-2 border-border-default/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 bg-text-accent animate-pulse"></div>
                                <span className="text-[10px] font-black text-text-accent uppercase tracking-[0.5em]">INITIALIZE_CALL_READY</span>
                            </div>
                            <span className="text-text-accent text-2xl font-black">&rarr;</span>
                        </div>
                        
                        {/* Interactive hover background detail */}
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-text-accent group-hover:w-full transition-all duration-700"></div>
                    </button>
                ))}
            </div>

            {/* Controller Footer Identification */}
            <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-8 p-10 bg-bg-surface/40 border border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] flex items-center gap-4">
                     <div className="w-2 h-2 bg-text-accent rotate-45 animate-pulse shadow-[0_0_8px_rgba(255,51,102,0.5)]"></div>
                     HUB_CONTROLLER_MASTER // STREAM: BI_RX_22
                </div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] italic group-hover:text-text-primary transition-colors">
                     ITSM_REPORT_INITIALIZATION_FACILITY // PARITY_ACK: OK
                </div>
            </div>
        </div>
    );
};
