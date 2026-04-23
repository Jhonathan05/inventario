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
        if (sortBy !== field) return <ArrowsUpDownIcon className="h-3 w-3 ml-1.5 text-charcoal-300" />;
        return sortOrder === 'asc' 
            ? <ChevronUpIcon className="h-4 w-4 ml-1 text-fnc-600 stroke-[3]" /> 
            : <ChevronDownIcon className="h-4 w-4 ml-1 text-fnc-600 stroke-[3]" />;
    };

    return (
        <div className="hidden md:block">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <button onClick={() => onSort('activo')} className="flex items-center hover:text-fnc-600 transition-colors uppercase">
                                    Activo {renderSortIcon('activo')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <button onClick={() => onSort('categoria')} className="flex items-center hover:text-fnc-600 transition-colors uppercase">
                                    Categoría {renderSortIcon('categoria')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <button onClick={() => onSort('estado')} className="flex items-center hover:text-fnc-600 transition-colors uppercase">
                                    Estado {renderSortIcon('estado')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <button onClick={() => onSort('ubicacion')} className="flex items-center hover:text-fnc-600 transition-colors uppercase">
                                    Ubicación {renderSortIcon('ubicacion')}
                                </button>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <button onClick={() => onSort('funcionario')} className="flex items-center hover:text-fnc-600 transition-colors uppercase">
                                    Asignado A {renderSortIcon('funcionario')}
                                </button>
                            </th>
                            {canEdit && <th scope="col" className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acciones</th>}
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
                                <span className="text-charcoal-800 font-bold">{activo.categoria?.nombre}</span>
                                <div className="text-[10px] text-charcoal-500 font-medium uppercase tracking-tight">{activo.tipo?.replace(/_/g, ' ')}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ring-1 ring-inset ${getStatusBadge(activo.estado)}`}>
                                    {activo.estado?.replace(/_/g, ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-charcoal-800 font-bold">{activo.ubicacion?.empresa}</div>
                                <div className="text-xs text-charcoal-500 font-medium">{activo.ubicacion?.ciudad} · {activo.ubicacion?.sede}</div>
                            </td>
                            <td className="px-6 py-4">
                                {activo.funcionario ? (
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-lg bg-fnc-50 border border-fnc-100 text-fnc-700 flex items-center justify-center font-bold text-xs mr-3">
                                            {activo.funcionario.nombre?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm text-charcoal-800 font-bold">{activo.funcionario.nombre}</div>
                                            <div className="text-[10px] text-charcoal-500 font-medium uppercase tracking-wider">{activo.funcionario.area}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-charcoal-400 italic">No asignado</span>
                                )}
                            </td>
                            {canEdit && (
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onEdit(activo)}
                                        className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-3 py-1.5 transition-all shadow-sm"
                                    >
                                        <PencilSquareIcon className="w-3.5 h-3.5" />
                                        Editar
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
