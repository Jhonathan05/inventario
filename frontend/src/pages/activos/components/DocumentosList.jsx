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
        <div className="font-mono animate-fadeIn mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12 px-6">
                <div className="flex items-center gap-6">
                    <div className="w-3 h-3 bg-text-accent animate-pulse"></div>
                    <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.6em]">/ attached_document_repository</h3>
                </div>
                {canEdit && (
                    <div className="group/upload relative">
                        <label 
                            htmlFor="file-upload" 
                            className={`cursor-pointer inline-flex items-center px-12 py-4 border-2 border-border-strong text-[12px] font-black uppercase tracking-[0.5em] transition-all bg-bg-elevated text-text-accent hover:text-text-primary shadow-3xl relative overflow-hidden group/label active:scale-95 ${uploading ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <span className="flex items-center gap-4">
                                     <div className="w-4 h-4 border-2 border-t-text-accent border-border-default animate-spin"></div>
                                     INITIALIZING_SYNC...
                                </span>
                            ) : '[ + ] ADD_DOCUMENT_ASSET_IO'}
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
                <div className="mb-10 mx-6 p-6 border-2 border-text-accent bg-text-accent/5 text-text-accent font-black text-[11px] uppercase tracking-[0.4em] animate-pulse flex items-center gap-6 shadow-xl">
                    <span className="text-2xl">!!</span>
                    <div>
                        <div>FAULT_DETECTED: {error}</div>
                        <div className="text-[8px] opacity-60 mt-1">CHECK_IO_INTEGRITY // CLEAR_BUFFER_RETRY</div>
                    </div>
                </div>
            )}

            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden group/docs hover:border-border-strong transition-all relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/docs:text-text-accent transition-colors">DOC_VOL_STREAM_RX</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse border-spacing-0 min-w-[800px]">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: FILENAME_NODE</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: EXTENSION</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: TIMESTAMP_INIT</th>
                                {canEdit && <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {documentos?.map((doc) => (
                                <tr key={doc.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <a 
                                            href={doc.ruta.startsWith('/') ? doc.ruta : `/${doc.ruta}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[12px] font-black text-text-primary uppercase tracking-tight hover:text-text-accent transition-colors underline decoration-text-accent/30 decoration-2 underline-offset-8 tabular-nums"
                                        >
                                            {doc.nombre.replace(/ /g, '_')}
                                        </a>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-bg-base border-2 border-border-default px-4 py-1 group-hover/row:border-text-accent group-hover/row:text-text-primary transition-all shadow-md">
                                            .{doc.tipo.split('/')[1]?.toUpperCase() || 'BIN'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">
                                        {new Date(doc.creadoEn).toLocaleDateString().replace(/\//g, ' / ')}
                                    </td>
                                    {canEdit && (
                                        <td className="px-10 py-8 text-right whitespace-nowrap">
                                            <button 
                                                onClick={() => handleDelete(doc.id)} 
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest hover:text-text-accent hover:border-text-accent transition-all shadow-xl active:scale-95 group/purge"
                                            >
                                                <span className="opacity-40 group-hover/purge:translate-x-1 transition-transform mr-2">!</span>
                                                [ PURGE_ALLOC_TX ]
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {(!documentos || documentos.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center text-text-muted text-[12px] font-black uppercase tracking-[0.5em] opacity-40 italic">
                                        ! NO_DOCUMENT_NODES_ATTACHED_TO_THIS_BUFFER_CORE
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentosList;
