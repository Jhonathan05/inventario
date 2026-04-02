const getFileSymbol = (tipoMime) => {
    if (!tipoMime) return '[OBJ_NODE]';
    if (tipoMime.startsWith('image/')) return '[IMG_NODE]';
    if (tipoMime === 'application/pdf') return '[PDF_DOC]';
    if (tipoMime.includes('word')) return '[DOC_WORD]';
    if (tipoMime.includes('sheet') || tipoMime.includes('excel')) return '[XLS_DATA]';
    return '[BIN_BLOB]';
};

export const AdjuntoChip = ({ doc, onDownload }) => {
    const symbol = getFileSymbol(doc.tipo);
    return (
        <button
            type="button"
            onClick={() => onDownload(doc)}
            title={`PUSH_GET_PAYLOAD: ${doc.nombre}`}
            className="flex items-center gap-4 bg-bg-base border border-border-default px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-text-primary hover:border-text-accent transition-all group shadow-xl active:scale-95"
        >
            <span className="text-text-accent opacity-60 group-hover:opacity-100 transition-opacity font-black">{symbol}</span>
            <span className="max-w-[200px] truncate">{doc.nombre.toUpperCase().replace(/ /g, '_')}</span>
            <span className="text-text-muted opacity-30 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all ml-2">v</span>
        </button>
    );
};
