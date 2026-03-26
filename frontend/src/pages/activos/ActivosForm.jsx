import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import SelectWithAdd from '../../components/SelectWithAdd';
import CatalogModal from '../../components/CatalogModal';

const DEFAULT_STATE = {
    // Admin
    empresaPropietaria: 'FEDERACION',
    dependencia: 'SUCURSAL IBAGUE',
    fuenteRecurso: '',
    tipoRecurso: '',
    tipoControl: 'CONTROLADO',
    estadoOperativo: 'EN OPERACIÓN',
    razonEstado: 'DISPONIBLE',
    // Funcionario
    empresaFuncionario: 'FEDERACION',
    tipoPersonal: '',
    cedulaFuncionario: '',
    shortname: '',
    nombreFuncionario: '',
    departamento: 'TOLIMA',
    ciudad: 'IBAGUE',
    cargo: '',
    area: '',
    ubicacion: '',
    // Equipo
    tipo: '',
    placa: '',
    serial: '',
    activoFijo: '',
    marca: '',
    modelo: '',
    nombreEquipo: '',
    procesador: '',
    memoriaRam: '',
    discoDuro: '',
    sistemaOperativo: '',
    // Compra
    fechaCompra: '',
    garantiaHasta: '',
    valorCompra: '',
    observaciones: '',
    categoriaId: '',
    estado: 'DISPONIBLE',
};

// Reusable components
const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-100">
        <span className="text-lg">{icon}</span>
        <h4 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{title}</h4>
    </div>
);

// Reusable Field component remains for non-dropdown fields
const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);

const inputCls = "block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm p-2";
const selectCls = `${inputCls} bg-white`;

const calcYearsOfUse = (fechaCompraStr) => {
    if (!fechaCompraStr) return null;
    const compra = new Date(fechaCompraStr);
    const now = new Date();
    const diff = now - compra;
    if (diff < 0) return null;
    const years = (diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
    return `${years} años`;
};

const ActivosForm = ({ open, onClose, activo }) => {
    const { user } = useAuth();
    const canEditCatalogs = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Catalog states
    const [catalogs, setCatalogs] = useState({
        EMPRESA_PROPIETARIA: [],
        FUENTE_RECURSO: [],
        TIPO_RECURSO: [],
        TIPO_CONTROL: [],
        ESTADO_OPERATIVO: [],
        RAZON_ESTADO: [],
        EMPRESA_FUNCIONARIO: [],
        TIPO_PERSONAL: [],
        CARGO: [],
        TIPO_EQUIPO: [],
        MARCA: [],
        MODELO: [],
        PROCESADOR: [],
        MEMORIA_RAM: [],
        DISCO_DURO: [],
        SISTEMA_OPERATIVO: [],
    });

    // Modal state for adding new options
    const [activeModal, setActiveModal] = useState({ open: false, domain: '', title: '', isCategory: false });

    // Visibility states
    const [showFuncionario, setShowFuncionario] = useState(false);
    const [showCompraGarantia, setShowCompraGarantia] = useState(false);

    useEffect(() => {
        fetchCategorias();
        fetchAllCatalogs();
    }, []);

    const sortList = (list) => {
        return [...list].sort((a, b) => {
            const valA = (a.nombre || a.valor || a).toString().toUpperCase();
            const valB = (b.nombre || b.valor || b).toString().toUpperCase();
            return valA.localeCompare(valB);
        });
    };

    const fetchAllCatalogs = async () => {
        try {
            const res = await api.get('/catalogos');
            const grouped = res.data.reduce((acc, item) => {
                if (!acc[item.dominio]) acc[item.dominio] = [];
                acc[item.dominio].push(item.valor);
                return acc;
            }, {});

            // Sort all catalog lists
            const sortedGrouped = {};
            Object.keys(grouped).forEach(domain => {
                sortedGrouped[domain] = sortList(grouped[domain]);
            });

            setCatalogs(prev => ({ ...prev, ...sortedGrouped }));
        } catch (err) {
            console.error('Error fetching catalogs:', err);
        }
    };

    const handleOpenCatalogModal = (domain, title, isCategory = false) => {
        setActiveModal({ open: true, domain, title, isCategory });
    };

    const handleCatalogSuccess = (newVal) => {
        if (activeModal.isCategory) {
            setCategorias(prev => sortList([...prev, newVal]));
            setFormData(prev => ({ 
                ...prev, 
                categoriaId: newVal.id,
                tipo: newVal.nombre || newVal.valor || prev.tipo
            }));
        } else {
            const val = newVal.valor;
            setCatalogs(prev => ({
                ...prev,
                [activeModal.domain]: sortList([...prev[activeModal.domain], val])
            }));
            const fieldName = getFieldNameByDomain(activeModal.domain);
            if (fieldName) {
                setFormData(prev => ({ ...prev, [fieldName]: val }));
            }
        }
    };

    const getFieldNameByDomain = (domain) => {
        const mapping = {
            EMPRESA_PROPIETARIA: 'empresaPropietaria',
            FUENTE_RECURSO: 'fuenteRecurso',
            TIPO_RECURSO: 'tipoRecurso',
            TIPO_CONTROL: 'tipoControl',
            ESTADO_OPERATIVO: 'estadoOperativo',
            RAZON_ESTADO: 'razonEstado',
            EMPRESA_FUNCIONARIO: 'empresaFuncionario',
            TIPO_PERSONAL: 'tipoPersonal',
            CARGO: 'cargo',
            TIPO_EQUIPO: 'tipo',
            PROCESADOR: 'procesador',
            MEMORIA_RAM: 'memoriaRam',
            DISCO_DURO: 'discoDuro',
            SISTEMA_OPERATIVO: 'sistemaOperativo',
        };
        return mapping[domain];
    };

    useEffect(() => {
        if (activo) {
            setFormData({
                ...DEFAULT_STATE,
                empresaPropietaria: activo.empresaPropietaria || 'FEDERACION',
                dependencia: activo.dependencia || 'SUCURSAL IBAGUE',
                fuenteRecurso: activo.fuenteRecurso || '',
                tipoRecurso: activo.tipoRecurso || '',
                tipoControl: activo.tipoControl || 'CONTROLADO',
                estadoOperativo: activo.estadoOperativo || 'EN OPERACIÓN',
                razonEstado: activo.razonEstado || 'DISPONIBLE',
                empresaFuncionario: activo.empresaFuncionario || 'FEDERACION',
                tipoPersonal: activo.tipoPersonal || '',
                cedulaFuncionario: activo.cedulaFuncionario || '',
                shortname: activo.shortname || '',
                nombreFuncionario: activo.nombreFuncionario || '',
                departamento: activo.departamento || 'TOLIMA',
                ciudad: activo.ciudad || 'IBAGUE',
                cargo: activo.cargo || '',
                area: activo.area || '',
                ubicacion: activo.ubicacion || '',
                tipo: activo.tipo || '',
                placa: activo.placa || '',
                serial: activo.serial || '',
                activoFijo: activo.activoFijo || '',
                marca: activo.marca || '',
                modelo: activo.modelo || '',
                nombreEquipo: activo.nombreEquipo || '',
                procesador: activo.procesador || '',
                memoriaRam: activo.memoriaRam || '',
                discoDuro: activo.discoDuro || '',
                sistemaOperativo: activo.sistemaOperativo || '',
                fechaCompra: activo.fechaCompra ? activo.fechaCompra.split('T')[0] : '',
                garantiaHasta: activo.garantiaHasta ? activo.garantiaHasta.split('T')[0] : '',
                valorCompra: activo.valorCompra || '',
                observaciones: activo.observaciones || '',
                categoriaId: activo.categoriaId || '',
                estado: activo.estado || 'DISPONIBLE',
            });
        } else {
            setFormData(DEFAULT_STATE);
            setImagen(null);
            setPreview(null);
        }
    }, [activo]);

    const fetchCategorias = async () => {
        try {
            const res = await api.get('/categorias');
            setCategorias(sortList(res.data));
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            
            // Sincronización Categoría -> Tipo de Equipo
            if (name === 'categoriaId') {
                const selectedCat = categorias.find(c => String(c.id) === String(value));
                if (selectedCat) {
                    next.tipo = selectedCat.nombre || selectedCat.valor || '';
                }
            }
            
            return next;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación explícita de campos obligatorios
        const requiredFields = [
            { key: 'tipo', label: 'Tipo de Equipo' },
            { key: 'serial', label: 'Serial' },
            { key: 'placa', label: 'Placa' },
            { key: 'marca', label: 'Marca' },
            { key: 'modelo', label: 'Modelo' }
        ];

        const missing = requiredFields.filter(f => !formData[f.key]);
        if (missing.length > 0) {
            setError(`Los siguientes campos son obligatorios: ${missing.map(f => f.label).join(', ')}`);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });
            if (imagen) data.append('imagen', imagen);

            if (activo) {
                await api.put(`/activos/${activo.id}`, data);
            } else {
                await api.post('/activos', data);
            }
            onClose(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar activo');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const tiempoUso = calcYearsOfUse(formData.fechaCompra);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>

                <div className="relative inline-block align-top bg-white rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:w-full sm:max-w-5xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            {activo ? '✏️ Editar Activo' : '➕ Nuevo Activo'}
                        </h3>
                        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* SECCIÓN 1: ADMINISTRACIÓN */}
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <SectionHeader title="Administración del Equipo" icon="🏢" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <SelectWithAdd
                                    label="Empresa Propietaria"
                                    name="empresaPropietaria"
                                    value={formData.empresaPropietaria}
                                    onChange={handleChange}
                                    options={catalogs.EMPRESA_PROPIETARIA}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('EMPRESA_PROPIETARIA', 'Empresa Propietaria')}
                                />
                                <Field label="Dependencia">
                                    <input type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} className={inputCls} />
                                </Field>
                                <SelectWithAdd
                                    label="Fuente de Recurso"
                                    name="fuenteRecurso"
                                    value={formData.fuenteRecurso}
                                    onChange={handleChange}
                                    options={catalogs.FUENTE_RECURSO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('FUENTE_RECURSO', 'Fuente de Recurso')}
                                />
                                <SelectWithAdd
                                    label="Tipo de Recurso"
                                    name="tipoRecurso"
                                    value={formData.tipoRecurso}
                                    onChange={handleChange}
                                    options={catalogs.TIPO_RECURSO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('TIPO_RECURSO', 'Tipo de Recurso')}
                                />
                                <SelectWithAdd
                                    label="Administrado / Controlado"
                                    name="tipoControl"
                                    value={formData.tipoControl}
                                    onChange={handleChange}
                                    options={catalogs.TIPO_CONTROL}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('TIPO_CONTROL', 'Tipo de Control')}
                                />
                                <SelectWithAdd
                                    label="Estado Operativo"
                                    name="estadoOperativo"
                                    value={formData.estadoOperativo}
                                    onChange={handleChange}
                                    options={catalogs.ESTADO_OPERATIVO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('ESTADO_OPERATIVO', 'Estado Operativo')}
                                />
                                <SelectWithAdd
                                    label="Razón del Estado"
                                    name="razonEstado"
                                    value={formData.razonEstado}
                                    onChange={handleChange}
                                    options={catalogs.RAZON_ESTADO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('RAZON_ESTADO', 'Razón del Estado')}
                                />
                                <SelectWithAdd
                                    label="Categoría"
                                    name="categoriaId"
                                    value={formData.categoriaId}
                                    onChange={handleChange}
                                    options={categorias}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('', 'Categoría', true)}
                                />
                            </div>
                        </div>
 
                        {/* SECCIÓN 2: FUNCIONARIO — solo lectura, los datos vienen del módulo Funcionarios */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <SectionHeader title="Información del Funcionario" icon="👤" />
                                <button 
                                    type="button"
                                    onClick={() => setShowFuncionario(!showFuncionario)}
                                    className="text-xs font-medium text-green-700 hover:text-green-800 bg-white px-2 py-1 rounded border border-green-200 shadow-sm transition-all"
                                >
                                    {showFuncionario ? '▲ Contraer' : '▼ Expandir Detalle'}
                                </button>
                            </div>
                            
                            {showFuncionario ? (
                                <>
                                    <p className="text-xs text-gray-500 mb-3 italic">Estos campos son informativos y se actualizan desde el módulo de Funcionarios.</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        <Field label="Empresa Funcionario">
                                            <input type="text" name="empresaFuncionario" value={formData.empresaFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <Field label="Empleado o Contratista">
                                            <input type="text" name="tipoPersonal" value={formData.tipoPersonal} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <Field label="Cédula del Funcionario">
                                            <input type="text" name="cedulaFuncionario" value={formData.cedulaFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <Field label="Shortname">
                                            <input type="text" name="shortname" value={formData.shortname} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <div className="col-span-2">
                                            <Field label="Nombres y Apellidos">
                                                <input type="text" name="nombreFuncionario" value={formData.nombreFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                            </Field>
                                        </div>
                                        <Field label="Departamento">
                                            <input type="text" name="departamento" value={formData.departamento} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <Field label="Ciudad">
                                            <input type="text" name="ciudad" value={formData.ciudad} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <div className="col-span-2">
                                            <Field label="Cargo">
                                                <input type="text" name="cargo" value={formData.cargo} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                            </Field>
                                        </div>
                                        <Field label="Área">
                                            <input type="text" name="area" value={formData.area} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                        <Field label="Ubicación y Piso">
                                            <input type="text" name="ubicacion" value={formData.ubicacion} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                                        </Field>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-green-600 font-medium">{formData.nombreFuncionario || 'Sin asignar a funcionario'}</p>
                            )}
                        </div>
 
                        {/* SECCIÓN 3: EQUIPO */}
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                            <SectionHeader title="Características del Equipo" icon="💻" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <SelectWithAdd
                                    label="Tipo de Equipo"
                                    name="tipo"
                                    required
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    options={catalogs.TIPO_EQUIPO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('TIPO_EQUIPO', 'Tipo de Equipo')}
                                />
                                <Field label="Serial" required>
                                    <input type="text" name="serial" required value={formData.serial} onChange={e => setFormData(p => ({ ...p, serial: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Placa" required>
                                    <input type="text" name="placa" required value={formData.placa} onChange={e => setFormData(p => ({ ...p, placa: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Activo Fijo">
                                    <input type="text" name="activoFijo" value={formData.activoFijo} onChange={e => setFormData(p => ({ ...p, activoFijo: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <SelectWithAdd
                                    label="Marca"
                                    name="marca"
                                    required
                                    value={formData.marca}
                                    onChange={handleChange}
                                    options={catalogs.MARCA}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('MARCA', 'Marca')}
                                />
                                <SelectWithAdd
                                    label="Modelo"
                                    name="modelo"
                                    required
                                    value={formData.modelo}
                                    onChange={handleChange}
                                    options={catalogs.MODELO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('MODELO', 'Modelo')}
                                />
                                <Field label="Nombre de Equipo">
                                    <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={inputCls} />
                                </Field>
                                <div className="col-span-2 lg:col-span-4">
                                    <SelectWithAdd
                                        label="Procesador"
                                        name="procesador"
                                        value={formData.procesador}
                                        onChange={handleChange}
                                        options={catalogs.PROCESADOR}
                                        canAdd={canEditCatalogs}
                                        onAdd={() => handleOpenCatalogModal('PROCESADOR', 'Procesador')}
                                    />
                                </div>
                                <SelectWithAdd
                                    label="Memoria RAM"
                                    name="memoriaRam"
                                    value={formData.memoriaRam}
                                    onChange={handleChange}
                                    options={catalogs.MEMORIA_RAM}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('MEMORIA_RAM', 'Memoria RAM')}
                                />
                                <SelectWithAdd
                                    label="Tamaño Disco Duro"
                                    name="discoDuro"
                                    value={formData.discoDuro}
                                    onChange={handleChange}
                                    options={catalogs.DISCO_DURO}
                                    canAdd={canEditCatalogs}
                                    onAdd={() => handleOpenCatalogModal('DISCO_DURO', 'Disco Duro')}
                                />
                                <div className="col-span-2">
                                    <SelectWithAdd
                                        label="Sistema Operativo"
                                        name="sistemaOperativo"
                                        value={formData.sistemaOperativo}
                                        onChange={handleChange}
                                        options={catalogs.SISTEMA_OPERATIVO}
                                        canAdd={canEditCatalogs}
                                        onAdd={() => handleOpenCatalogModal('SISTEMA_OPERATIVO', 'Sistema Operativo')}
                                    />
                                </div>
                            </div>
                        </div>
 
                        {/* SECCIÓN 4: COMPRA Y GARANTÍA */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                            <div className="flex items-center justify-between mb-4">
                                <SectionHeader title="Compra y Garantía" icon="📅" />
                                <button 
                                    type="button"
                                    onClick={() => setShowCompraGarantia(!showCompraGarantia)}
                                    className="text-xs font-medium text-purple-700 hover:text-purple-800 bg-white px-2 py-1 rounded border border-purple-200 shadow-sm transition-all"
                                >
                                    {showCompraGarantia ? '▲ Contraer' : '▼ Expandir'}
                                </button>
                            </div>
                            
                            {showCompraGarantia && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <Field label="Fecha de Compra">
                                        <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} className={inputCls} />
                                    </Field>
                                    <Field label="Fin de Garantía">
                                        <input type="date" name="garantiaHasta" value={formData.garantiaHasta} onChange={handleChange} className={inputCls} />
                                    </Field>
                                    <Field label="Tiempo de Uso">
                                        <div className={`${inputCls} bg-gray-100 text-gray-600`}>
                                            {tiempoUso || '—'}
                                        </div>
                                    </Field>
                                    <Field label="Valor de Compra">
                                        <input type="number" name="valorCompra" value={formData.valorCompra} onChange={handleChange} className={inputCls} />
                                    </Field>
                                    <div className="col-span-2 lg:col-span-4">
                                        <Field label="Observaciones">
                                            <textarea name="observaciones" rows="2" value={formData.observaciones} onChange={handleChange} className={inputCls}></textarea>
                                        </Field>
                                    </div>
                                    <div className="col-span-2 lg:col-span-4">
                                        <Field label="Imagen Principal">
                                            <div className="flex items-center gap-4 mt-1">
                                                {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded shadow" />}
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                            </div>
                                        </Field>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* FOOTER BUTTONS */}
                        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
                            <button
                                type="button"
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                onClick={() => onClose(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
                            >
                                {loading ? 'Guardando...' : 'Guardar Activo'}
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
                isCategory={activeModal.isCategory}
                onSaveSuccess={handleCatalogSuccess}
            />
        </div>
    );
};

export default ActivosForm;
