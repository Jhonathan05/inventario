import Select from 'react-select';

const SelectWithAdd = ({ label, name, value, onChange, options, onAdd, required, placeholder = 'Seleccione...', canAdd = true }) => {
    // Transformar opciones al formato de react-select
    const selectOptions = options.map(opt => ({
        value: opt.id || opt,
        label: opt.nombre || opt.valor || opt
    }));

    // Encontrar la opción seleccionada actualmente
    const selectedOption = selectOptions.find(opt => opt.value === value) || null;

    const customStyles = {
        control: (base) => ({
            ...base,
            minHeight: '38px',
            fontSize: '0.875rem',
            borderColor: '#d1d5db',
            borderRadius: '0.375rem',
            '&:hover': { borderColor: '#6366f1' },
            boxShadow: 'none',
        }),
        menu: (base) => ({
            ...base,
            fontSize: '0.875rem',
            zIndex: 10010
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 10010
        })
    };

    const handleSelectChange = (selected) => {
        const event = {
            target: {
                name,
                value: selected ? selected.value : ''
            }
        };
        onChange(event);
    };

    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Select
                        id={`select-${name}`}
                        instanceId={`select-${name}`}
                        name={name}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={selectOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={placeholder}
                        noOptionsMessage={() => "No hay opciones"}
                        styles={customStyles}
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                    />
                </div>
                {canAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        title={`Agregar nuevo ${label}`}
                        className="flex-none p-2 h-[38px] bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors self-end"
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
