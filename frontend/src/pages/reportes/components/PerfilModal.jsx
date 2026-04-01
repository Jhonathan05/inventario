export const PerfilModal = ({ 
    show, 
    onClose, 
    editingPerfil, 
    perfilForm, 
    setPerfilForm, 
    perfilError, 
    onSave, 
    selectedColumnsCount 
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 z-[10001] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editingPerfil ? 'Editar Perfil' : 'Nuevo Perfil de Orden'}
                    </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input type="text" value={perfilForm.nombre}
                            onChange={e => setPerfilForm(p => ({ ...p, nombre: e.target.value }))}
                            placeholder="Ej: CMDB USUARIO FINAL"
                            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea value={perfilForm.descripcion}
                            onChange={e => setPerfilForm(p => ({ ...p, descripcion: e.target.value }))}
                            placeholder="Descripción opcional del perfil..."
                            rows={2}
                            className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-3"
                        />
                    </div>
                    {!editingPerfil && (
                        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                            💡 Las <strong>{selectedColumnsCount} columnas seleccionadas</strong> actualmente
                            se guardarán con su orden en este perfil.
                        </div>
                    )}
                    {perfilError && (
                        <p className="text-sm text-red-600">{perfilError}</p>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button onClick={onSave}
                        disabled={!perfilForm.nombre.trim()}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                        {editingPerfil ? 'Guardar Cambios' : 'Crear Perfil'}
                    </button>
                </div>
            </div>
        </div>
    );
};
