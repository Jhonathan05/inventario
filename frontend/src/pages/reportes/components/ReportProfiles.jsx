export const ReportProfiles = ({ 
    perfiles, 
    selectedPerfil, 
    applyPerfil, 
    handleEditPerfil, 
    handleUpdatePerfilColumns, 
    handleDeletePerfil, 
    selectedColumns, 
    onNewPerfil
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">📁 Perfiles de Orden</h3>
                <button onClick={onNewPerfil}
                    className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-md font-medium transition-colors">
                    + Nuevo
                </button>
            </div>
            {perfiles.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay perfiles para este reporte</p>
            ) : (
                <div className="space-y-2">
                    {perfiles.map(perfil => (
                        <div key={perfil.id}
                            className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all ${selectedPerfil?.id === perfil.id
                                ? 'bg-indigo-50 ring-2 ring-indigo-400'
                                : 'bg-gray-50 hover:bg-gray-100 ring-1 ring-gray-200'
                                }`}
                            onClick={() => applyPerfil(perfil)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    {perfil.esPredefinido && <span className="text-xs">⭐</span>}
                                    <span className="text-sm font-medium text-gray-800 truncate">{perfil.nombre}</span>
                                </div>
                                {perfil.descripcion && (
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{perfil.descripcion}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">{perfil.columnas?.length || 0} columnas</p>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                <button onClick={() => handleEditPerfil(perfil)} title="Editar nombre"
                                    className="text-gray-400 hover:text-indigo-600 p-1 text-xs">✏️</button>
                                {selectedPerfil?.id === perfil.id && selectedColumns.length > 0 && (
                                    <button onClick={() => handleUpdatePerfilColumns(perfil)} title="Guardar columnas actuales en este perfil"
                                        className="text-gray-400 hover:text-green-600 p-1 text-xs">💾</button>
                                )}
                                {!perfil.esPredefinido && (
                                    <button onClick={() => handleDeletePerfil(perfil)} title="Eliminar"
                                        className="text-gray-400 hover:text-red-600 p-1 text-xs">🗑️</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
