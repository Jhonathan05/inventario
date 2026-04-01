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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 ticket-detail-container">
            {/* Estilos para Impresión de Reporte */}
            <style>
                {`
                @media print {
                    @page { margin: 15mm; size: letter; }
                    body { background: white !important; font-size: 11pt; color: black !important; }
                    .nav-bar, .no-print, button, form, .actions-bar, .no-print-essential { display: none !important; }
                    .max-w-7xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; }
                    .shadow-sm, .border, .rounded-xl { border: 1px solid #ddd !important; box-shadow: none !important; border-radius: 4px !important; }
                    .bg-gray-50, .bg-indigo-50, .bg-white { background: white !important; }
                    
                    .ticket-header-print { 
                        display: flex !important; 
                        justify-content: space-between; 
                        align-items: center;
                        margin-bottom: 25px; 
                        border-bottom: 3px solid #1a237e; 
                        padding-bottom: 10px; 
                    }
                    .print-section { 
                        margin-bottom: 20px; 
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    .print-section-title {
                        background-color: #f1f5f9 !important;
                        -webkit-print-color-adjust: exact;
                        padding: 4px 10px;
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 10pt;
                        border: 1px solid #cbd5e1;
                        margin-bottom: 8px;
                        display: block !important;
                    }
                    .grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
                    .grid-1-col { display: block !important; }
                    
                    .text-blue-600, .text-indigo-600, .text-emerald-700 { color: black !important; font-weight: bold; }
                    textarea { 
                        border: none !important; 
                        background: #fdfdfd !important; 
                        overflow: visible !important; 
                        height: auto !important; 
                        min-height: 50px !important;
                        width: 100% !important;
                        padding: 5px !important;
                        font-family: inherit !important;
                        font-size: 11pt !important;
                    }
                }
                .ticket-header-print { display: none; }
                `}
            </style>

            {/* Encabezado Profesional para el Reporte (Solo Impresión) */}
            <div className="ticket-header-print">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-900 text-white p-2 rounded font-black text-xl italic tracking-tighter">HD</div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 uppercase leading-none">Bitácora Técnica</h1>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Gestión de Incidentes y Requerimientos TI</p>
                    </div>
                </div>
                <div className="text-right border-l pl-4 border-gray-200">
                    <p className="text-2xl font-black text-indigo-900 leading-none">CASO #{ticket.id}</p>
                    <p className="text-[9px] text-gray-500 uppercase mt-1">Generado: {new Date().toLocaleString()}</p>
                </div>
            </div>

            <TicketHeader ticket={ticket} onBack={() => navigate('/tickets')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Izquierdo: Info */}
                <div className="space-y-4">
                    <TicketInfo ticket={ticket} onDownload={handleDownload} />
                    <TicketInvolved ticket={ticket} />
                    {canEdit && (
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
                    )}
                </div>

                {/* Panel Derecho: Timeline & Notebook */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {canEdit && (
                        <TechnicalNotes 
                            ticket={ticket}
                            localTicket={localTicket}
                            setLocalTicket={setLocalTicket}
                            handleGuardarNotasTecnicas={handleGuardarNotasTecnicas}
                            saving={saving}
                        />
                    )}
                    
                    <TicketTimeline 
                        ticket={ticket} 
                        handleDownload={handleDownload} 
                        user={user} 
                    />

                    {canEdit && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
