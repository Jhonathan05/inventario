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
 * ActivosTable — Tabla para vistas escritorio (hidden en móvil).
 */
const ActivosTable = ({ activos, canEdit, onEdit }) => (
    <div className="mt-6 hidden md:block">
        <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-charcoal-50 border-b border-charcoal-100 text-sm uppercase tracking-wider text-charcoal-500">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold">Activo</th>
                            <th scope="col" className="px-6 py-4 font-bold">Categoría</th>
                            <th scope="col" className="px-6 py-4 font-bold">Estado</th>
                            <th scope="col" className="px-6 py-4 font-bold">Ubicación y Piso</th>
                            <th scope="col" className="px-6 py-4 font-bold">Asignado A</th>
                            {canEdit && <th scope="col" className="px-6 py-4 font-bold text-right">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-100 bg-transparent">
                        {activos.map((activo) => (
                            <tr key={activo.id} className="hover:bg-fnc-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100 shadow-sm">
                                            {getImageUrl(activo.imagen)
                                                ? <img className="h-12 w-12 object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                                : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-charcoal-800">
                                                <Link to={`/activos/${activo.id}`} className="hover:text-fnc-600 transition-colors">
                                                    {activo.marca} {activo.modelo}
                                                </Link>
                                            </div>
                                            <div className="text-sm text-charcoal-500 font-medium">
                                                P: <span className="text-charcoal-700">{activo.placa}</span> | AF: <span className="text-charcoal-700">{activo.activoFijo || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="text-charcoal-800 font-bold">{activo.categoria?.nombre}</div>
                                    <div className="text-xs text-charcoal-400 font-medium mt-0.5">SN: {activo.serial}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${getStatusBadge(activo.estado)}`}>
                                        {activo.estado?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-charcoal-600 font-medium whitespace-nowrap">
                                    {activo.ubicacion || (activo.asignaciones?.[0]?.funcionario?.ubicacion
                                        ? `${activo.asignaciones[0].funcionario.ubicacion}${activo.asignaciones[0].funcionario.piso ? ` - Piso ${activo.asignaciones[0].funcionario.piso}` : ''}`
                                        : <span className="text-charcoal-400 font-medium italic">Sin ubicación</span>)}
                                </td>
                                <td className="px-6 py-4 text-sm text-charcoal-800 font-bold whitespace-nowrap">
                                    {activo.asignaciones?.[0]?.funcionario?.nombre || <span className="text-charcoal-400 font-medium italic">Sin asignar</span>}
                                </td>
                                {canEdit && (
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onEdit(activo)}
                                            className="inline-flex items-center justify-center text-xs font-bold text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-4 py-2 transition-colors shadow-sm"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {activos.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-charcoal-400 font-medium">
                                    No se encontraron activos con los filtros actuales.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default ActivosTable;
