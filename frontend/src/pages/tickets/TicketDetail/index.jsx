import { useTicketDetail } from './useTicketDetail';
import { TicketHeader } from './components/TicketHeader';
import { TicketInfo } from './components/TicketInfo';
import { TicketInvolved } from './components/TicketInvolved';
import { TicketManagement } from './components/TicketManagement';
import { TechnicalNotes } from './components/TechnicalNotes';
import { TicketTimeline } from './components/TicketTimeline';
import { TicketCommentForm } from './components/TicketCommentForm';

const TicketDetail = () => {
    const {
        ticket,
        loading,
        user,
        canEdit,
        tecnicos,
        nuevoComentario,
        setNuevoComentario,
        nuevoEstado,
        setNuevoEstado,
        tecnicoAsignado,
        setTecnicoAsignado,
        saving,
        archivosComentario,
        localTicket,
        setLocalTicket,
        fileInputRef,
        handleDownload,
        handleFileSelect,
        handleRemoveFile,
        handleAgregarComentario,
        handleCambiarEstado,
        handleGuardarNotasTecnicas,
        handleAsignarTecnico,
        navigate
    } = useTicketDetail();

    if (loading || !ticket) {
        return (
            <div className="flex flex-col justify-center items-center h-screen font-mono bg-bg-base relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-15 pointer-events-none text-2xl font-black animate-pulse tracking-[2em] italic">SYSTEM_BUSY_RX_BUF</div>
                <div className="w-24 h-24 border-[12px] border-border-default border-t-text-accent animate-spin rounded-full mb-14 shadow-[0_0_60px_rgba(var(--text-accent),0.3)]"></div>
                <div className="text-[18px] font-black text-text-accent animate-pulse uppercase tracking-[1em] mb-10">
                    # SYNCING_TICKET_PAYLOAD_RX...
                </div>
                <div className="text-[11px] text-text-muted uppercase tracking-[0.4em] opacity-40 italic bg-bg-surface px-8 py-4 border-l-8 border-border-default shadow-inner">ESTABLISHING_ENCRYPTED_DB_CHANNEL // BUFFER_SYNC_ACTIVE_0xFD</div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto space-y-16 font-mono mb-48 px-10 animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            {/* Extended Terminal Logic - Print & Layout Rules v4.2 */}
            <style>
                {`
                @media print {
                    @page { margin: 15mm; size: letter; }
                    body { background: white !important; font-family: 'JetBrains Mono', Courier, monospace !important; font-size: 10pt; color: black !important; }
                    .nav-bar, .no-print, button, form, .actions-bar, .no-print-essential, .custom-scrollbar { display: none !important; }
                    .max-w-full { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                    .border, [class*="border-"] { border: 1px solid black !important; padding: 10px !important; }
                    .bg-bg-surface, .bg-bg-base, .bg-bg-elevated { background: white !important; }
                    
                    .ticket-header-print { 
                        display: flex !important; 
                        justify-content: space-between; 
                        align-items: center;
                        margin-bottom: 50px; 
                        border-bottom: 8px solid black !important; 
                        padding-bottom: 25px; 
                    }
                    .print-section { 
                        margin-bottom: 40px; 
                        break-inside: avoid;
                        page-break-inside: avoid;
                        border-bottom: 2px solid black !important;
                        padding-bottom: 25px;
                    }
                    .grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
                    .grid-1-col { display: block !important; }
                    
                    textarea { 
                        border: 2px dashed black !important; 
                        background: white !important; 
                        overflow: visible !important; 
                        height: auto !important; 
                        min-height: 120px !important;
                        width: 100% !important;
                        padding: 20px !important;
                        font-family: inherit !important;
                        font-size: 10pt !important;
                        text-transform: uppercase !important;
                    }
                    .text-text-accent, .text-text-secondary { color: black !important; font-weight: 900 !important; border-bottom: 3px solid black !important; }
                    [class*="shadow"] { box-shadow: none !important; }
                }
                .ticket-header-print { display: none; }
                `}
            </style>

            {/* High-Fidelity Print Manifest Header RX */}
            <div className="ticket-header-print font-mono uppercase">
                <div className="flex items-center gap-10">
                    <div className="border-8 border-black p-6 font-black text-4xl tracking-tighter bg-black text-white shadow-2xl">HD_CORE_RX</div>
                    <div>
                        <h1 className="text-3xl font-black leading-tight tracking-[0.2em]">TECHNICAL_LIFECYCLE_LOG_TX</h1>
                        <p className="text-[12px] font-black text-gray-600 tracking-[0.4em] mt-3 bg-gray-100 px-4 py-1 italic">ITSM_SYSTEM_FLOW_REPORTS // SECURITY_COMITE_TOLIMA_v4.2</p>
                    </div>
                </div>
                <div className="text-right border-l-8 pl-10 border-black shadow-inner">
                    <p className="text-4xl font-black leading-none tabular-nums tracking-tighter">MANIFEST_ID: #{ticket.id.toString().padStart(6, '0')}</p>
                    <p className="text-[11px] text-gray-500 font-black mt-4 tracking-[0.5em] italic bg-gray-50 px-4 py-2 border border-gray-200">GEN_TS: {new Date().toLocaleString().toUpperCase().replace(/ /g, '_')}</p>
                </div>
            </div>

            <TicketHeader ticket={ticket} onBack={() => navigate('/tickets')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                {/* Visual Grid Accent */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,rgba(var(--text-accent),0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Left Terminal Panel: Static Data & Registry RX */}
                <div className="space-y-16 order-2 lg:order-1 relative z-10 transition-all">
                    <div className="animate-slideRight border-8 border-border-default hover:border-text-accent/20 transition-all group/info bg-bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.6)]" style={{ animationDelay: '100ms' }}>
                        <TicketInfo ticket={ticket} onDownload={handleDownload} />
                    </div>
                    <div className="animate-slideRight border-8 border-border-default hover:border-text-accent/20 transition-all group/invest bg-bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.6)]" style={{ animationDelay: '200ms' }}>
                        <TicketInvolved ticket={ticket} />
                    </div>
                    {canEdit && (
                        <div className="animate-slideRight border-8 border-border-default hover:border-text-accent/20 transition-all group/mgmt bg-bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.6)]" style={{ animationDelay: '300ms' }}>
                            <TicketManagement 
                                ticket={ticket}
                                user={user}
                                tecnicoAsignado={tecnicoAsignado}
                                setTecnicoAsignado={setTecnicoAsignado}
                                tecnicos={tecnicos}
                                handleAsignarTecnico={handleAsignarTecnico}
                                nuevoEstado={nuevoEstado}
                                setNuevoEstado={setNuevoEstado}
                                handleCambiarEstado={handleCambiarEstado}
                            />
                        </div>
                    )}

                    {/* Footer Print Info - Hidden in UI */}
                    <div className="hidden print:block text-[9px] font-black text-gray-500 mt-24 uppercase tracking-[0.8em] italic border-t-4 border-black pt-10">
                        END_OF_MANIFEST_DATA_RX // SYSTEM_SIG: {Math.random().toString(36).substr(2, 12).toUpperCase()} // CRC_OK
                    </div>
                </div>

                {/* Right Terminal Panel: Dynamic Streams & Comm Log TX */}
                <div className="lg:col-span-2 flex flex-col gap-16 order-1 lg:order-2 relative z-10">
                    {canEdit && (
                        <div className="no-print animate-slideUp border-8 border-border-default hover:border-text-accent/20 transition-all bg-bg-surface shadow-[0_60px_150px_rgba(0,0,0,0.8)]">
                            <TechnicalNotes 
                                ticket={ticket}
                                localTicket={localTicket}
                                setLocalTicket={setLocalTicket}
                                handleGuardarNotasTecnicas={handleGuardarNotasTecnicas}
                                saving={saving}
                            />
                        </div>
                    )}
                    
                    <div className="animate-slideUp border-8 border-border-default hover:border-text-accent/20 transition-all bg-bg-surface shadow-[0_60px_150px_rgba(0,0,0,0.8)]" style={{ animationDelay: '150ms' }}>
                        <TicketTimeline 
                            ticket={ticket} 
                            handleDownload={handleDownload} 
                            user={user} 
                        />
                    </div>

                    {canEdit && (
                        <div className="no-print animate-slideUp border-8 border-border-default hover:border-text-accent/20 transition-all bg-bg-surface shadow-[0_60px_150px_rgba(0,0,0,0.8)]" style={{ animationDelay: '250ms' }}>
                            <TicketCommentForm 
                                nuevoComentario={nuevoComentario}
                                setNuevoComentario={setNuevoComentario}
                                archivosComentario={archivosComentario}
                                handleFileSelect={handleFileSelect}
                                handleRemoveFile={handleRemoveFile}
                                handleAgregarComentario={handleAgregarComentario}
                                fileInputRef={fileInputRef}
                                saving={saving}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Visual Status Trace Footer */}
            <div className="pt-16 pb-10 flex justify-between items-center opacity-10 font-black text-[10px] uppercase tracking-[2em] italic transition-all hover:opacity-40">
                <p>ITSM_CORE_v4.2_TRACE_0xFD42</p>
                <p className="animate-pulse">_LISTENING_FOR_TX_EVENTS...</p>
            </div>
        </div>
    );
};

export default TicketDetail;
