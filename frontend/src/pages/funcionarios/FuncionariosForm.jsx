import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import SelectWithAdd from '../../components/SelectWithAdd';
import CatalogModal from '../../components/CatalogModal';

const DEFAULT_STATE = {
    nombre: '',
    shortname: '',
    cedula: '',
    codigoPersonal: '',
    cargo: '',
    area: '',
    email: '',
    telefono: '',
    activo: true,
    vinculacion: '',
    empresaFuncionario: '',
    proyecto: '',
    departamento: 'TOLIMA',
    ciudad: '',
    seccional: '',
    municipio: '',
    ubicacion: '',
    piso: ''
};

// Sub-components moved outside to avoid re-renders and focus loss
const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <span className="text-xl">{icon}</span>
        <h4 className="text-md font-bold text-gray-800 uppercase tracking-tight">{title}</h4>
    </div>
);

const Field = ({ label, id, children, required }) => (
    <div className="flex flex-col">
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase mb-1 cursor-pointer">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const FuncionariosForm = ({ open, onClose, funcionario }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Visibility states
    const [showLaboral, setShowLaboral] = useState(false);
    const [showUbicacion, setShowUbicacion] = useState(false);

    // Catalog Modal State
    const [activeModal, setActiveModal] = useState({ open: false, domain: '', title: '' });

    const { data: rawOptions = { areas: [], cargos: [], ciudades: [], seccionales: [] } } = useQuery({
        queryKey: ['funcionarios', 'options'],
        queryFn: funcionariosService.getOptions
    });

    const options = {
        areas: sortList(rawOptions.areas || []),
        cargos: sortList(rawOptions.cargos || []),
        ciudades: sortList(rawOptions.ciudades || []),
        seccionales: sortList(rawOptions.seccionales || [])
    };

    useEffect(() => {
        if (funcionario) {
            setFormData({
                nombre: funcionario.nombre || '',
                shortname: funcionario.shortname || '',
                cedula: funcionario.cedula || '',
                codigoPersonal: funcionario.codigoPersonal || '',
                cargo: funcionario.cargo || '',
                area: funcionario.area || '',
                email: funcionario.email || '',
                telefono: funcionario.telefono || '',
                activo: funcionario.activo ?? true,
                vinculacion: funcionario.vinculacion || '',
                empresaFuncionario: funcionario.empresaFuncionario || '',
                proyecto: funcionario.proyecto || '',
                departamento: funcionario.departamento || 'TOLIMA',
                ciudad: funcionario.ciudad || '',
                seccional: funcionario.seccional || '',
                municipio: funcionario.municipio || '',
                ubicacion: funcionario.ubicacion || '',
                piso: funcionario.piso || ''
            });
            // Inteligencia: Expandir secciones si tienen datos
            if (funcionario.cargo || funcionario.area || funcionario.vinculacion) setShowLaboral(true);
            if (funcionario.ciudad || funcionario.seccional || funcionario.municipio) setShowUbicacion(true);
        } else {
            setFormData(DEFAULT_STATE);
            setShowLaboral(false);
            setShowUbicacion(false);
        }
    }, [funcionario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (type !== 'checkbox') {
            if (name === 'email') {
                newValue = value.toLowerCase();
            } else if (['cedula', 'telefono', 'codigoPersonal'].includes(name)) {
                newValue = value;
            } else {
                newValue = value.toUpperCase();
            }
        }

        setFormData(prev => {
            const next = { ...prev, [name]: newValue };

            // Lógica de sincronización de Ciudad -> Municipio y Ubicación
            if (name === 'ciudad') {
                if (!prev.municipio || prev.municipio === prev.ciudad) {
                    next.municipio = newValue;
                }
                if (!prev.ubicacion || prev.ubicacion === prev.ciudad) {
                    next.ubicacion = newValue;
                }
            }

            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos obligatorios
        const requiredFields = [
            { key: 'nombre', label: 'Nombre Completo' },
            { key: 'cedula', label: 'Cédula' },
            { key: 'email', label: 'Email' },
            { key: 'cargo', label: 'Cargo' },
            { key: 'departamento', label: 'Departamento' },
            { key: 'ciudad', label: 'Ciudad' },
            { key: 'seccional', label: 'Seccional' },
            { key: 'municipio', label: 'Municipio' },
            { key: 'ubicacion', label: 'Ubicación' }
        ];

        const missing = requiredFields.filter(f => !formData[f.key]);
        if (missing.length > 0) {
            setError(`Los siguientes campos son obligatorios: ${missing.map(f => f.label).join(', ')}`);

            if (missing.some(f => ['cargo'].includes(f.key))) setShowLaboral(true);
            if (missing.some(f => ['departamento', 'ciudad', 'seccional', 'municipio', 'ubicacion'].includes(f.key))) setShowUbicacion(true);

            const modalElement = e.target.closest('.overflow-y-auto');
            if (modalElement) modalElement.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError('');

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setError('Por favor ingrese un correo electrónico válido');
            setLoading(false);
            return;
        }

        try {
            if (funcionario) {
                await funcionariosService.update(funcionario.id, formData);
            } else {
                await funcionariosService.create(formData);
            }
            queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
            queryClient.invalidateQueries({ queryKey: ['activos'] }); // sync denormalized data
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar funcionario');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCatalogModal = (domain, title) => {
        setActiveModal({ open: true, domain, title });
    };

    const handleCatalogSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['funcionarios', 'options'] });
    };

    if (!open) return null;

    const inputCls = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white uppercase";
    const emailCls = inputCls.replace('uppercase', 'lowercase');

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6 w-full max-h-[95vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 border-b pb-4">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <span className="bg-indigo-600 text-white p-1 rounded">👤</span>
                            {funcionario ? 'EDITAR FUNCIONARIO' : 'NUEVO FUNCIONARIO'}
                        </h3>
                        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                            <p className="font-bold">Error de validación</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <SectionHeader title="Información Personal y Contacto" icon="📋" />
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Field label="Nombre Completo" id="nombre" required>
                                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputCls} placeholder="EJ. JUAN PEREZ" autoComplete="name" />
                                </Field>
                                <Field label="Alias / Nombre Corto" id="shortname">
                                    <input type="text" id="shortname" name="shortname" value={formData.shortname} onChange={handleChange} className={inputCls} placeholder="EJ. JPEREZ" autoComplete="username" />
                                </Field>
                                <Field label="Cédula" id="cedula" required>
                                    <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} className={inputCls} autoComplete="off" />
                                </Field>
                                <Field label="Email (Corporativo)" id="email" required>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={emailCls} placeholder="ejemplo@empresa.com" autoComplete="email" />
                                </Field>
                                <Field label="Teléfono de Contacto" id="telefono">
                                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className={inputCls} autoComplete="tel" />
                                </Field>
                                <div className="flex items-end pb-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        <span className="ml-3 text-sm font-bold text-gray-700 uppercase">Funcionario Activo</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: INFORMACIÓN LABORAL */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                                <SectionHeader title="Información Laboral Corporativa" icon="🏢" />
                                <button 
                                    type="button" 
                                    onClick={() => setShowLaboral(!showLaboral)}
                                    className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-sm"
                                >
                                    {showLaboral ? '▲ CONTRAER' : '▼ EXPANDIR'}
                                </button>
                            </div>
                            {showLaboral && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                                    <Field label="Cód. Personal (Interno)" id="codigoPersonal">
                                        <input type="text" id="codigoPersonal" name="codigoPersonal" value={formData.codigoPersonal} onChange={handleChange} className={inputCls} autoComplete="off" />
                                    </Field>
                                    <SelectWithAdd
                                        label="Vinculación"
                                        name="vinculacion"
                                        value={formData.vinculacion}
                                        onChange={handleChange}
                                        options={sortList(['EMPLEADO', 'CONTRATISTA', 'EXTERNO', 'PASANTE'])}
                                    />
                                    <SelectWithAdd
                                        label="Cargo"
                                        name="cargo"
                                        required
                                        value={formData.cargo}
                                        onChange={handleChange}
                                        options={options.cargos}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('CARGO', 'Nuevo Cargo')}
                                    />
                                    <SelectWithAdd
                                        label="Área / Dependencia"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        options={options.areas}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('AREA', 'Nueva Área')}
                                    />
                                    <Field label="Empresa (Tercero)" id="empresaFuncionario">
                                        <input type="text" id="empresaFuncionario" name="empresaFuncionario" value={formData.empresaFuncionario} onChange={handleChange} className={inputCls} autoComplete="organization" />
                                    </Field>
                                    <Field label="Proyecto / Centro de Costos" id="proyecto">
                                        <input type="text" id="proyecto" name="proyecto" value={formData.proyecto} onChange={handleChange} className={inputCls} autoComplete="off" />
                                    </Field>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 3: UBICACIÓN */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
                                <SectionHeader title="Ubicación y Sede" icon="📍" />
                                <button 
                                    type="button" 
                                    onClick={() => setShowUbicacion(!showUbicacion)}
                                    className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-sm"
                                >
                                    {showUbicacion ? '▲ CONTRAER' : '▼ EXPANDIR'}
                                </button>
                            </div>
                            {showUbicacion && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                                    <Field label="Departamento" id="departamento" required>
                                        <input type="text" id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} className={inputCls} autoComplete="address-level1" />
                                    </Field>
                                    <SelectWithAdd
                                        label="Ciudad / Municipio"
                                        name="ciudad"
                                        required
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        options={options.ciudades}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('CIUDAD', 'Nueva Ciudad')}
                                    />
                                    <SelectWithAdd
                                        label="Seccional / Oficina Principal"
                                        name="seccional"
                                        required
                                        value={formData.seccional}
                                        onChange={handleChange}
                                        options={options.seccionales}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('SECCIONAL', 'Nueva Seccional')}
                                    />
                                    <Field label="Municipio Específico" id="municipio" required>
                                        <input type="text" id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} className={inputCls} autoComplete="address-level2" />
                                    </Field>
                                    <Field label="Ubicación / Sede Fija" id="ubicacion" required>
                                        <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className={inputCls} autoComplete="street-address" />
                                    </Field>
                                    <Field label="Piso / Oficina / Puesto" id="piso">
                                        <input type="text" id="piso" name="piso" value={formData.piso} onChange={handleChange} className={inputCls} autoComplete="off" />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 justify-end pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                            >
                                CANCELAR
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 text-sm font-black text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading ? 'GUARDANDO...' : (
                                    <>
                                        <span>✓</span>
                                        <span>GUARDAR FUNCIONARIO</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <CatalogModal 
                open={activeModal.open} 
                onClose={() => setActiveModal(prev => ({ ...prev, open: false }))}
                domain={activeModal.domain} 
                title={activeModal.title}
                onSaveSuccess={handleCatalogSuccess}
            /> 
        </div>
    );
};

export default FuncionariosForm;

