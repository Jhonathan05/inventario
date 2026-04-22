export const ReportPreview = ({ 
    previewData, 
    selectedColumns, 
    loading, 
    selectedPerfil 
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-12 text-center">
                <div className="text-2xl mb-2">⏳</div>
                <p className="text-gray-500">Generando reporte...</p>
            </div>
        );
    }

    if (previewData.length === 0) {
        return null; // Parent handles empty state when not generating
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                    Vista Previa — {previewData.length} registros, {selectedColumns.length} columnas
                    {selectedPerfil && <span className="text-indigo-600 ml-2">({selectedPerfil.nombre})</span>}
                </h3>
            </div>
            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc #f3f4f6' }}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                            {selectedColumns.map(col => (
                                <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {previewData.slice(0, 100).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                                {selectedColumns.map(col => (
                                    <td key={col.key} className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap max-w-xs truncate">
                                        {row[col.label] ?? ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {previewData.length > 100 && (
                <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs border-t">
                    Mostrando 100 de {previewData.length} registros. Excel incluirá todos.
                </div>
            )}
        </div>
    );
};
