import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const getFileInfo = (tipoMime, nombre) => {
    if (!tipoMime) return { icon: '📎', color: 'text-gray-600 bg-gray-100' };
    if (tipoMime.startsWith('image/')) return { icon: '🖼️', color: 'text-purple-600 bg-purple-50' };
    if (tipoMime === 'application/pdf') return { icon: '📄', color: 'text-red-600 bg-red-50' };
    if (tipoMime.includes('word')) return { icon: '📝', color: 'text-blue-600 bg-blue-50' };
    if (tipoMime.includes('sheet') || tipoMime.includes('excel')) return { icon: '📊', color: 'text-green-600 bg-green-50' };
    return { icon: '📎', color: 'text-gray-600 bg-gray-100' };
};

export const AdjuntoChip = ({ doc, onDownload }) => {
    const { icon, color } = getFileInfo(doc.tipo, doc.nombre);
    return (
        <button
            type="button"
            onClick={() => onDownload(doc)}
            title={`Descargar: ${doc.nombre}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} hover:opacity-80 transition-opacity border border-current/10`}
        >
            <span>{icon}</span>
            <span className="max-w-[140px] truncate">{doc.nombre}</span>
            <ArrowDownTrayIcon className="w-3 h-3 shrink-0" />
        </button>
    );
};
