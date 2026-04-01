export const ReportColumns = ({ 
    columns, 
    groups, 
    selectedColumns, 
    toggleColumn, 
    selectAll, 
    selectNone, 
    selectDefaults, 
    moveColumn 
}) => {
    return (
        <div className="space-y-4">
            {/* ORDEN DE COLUMNAS */}
            {selectedColumns.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        ↕️ Orden de Columnas ({selectedColumns.length})
                    </h3>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                        {selectedColumns.map((col, idx) => (
                            <div key={col.key} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1.5 text-sm">
                                <span className="text-gray-700 truncate flex-1">
                                    <span className="text-gray-400 text-xs mr-1">{idx + 1}.</span>
                                    {col.label}
                                </span>
                                <div className="flex gap-0.5 ml-2 flex-shrink-0">
                                    <button onClick={() => moveColumn(idx, -1)} disabled={idx === 0}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1.5 py-0.5 hover:bg-gray-200 rounded">▲</button>
                                    <button onClick={() => moveColumn(idx, 1)} disabled={idx === selectedColumns.length - 1}
                                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1.5 py-0.5 hover:bg-gray-200 rounded">▼</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SELECTOR DE COLUMNAS */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">☑️ Columnas ({selectedColumns.length}/{columns.length})</h3>
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                    <button onClick={selectAll} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Todas</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={selectNone} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Ninguna</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={selectDefaults} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Por defecto</button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {Object.entries(groups).map(([groupName, groupCols]) => (
                        <div key={groupName}>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{groupName}</h4>
                            <div className="space-y-1">
                                {groupCols.map(col => (
                                    <label key={col.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
                                        <input type="checkbox" checked={col.selected} onChange={() => toggleColumn(col.key)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 h-3.5 w-3.5" />
                                        <span className="text-sm text-gray-700">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
