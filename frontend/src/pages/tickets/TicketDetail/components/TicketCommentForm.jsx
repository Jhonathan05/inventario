import { PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

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
        <form onSubmit={handleAgregarComentario} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden no-print">
            <div className="p-4">
                <textarea
                    rows="2"
                    value={nuevoComentario}
                    onChange={e => setNuevoComentario(e.target.value)}
                    placeholder="Añade una actualización o nota sobre este caso..."
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 text-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />

                {/* Preview de archivos a adjuntar */}
                {archivosComentario.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 px-4">
                        {archivosComentario.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 border border-blue-100">
                                <PaperClipIcon className="w-3 h-3" />
                                <span className="max-w-[120px] truncate">{f.name}</span>
                                <button type="button" onClick={() => handleRemoveFile(i)}
                                    className="ml-0.5 text-blue-400 hover:text-red-500">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action bar */}
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        <PaperClipIcon className="w-4 h-4" />
                        Adjuntar archivo
                    </button>
                </div>
                <button type="submit" disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {saving ? 'Enviando...' : 'Enviar Nota'}
                </button>
            </div>
        </form>
    );
};
