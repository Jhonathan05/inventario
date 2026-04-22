import { Link } from 'react-router-dom';

/**
 * HistorialModal — Modal de historial completo de activos de un funcionario.
 */
const HistorialModal = ({
    show,
    onClose,
    funcionarios,
    filterFuncionario,
    historialData,
    historialLoading,
    onExportExcel,
    onExportPDF,
}) => {
    if (!show) return null;

    const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre;

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                    <div className="flex justify-between items-center mb-5 gap-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                            Historial Completo de Activos — {funcName}
                        </h3>
                        <div className="flex items-center gap-3 shrink-0">
                            {historialData.length > 0 && (
                                <>
                                    <button onClick={onExportExcel} className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-md mx-1 hover:bg-green-100 flex items-center shadow-sm border border-green-200">
                                        📊 Excel
                                    </button>
                                    <button onClick={onExportPDF} className="text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-md mx-1 hover:bg-red-100 flex items-center shadow-sm border border-red-200">
                                        📄 PDF
                                    </button>
                                </>
                            )}
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl font-bold ml-2 leading-none" title="Cerrar">&times;</button>
                        </div>
                    </div>

                    {historialLoading ? (
                        <p className="text-center text-gray-500 py-10">Cargando historial...</p>
                    ) : historialData.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">El funcionario no tiene un historial de activos registrado.</p>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto max-h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900">Fecha Inicio</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Fecha Fin / Devolución</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Movimiento</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Equipo</th>
                                        <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {historialData.map((asig) => (
                                        <tr key={asig.id} className={!asig.fechaFin ? 'bg-green-50/30' : ''}>
                                            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-900">
                                                {new Date(asig.fechaInicio).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 font-medium">
                                                {asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : <span className="text-green-600">Actual (Vigente)</span>}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    {asig.tipo}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                                                <Link to={`/activos/${asig.activoId}`} onClick={onClose} className="hover:text-indigo-600 underline">
                                                    {asig.activo?.marca} {asig.activo?.modelo}
                                                </Link>
                                                <br />
                                                <span className="text-xs text-gray-500">Placa: {asig.activo?.placa}</span>
                                            </td>
                                            <td className="px-3 py-3 text-sm text-gray-500 max-w-xs truncate" title={asig.observaciones}>
                                                {asig.observaciones || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}
                    <div className="mt-5 flex justify-end">
                        <button onClick={onClose} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorialModal;
