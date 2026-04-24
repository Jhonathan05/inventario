import React from 'react';
import Select from 'react-select';

const SelectWithAdd = ({ label, name, value, onChange, options, onAdd, required, placeholder = 'Seleccione...', canAdd = true, className = "" }) => {
    // Transformar opciones al formato de react-select
    const selectOptions = options.map(opt => ({
        value: opt.id || opt,
        label: (opt.nombre || opt.valor || opt).toString().toUpperCase()
    }));

    // Encontrar la opción seleccionada actualmente
    const selectedOption = selectOptions.find(opt => String(opt.value) === String(value)) || null;

    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#f3f4f699', // bg-gray-100/60
            border: '1.5px solid transparent',
            borderRadius: '9999px', // rounded-full
            padding: '0 12px', // Compact padding
            fontSize: '11px',
            fontWeight: '700',
            color: '#1f2937', 
            boxShadow: 'none',
            '&:hover': { borderColor: '#e5e7eb' }, 
            borderColor: state.isFocused ? '#8d1024' : 'transparent',
            minHeight: '36px',
            height: '36px',
            transition: 'all 0.15s ease',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 4px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
            fontWeight: '700',
            textTransform: 'uppercase',
            fontSize: '9px',
            letterSpacing: '0.05em'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#374151',
            textTransform: 'uppercase'
        }),
        menu: (base) => ({
            ...base,
            fontSize: '11px',
            fontWeight: '700',
            borderRadius: '1.2rem',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            zIndex: 10010,
            padding: '4px',
            marginTop: '4px'
        }),
        option: (base, state) => ({
            ...base,
            borderRadius: '0.8rem',
            margin: '1px 0',
            padding: '6px 12px',
            backgroundColor: state.isSelected ? '#8d1024' : state.isFocused ? '#f3f4f6' : 'transparent',
            color: state.isSelected ? '#ffffff' : '#374151',
            cursor: 'pointer',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 10010
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#9ca3af',
            padding: '4px',
            '&:hover': { color: '#8d1024' }
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#9ca3af',
            padding: '4px',
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
        <div className={className}>
            {label && (
                <label className="block text-[9px] font-extrabold text-charcoal-400 uppercase tracking-widest ml-4 opacity-70 mb-1">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}
            <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                    <Select
                        id={`select-${name}`}
                        instanceId={`select-${name}`}
                        name={name}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={selectOptions}
                        isSearchable={true}
                        isClearable={true}
                        placeholder={placeholder.toUpperCase()}
                        noOptionsMessage={() => "SIN RESULTADOS"}
                        styles={customStyles}
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                    />
                </div>
                {canAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="flex-none w-9 h-9 bg-white border border-gray-100 text-charcoal-400 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm flex items-center justify-center shrink-0"
                        title={`AGREGAR ${label?.toUpperCase()}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SelectWithAdd;
