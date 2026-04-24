import { PaperClipIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const TicketCommentForm = ({ 
    nuevoComentario, 
    setNuevoComentario, 
    archivosComentario, 
    handleFileSelect, 
    handleRemoveFile, 
    handleAgregarComentario, 
    fileInputRef, 
    saving 
}) => {
    return (
        <form onSubmit={handleAgregarComentario} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden no-print transition-all hover:shadow-md">
            <div className="p-6">
                <h3 className="text-[11px] font-bold uppercase text-charcoal-400 tracking-widest mb-4 opacity-80">Agregar Intervención Técnica</h3>
                <textarea
                    rows="3"
                    value={nuevoComentario}
                    onChange={e => setNuevoComentario(e.target.value)}
                    placeholder="Describe los avances o novedades sobre este caso..."
                    className="block w-full rounded-2xl border border-gray-100 bg-gray-50/50 text-[13px] font-medium p-4 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none leading-relaxed text-charcoal-700"
                />

                {/* Preview de archivos a adjuntar */}
                {archivosComentario.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {archivosComentario.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-2 text-[10px] bg-primary/5 text-primary rounded-full px-3 py-1.5 border border-primary/10 font-bold uppercase tracking-tight">
                                <PaperClipIcon className="w-3.5 h-3.5" />
                                <span className="max-w-[150px] truncate">{f.name}</span>
                                <button type="button" onClick={() => handleRemoveFile(i)}
                                    className="ml-1 text-primary hover:text-rose-500 transition-colors">
                                    <XMarkIcon className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action bar */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect} className="hidden" />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 text-[11px] text-charcoal-500 hover:text-primary font-bold px-4 py-2 rounded-full hover:bg-white border border-transparent hover:border-gray-100 transition-all uppercase tracking-widest"
                    >
                        <PaperClipIcon className="w-4 h-4" />
                        Anexar Recurso
                    </button>
                </div>
                <button 
                    type="submit" 
                    disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                    className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all font-bold text-[11px] uppercase tracking-widest border border-primary disabled:opacity-50 disabled:grayscale"
                >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {saving ? 'Transmitiendo...' : 'Publicar Nota'}
                </button>
            </div>
        </form>
    );
};
