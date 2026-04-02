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
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black animate-pulse tracking-[1em]">SYSTEM_BUSY_RX</div>
                <div className="text-[14px] font-black text-text-accent animate-pulse uppercase tracking-[0.8em] mb-6">
                    # SYNCING_TICKET_PAYLOAD...
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-[0.4em] opacity-40">ESTABLISHING_ENCRYPTED_DB_CHANNEL // BUFFER_SYNC_ACTIVE</div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto space-y-10 font-mono mb-20 px-4 sm:px-6 animate-fadeIn">
            {/* Extended Terminal Logic - Print & Layout Rules */}
            <style>
                {`
                @media print {
                    @page { margin: 15mm; size: letter; }
                    body { background: white !important; font-family: 'JetBrains Mono', Courier, monospace !important; font-size: 10pt; color: black !important; }
                    .nav-bar, .no-print, button, form, .actions-bar, .no-print-essential, .custom-scrollbar { display: none !important; }
                    .max-w-full { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                    .border, [class*="border-"] { border: 1px solid black !important; }
                    .bg-bg-surface, .bg-bg-base, .bg-bg-elevated { background: white !important; }
                    
                    .ticket-header-print { 
                        display: flex !important; 
                        justify-content: space-between; 
                        align-items: center;
                        margin-bottom: 40px; 
                        border-bottom: 3px solid black; 
                        padding-bottom: 20px; 
                    }
                    .print-section { 
                        margin-bottom: 30px; 
                        break-inside: avoid;
                        page-break-inside: avoid;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 20px;
                    }
                    .grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; }
                    .grid-1-col { display: block !important; }
                    
                    textarea { 
                        border: 1px dashed black !important; 
                        background: white !important; 
                        overflow: visible !important; 
                        height: auto !important; 
                        min-height: 100px !important;
                        width: 100% !important;
                        padding: 15px !important;
                        font-family: inherit !important;
                        font-size: 10pt !important;
                        text-transform: uppercase !important;
                    }
                    .text-text-accent, .text-text-secondary { color: black !important; font-weight: 900 !important; border-bottom: 2px solid black !important; }
                    [class*="shadow"] { box-shadow: none !important; }
                }
                .ticket-header-print { display: none; }
                `}
            </style>

            {/* High-Fidelity Print Manifest Header */}
            <div className="ticket-header-print font-mono uppercase">
                <div className="flex items-center gap-8">
                    <div className="border-4 border-black p-4 font-black text-3xl tracking-tighter bg-black text-white">HD_CORE_RX</div>
                    <div>
                        <h1 className="text-2xl font-black leading-tight tracking-[0.1em]">TECHNICAL_LIFECYCLE_LOG</h1>
                        <p className="text-[11px] font-black text-gray-500 tracking-[0.3em] mt-2">ITSM_SYSTEM_FLOW_REPORTS // SECURITY_DOMAIN_COMITE_TOLIMA</p>
                    </div>
                </div>
                <div className="text-right border-l-3 pl-8 border-black">
                    <p className="text-3xl font-black leading-none tabular-nums">MANIFEST_ID: #{ticket.id.toString().padStart(6, '0')}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-2 tracking-widest">GEN_TS: {new Date().toLocaleString().toUpperCase().replace(/ /g, '_')}</p>
                </div>
            </div>

            <TicketHeader ticket={ticket} onBack={() => navigate('/tickets')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Panel Left: Static Metadata & Registry */}
                <div className="space-y-10 order-2 lg:order-1">
                    <div className="animate-slideRight" style={{ animationDelay: '100ms' }}>
                        <TicketInfo ticket={ticket} onDownload={handleDownload} />
                    </div>
                    <div className="animate-slideRight" style={{ animationDelay: '200ms' }}>
                        <TicketInvolved ticket={ticket} />
                    </div>
                    {canEdit && (
                        <div className="animate-slideRight" style={{ animationDelay: '300ms' }}>
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
                    <div className="hidden print:block text-[8px] font-black text-gray-400 mt-20 uppercase tracking-[0.5em]">
                        END_OF_MANIFEST_DATA // DOCUMENT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>

                {/* Panel Right: Dynamic Streams & Logs */}
                <div className="lg:col-span-2 flex flex-col gap-10 order-1 lg:order-2">
                    {canEdit && (
                        <div className="no-print animate-slideUp">
                            <TechnicalNotes 
                                ticket={ticket}
                                localTicket={localTicket}
                                setLocalTicket={setLocalTicket}
                                handleGuardarNotasTecnicas={handleGuardarNotasTecnicas}
                                saving={saving}
                            />
                        </div>
                    )}
                    
                    <div className="animate-slideUp" style={{ animationDelay: '150ms' }}>
                        <TicketTimeline 
                            ticket={ticket} 
                            handleDownload={handleDownload} 
                            user={user} 
                        />
                    </div>

                    {canEdit && (
                        <div className="no-print animate-slideUp" style={{ animationDelay: '250ms' }}>
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
        </div>
    );
};

export default TicketDetail;
