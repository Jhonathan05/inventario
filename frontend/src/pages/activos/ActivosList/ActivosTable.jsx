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
const ActivosTable = ({ activos, canEdit, onEdit, sortBy, sortOrder, onSort }) => {
    const renderSortIcon = (field) => {
        if (sortBy !== field) return (
            <svg className="h-3 w-3 ml-1 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        );
        return sortOrder === 'asc' ? (
            <svg className="h-4 w-4 ml-1 text-fnc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="h-4 w-4 ml-1 text-fnc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <div className="mt-6 hidden md:block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => onSort('activo')} className="flex items-center font-black hover:text-fnc-600 transition-colors uppercase">
                                        Activo {renderSortIcon('activo')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => onSort('categoria')} className="flex items-center font-black hover:text-fnc-600 transition-colors uppercase">
                                        Categoría {renderSortIcon('categoria')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => onSort('estado')} className="flex items-center font-black hover:text-fnc-600 transition-colors uppercase">
                                        Estado {renderSortIcon('estado')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => onSort('ubicacion')} className="flex items-center font-black hover:text-fnc-600 transition-colors uppercase">
                                        Ubicación {renderSortIcon('ubicacion')}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <button onClick={() => onSort('funcionario')} className="flex items-center font-black hover:text-fnc-600 transition-colors uppercase">
                                        Asignado A {renderSortIcon('funcionario')}
                                    </button>
                                </th>
                                {canEdit && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {activos.map((activo) => (
                            <tr key={activo.id} className="hover:bg-gray-50 transition-colors">
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
};

export default ActivosTable;
