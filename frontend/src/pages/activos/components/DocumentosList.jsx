import { useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

const DocumentosList = ({ activoId, documentos, onUpdate }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('!! FILE_OVERFLOW :: MAX_5MB_SYSTEM_LIMIT');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('activoId', activoId);

        setUploading(true);
        setError('');

        try {
            await api.post('/documentos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate();
        } catch (err) {
            console.error(err);
            setError('!! UPLOAD_FAULT :: DATA_STREAM_INTERRUPTED_0xDOC');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = null;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿CONFIRMAR_ELIMINACION_DE_DOCUMENTO? (PREVENT_DATA_LOSS_PROTOCOL)')) return;
        try {
            await api.delete(`/documentos/${id}`);
            onUpdate();
        } catch (err) {
            console.error(err);
            alert('!! DELETE_FAULT :: REPOSITORY_REJECTED_TX');
        }
    };

    return (
        <div className="font-mono animate-fadeIn mb-24 selection:bg-text-accent selection:text-bg-base">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16 px-10">
                <div className="flex items-center gap-8 group">
                    <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.6)]"></div>
                    <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em] relative leading-none">
                        / ATTACHED_DOCUMENT_CORE_VAULT
                        <div className="h-1 w-1/3 bg-text-accent/20 absolute bottom-[-16px] left-0">
                             <div className="h-full bg-text-accent w-1/2 animate-loadingBarSlow"></div>
                        </div>
                    </h3>
                </div>
                {canEdit && (
                    <div className="group/upload relative">
                        <label 
                            htmlFor="file-upload" 
                            className={`cursor-pointer inline-flex items-center px-14 py-6 border-8 border-border-strong text-[13px] font-black uppercase tracking-[0.6em] transition-all bg-bg-elevated text-text-accent hover:text-text-primary hover:border-text-accent shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group/label active:scale-90 ${uploading ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            <span className="relative z-10 flex items-center gap-6">
                                {uploading ? (
                                    <>
                                         <div className="w-5 h-5 border-4 border-t-text-accent border-border-default animate-spin"></div>
                                         SYNCING_PAYLOAD...
                                    </>
                                ) : '[ + ] ADD_DOCUMENT_ASSET_IO'}
                            </span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/label:opacity-100 transition-opacity"></div>
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-14 mx-10 p-10 border-4 border-text-accent bg-text-accent/5 text-text-accent font-black text-[13px] uppercase tracking-[0.6em] animate-pulse flex items-center gap-10 shadow-[0_20px_60px_rgba(var(--text-accent),0.2)]">
                    <span className="text-4xl">!!</span>
                    <div>
                        <div className="mb-1">CRITICAL_FAULT_TX: {error}</div>
                        <div className="text-[10px] opacity-40 uppercase tracking-[0.5em] italic">CHECK_IO_INTEGRITY // REINITIALIZE_STREAM_TX_0x66</div>
                    </div>
                </div>
            )}

            <div className="bg-bg-surface border-8 border-border-default shadow-[0_60px_180px_rgba(0,0,0,0.9)] overflow-hidden group/docs hover:border-text-accent/10 transition-all duration-1000 relative">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-xl font-black uppercase tracking-[2.5em] group-hover/docs:text-text-accent group-hover/docs:opacity-20 transition-all italic italic">DOCUMENT_VAULT_STREAM_RX_v4</div>
                <div className="absolute top-0 left-0 w-4 h-full bg-text-accent/10 opacity-30 group-hover/docs:opacity-100 transition-opacity"></div>
                
                <div className="overflow-x-auto custom-scrollbar bg-bg-base/30">
                    <table className="w-full text-left border-collapse border-spacing-0 min-w-[1000px]">
                        <thead>
                            <tr className="bg-bg-base/95 backdrop-blur-md border-b-8 border-border-default shadow-2xl relative z-10">
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-accent border-r-4 border-border-default/30 shadow-inner">:: FILENAME_NODE_ENTRY</th>
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: CLASS_EXT</th>
                                <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: TX_TIMESTAMP_INIT</th>
                                {canEdit && <th className="px-12 py-10 text-right text-[13px] font-black uppercase tracking-[0.8em] text-text-muted shadow-inner bg-bg-surface/50">_IO_CMD</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-border-default/10">
                            {documentos?.map((doc) => (
                                <tr key={doc.id} className="hover:bg-text-accent/5 transition-all group/row border-l-8 border-l-transparent hover:border-l-text-accent cursor-default relative">
                                    <td className="px-12 py-10 border-r-4 border-border-default/10 group-hover:bg-bg-elevated/20 transition-colors">
                                        <a 
                                            href={doc.ruta.startsWith('/') ? doc.ruta : `/${doc.ruta}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[14px] font-black text-text-primary uppercase tracking-widest hover:text-text-accent transition-all block group-hover:translate-x-4 italic underline decoration-text-accent/20 decoration-4 underline-offset-[12px]"
                                        >
                                            <span className="text-text-accent opacity-20 group-hover:opacity-100 transition-opacity mr-4 font-normal">RD_RX:</span>
                                            {doc.nombre.toUpperCase().replace(/ /g, '_')}
                                        </a>
                                    </td>
                                    <td className="px-12 py-10 border-r-4 border-border-default/10">
                                        <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em] bg-bg-base border-4 border-border-default px-6 py-2 group-hover/row:border-text-accent transition-all shadow-xl block text-center">
                                            .{doc.tipo.split('/')[1]?.toUpperCase() || 'BIN'}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 text-[14px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r-4 border-border-default/10 italic">
                                        {new Date(doc.creadoEn).toLocaleDateString().replace(/\//g, ' / ')}
                                    </td>
                                    {canEdit && (
                                        <td className="px-12 py-10 text-right whitespace-nowrap bg-bg-surface/20 group-hover:bg-bg-base/40 transition-colors">
                                            <button 
                                                onClick={() => handleDelete(doc.id)} 
                                                className="inline-flex items-center justify-center text-[11px] font-black text-text-muted border-4 border-border-default bg-bg-base px-8 py-5 uppercase tracking-[0.5em] hover:text-text-accent hover:border-text-accent transition-all shadow-xl active:scale-90 group/purge relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-4">
                                                     <span className="opacity-40 group-hover/purge:translate-x-2 transition-transform font-bold">!</span>
                                                     [ PURGE_ALLOC_TX ]
                                                </span>
                                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/purge:opacity-100 transition-opacity"></div>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {(!documentos || documentos.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="py-48 text-center text-text-muted text-[18px] font-black uppercase tracking-[1.2em] opacity-20 italic animate-pulse">
                                        ! NO_DOCUMENT_NODES_ATTACHED_TO_THIS_BUFFER_CORE
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Inner graphical decoration */}
                <div className="bg-bg-base/80 px-12 py-6 border-t-8 border-border-default border-opacity-30 flex justify-between items-center opacity-40 italic shadow-inner">
                     <span className="text-[10px] font-black uppercase tracking-[1.5em]">DOCUMENT_REPOSITORY_v4.2 // NODE_VAULT_AF22</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.8em] text-text-accent">READY_BUFF_RX_0xAF</span>
                </div>
            </div>
        </div>
    );
};

export default DocumentosList;
