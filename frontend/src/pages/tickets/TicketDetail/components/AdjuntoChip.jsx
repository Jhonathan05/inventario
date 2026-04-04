const getFileSymbol = (tipoMime) => {
    if (!tipoMime) return 'OBJ_NODE';
    if (tipoMime.startsWith('image/')) return 'IMG_NODE';
    if (tipoMime === 'application/pdf') return 'PDF_DOC';
    if (tipoMime.includes('word')) return 'DOC_WORD';
    if (tipoMime.includes('sheet') || tipoMime.includes('excel')) return 'XLS_DATA';
    return 'BIN_BLOB';
};

export const AdjuntoChip = ({ doc, onDownload }) => {
    const symbol = getFileSymbol(doc.tipo);
    return (
        <button
            type="button"
            onClick={() => onDownload(doc)}
            title={`PUSH_GET_PAYLOAD: ${doc.nombre}`}
            className="flex items-center gap-6 bg-bg-base border-4 border-border-default px-6 py-3 text-[11px] font-black uppercase tracking-[0.4em] text-text-primary hover:border-text-accent transition-all group shadow-[0_20px_60px_rgba(0,0,0,0.6)] active:scale-90 relative overflow-hidden italic hover:not-italic duration-700"
        >
            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-text-accent opacity-40 group-hover:opacity-100 transition-all font-black border-r-2 border-border-default pr-4 group-hover:border-text-accent group-hover:animate-pulse">[{symbol}]</span>
            <span className="max-w-[220px] truncate group-hover:tracking-[0.6em] transition-all duration-700">{doc.nombre.toUpperCase().replace(/ /g, '_')}</span>
            <span className="text-text-accent opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all ml-4 font-normal">»</span>
        </button>
    );
};
