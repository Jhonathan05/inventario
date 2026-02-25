const SelectWithAdd = ({ label, name, value, onChange, options, onAdd, required, placeholder = 'Seleccione...', canAdd = true }) => {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm p-2 bg-white"
                >
                    <option value="">{placeholder}</option>
                    {options.map(opt => (
                        <option key={opt.id || opt} value={opt.id || opt}>
                            {opt.nombre || opt.valor || opt}
                        </option>
                    ))}
                </select>
                {canAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        title={`Agregar nuevo ${label}`}
                        className="flex-none p-2 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SelectWithAdd;
