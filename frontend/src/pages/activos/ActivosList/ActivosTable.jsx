import { Link } from 'react-router-dom';
import { getImageUrl, getAssetIconPath } from '../../../lib/utils';
import { 
    ChevronUpIcon, 
    ChevronDownIcon, 
    ArrowsUpDownIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-charcoal-400">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const getStatusBadge = (estado) => {
    const colors = {
        'DISPONIBLE': 'bg-green-500/10 text-green-600 border-green-500/20',
        'ASIGNADO': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'EN_MANTENIMIENTO': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        'DADO_DE_BAJA': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    };
    return colors[estado] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
};

/**
 * ActivosTable — Tabla para vistas escritorio (hidden en móvil).
 */
const ActivosTable = ({ activos, canEdit, onEdit, sortBy, sortOrder, onSort }) => {
    const renderSortIcon = (field) => {
        if (sortBy !== field) return <ArrowsUpDownIcon className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-charcoal-400" />;
        return sortOrder === 'asc' 
            ? <ChevronUpIcon className="h-3 w-3 ml-2 text-fnc-600" /> 
            : <ChevronDownIcon className="h-3 w-3 ml-2 text-fnc-600" />;
    };

    return (
        <div className="hidden md:block">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-transparent">
                        <tr className="border-b border-gray-100">
                            <th scope="col" className="px-6 py-5 text-left">
                                <button onClick={() => onSort('activo')} className="group flex items-center text-[11px] font-semibold text-charcoal-400 capitalize hover:text-charcoal-700 transition-colors">
                                    Activo {renderSortIcon('activo')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-5 text-left">
                                <button onClick={() => onSort('categoria')} className="group flex items-center text-[11px] font-semibold text-charcoal-400 capitalize hover:text-charcoal-700 transition-colors">
                                    Categoría {renderSortIcon('categoria')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-5 text-left">
                                <button onClick={() => onSort('estado')} className="group flex items-center text-[11px] font-semibold text-charcoal-400 capitalize hover:text-charcoal-700 transition-colors">
                                    Estado {renderSortIcon('estado')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-5 text-left">
                                <button onClick={() => onSort('ubicacion')} className="group flex items-center text-[11px] font-semibold text-charcoal-400 capitalize hover:text-charcoal-700 transition-colors">
                                    Ubicación {renderSortIcon('ubicacion')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-5 text-left">
                                <button onClick={() => onSort('funcionario')} className="group flex items-center text-[11px] font-semibold text-charcoal-400 capitalize hover:text-charcoal-700 transition-colors">
                                    Asignado {renderSortIcon('funcionario')}
                                </button>
                            </th>
                            {canEdit && <th scope="col" className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                    {activos.map((activo) => (
                        <tr key={activo.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-6 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-50 border border-gray-100/50 shadow-sm transition-transform group-hover:scale-105">
                                        {getImageUrl(activo.imagen)
                                            ? <img className="h-10 w-10 object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                            : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-charcoal-800 text-[13px] capitalize tracking-tight">
                                            <Link to={`/activos/${activo.id}`} className="hover:text-fnc-600 transition-colors">
                                                {activo.marca?.toLowerCase()} {activo.modelo?.toLowerCase()}
                                            </Link>
                                        </div>
                                        <div className="text-[11px] text-charcoal-400 font-medium font-mono mt-0.5">
                                            {activo.placa} <span className="mx-1 opacity-30">·</span> {activo.activoFijo || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="text-[12px] text-charcoal-700 font-semibold capitalize tracking-tight">{activo.categoria?.nombre?.toLowerCase()}</div>
                                <div className="text-[11px] text-charcoal-400 font-medium capitalize mt-0.5 opacity-80">{activo.tipo?.replace(/_/g, ' ')?.toLowerCase()}</div>
                            </td>
                            <td className="px-6 py-6">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${getStatusBadge(activo.estado)}`}>
                                    {activo.estado?.replace(/_/g, ' ')?.toLowerCase()}
                                </span>
                            </td>
                            <td className="px-6 py-6">
                                <div className="text-[12px] text-charcoal-700 font-semibold capitalize tracking-tight">{activo.ubicacion?.empresa?.toLowerCase()}</div>
                                <div className="text-[11px] text-charcoal-400 font-medium capitalize mt-0.5 opacity-80">{activo.ubicacion?.sede?.toLowerCase()}</div>
                            </td>
                            <td className="px-6 py-6">
                                {activo.funcionario ? (
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-fnc-50 border border-fnc-100 text-fnc-700 flex items-center justify-center font-bold text-[11px] mr-3">
                                            {activo.funcionario.nombre?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-[12px] text-charcoal-700 font-semibold capitalize tracking-tight">{activo.funcionario.nombre?.toLowerCase()}</div>
                                            <div className="text-[11px] text-charcoal-400 font-medium capitalize mt-0.5 opacity-80">{activo.funcionario.area?.toLowerCase()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[12px] text-charcoal-300 italic font-medium">No asignado</span>
                                )}
                            </td>
                            {canEdit && (
                                <td className="px-6 py-6 text-right">
                                    <button
                                        onClick={() => onEdit(activo)}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-charcoal-300 hover:text-fnc-600 hover:bg-fnc-50 transition-all border border-transparent hover:border-fnc-100 shadow-none hover:shadow-sm"
                                        title="Editar Activo"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {activos.length === 0 && (
                        <tr>
                            <td colSpan="6" className="px-6 py-12 text-center text-charcoal-400 font-medium">
                                No se encontraron activos.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivosTable;
