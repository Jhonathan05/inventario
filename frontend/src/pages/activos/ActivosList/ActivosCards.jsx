import { Link } from 'react-router-dom';
import { getImageUrl, getAssetIconPath } from '../../../lib/utils';

const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-charcoal-400">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const getStatusBadge = (estado) => {
    const colors = {
        'DISPONIBLE': 'bg-green-50 text-green-700 ring-green-600/20',
        'ASIGNADO': 'bg-blue-50 text-blue-700 ring-blue-700/10',
        'EN_MANTENIMIENTO': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        'DADO_DE_BAJA': 'bg-red-50 text-red-700 ring-red-600/20',
    };
    return colors[estado] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};

/**
 * ActivosCards — Vista de tarjetas para dispositivos móviles.
 */
const ActivosCards = ({ activos, canEdit, onEdit }) => (
    <div className="mt-4 md:hidden space-y-3">
        {activos.length === 0 && (
            <div className="py-10 text-center text-gray-500 bg-white rounded-lg shadow">
                No se encontraron activos.
            </div>
        )}
        {activos.map((activo) => (
            <div key={activo.id} className="glass p-4 rounded-2xl border border-charcoal-100 shadow-sm hover:border-fnc-200 transition-all group">
                <div className="flex items-start gap-3">
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100 shadow-sm group-hover:shadow-md transition-shadow">
                        {getImageUrl(activo.imagen)
                            ? <img className="h-14 w-14 object-cover" src={getImageUrl(activo.imagen)} alt="" />
                            : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <Link to={`/activos/${activo.id}`} className="font-bold text-charcoal-800 hover:text-fnc-600 block truncate transition-colors text-base">
                            {activo.marca} {activo.modelo}
                        </Link>
                        <div className="text-xs text-charcoal-500 mt-1 font-medium select-all">
                            Placa: <span className="text-charcoal-700">{activo.placa}</span> | SN: <span className="text-charcoal-700">{activo.serial}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${getStatusBadge(activo.estado)}`}>
                                {activo.estado?.replace('_', ' ')}
                            </span>
                            {activo.categoria?.nombre && (
                                <span className="text-[10px] font-bold text-charcoal-600 bg-charcoal-50 border border-charcoal-200 uppercase tracking-wider rounded-lg px-2.5 py-1 shadow-sm">
                                    {activo.categoria.nombre}
                                </span>
                            )}
                        </div>
                        {activo.asignaciones?.[0]?.funcionario?.nombre && (
                            <div className="text-xs text-fnc-700 font-semibold mt-3 flex items-center gap-1.5 bg-fnc-50 px-2.5 py-1.5 rounded-lg border border-fnc-100 shadow-sm max-w-full">
                                <span className="shrink-0 text-fnc-500">👤</span>
                                <span className="truncate">{activo.asignaciones[0].funcionario.nombre}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-charcoal-100">
                    {canEdit && (
                        <button onClick={() => onEdit(activo)} className="text-xs text-fnc-600 bg-white border border-fnc-200 rounded-lg px-4 py-2 font-bold hover:bg-fnc-50 transition-colors shadow-sm">
                            Editar
                        </button>
                    )}
                    <Link to={`/activos/${activo.id}`} className="text-xs text-charcoal-700 bg-white border border-charcoal-200 rounded-lg px-4 py-2 font-bold hover:bg-charcoal-50 transition-colors shadow-sm ml-auto flex items-center gap-1 group/btn">
                        Ver Detalle <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        ))}
    </div>
);

export default ActivosCards;
