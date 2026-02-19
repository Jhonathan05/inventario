import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
    EMPRESAS_PROPIETARIAS, FUENTES_RECURSO, TIPOS_RECURSO,
    EMPRESAS_FUNCIONARIO, TIPOS_PERSONAL, CARGOS,
    TIPOS_EQUIPO, ESTADOS_OPERATIVOS, RAZONES_ESTADO, TIPOS_CONTROL,
    PROCESADORES, MEMORIAS_RAM, DISCOS_DUROS, SISTEMAS_OPERATIVOS
} from './ActivosFormData';

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

const SelectField = ({ name, value, onChange, options, placeholder = 'Seleccione...', required }) => (
    <select name={name} value={value} onChange={onChange} required={required} className={selectCls}>
        <option value="">{placeholder}</option>
        {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
);

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
    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchCategorias(); }, []);

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
            setCategorias(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                                <Field label="Empresa Propietaria">
                                    <SelectField name="empresaPropietaria" value={formData.empresaPropietaria} onChange={handleChange} options={EMPRESAS_PROPIETARIAS} />
                                </Field>
                                <Field label="Dependencia">
                                    <input type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Fuente de Recurso">
                                    <SelectField name="fuenteRecurso" value={formData.fuenteRecurso} onChange={handleChange} options={FUENTES_RECURSO} />
                                </Field>
                                <Field label="Tipo de Recurso">
                                    <SelectField name="tipoRecurso" value={formData.tipoRecurso} onChange={handleChange} options={TIPOS_RECURSO} />
                                </Field>
                                <Field label="Administrado / Controlado">
                                    <SelectField name="tipoControl" value={formData.tipoControl} onChange={handleChange} options={TIPOS_CONTROL} />
                                </Field>
                                <Field label="Estado Operativo">
                                    <SelectField name="estadoOperativo" value={formData.estadoOperativo} onChange={handleChange} options={ESTADOS_OPERATIVOS} />
                                </Field>
                                <Field label="Razón del Estado">
                                    <SelectField name="razonEstado" value={formData.razonEstado} onChange={handleChange} options={RAZONES_ESTADO} />
                                </Field>
                                <Field label="Categoría">
                                    <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className={selectCls}>
                                        <option value="">Seleccione...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </div>

                        {/* SECCIÓN 2: FUNCIONARIO */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <SectionHeader title="Información del Funcionario" icon="👤" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <Field label="Empresa Funcionario">
                                    <SelectField name="empresaFuncionario" value={formData.empresaFuncionario} onChange={handleChange} options={EMPRESAS_FUNCIONARIO} />
                                </Field>
                                <Field label="Empleado o Contratista">
                                    <SelectField name="tipoPersonal" value={formData.tipoPersonal} onChange={handleChange} options={TIPOS_PERSONAL} />
                                </Field>
                                <Field label="Cédula del Funcionario">
                                    <input type="number" name="cedulaFuncionario" value={formData.cedulaFuncionario} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Shortname (opcional)">
                                    <input type="text" name="shortname" value={formData.shortname} onChange={handleChange} className={inputCls} />
                                </Field>
                                <div className="col-span-2">
                                    <Field label="Nombres y Apellidos">
                                        <input type="text" name="nombreFuncionario" value={formData.nombreFuncionario} onChange={handleChange} className={inputCls} />
                                    </Field>
                                </div>
                                <Field label="Departamento">
                                    <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Ciudad">
                                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className={inputCls} />
                                </Field>
                                <div className="col-span-2">
                                    <Field label="Cargo">
                                        <SelectField name="cargo" value={formData.cargo} onChange={handleChange} options={CARGOS} />
                                    </Field>
                                </div>
                                <Field label="Área">
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} className={inputCls} />
                                </Field>
                                <Field label="Ubicación y Piso">
                                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className={inputCls} />
                                </Field>
                            </div>
                        </div>

                        {/* SECCIÓN 3: EQUIPO */}
                        <div className="bg-amber-50 rounded-lg p-4">
                            <SectionHeader title="Características del Equipo" icon="💻" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <Field label="Tipo de Equipo">
                                    <SelectField name="tipo" value={formData.tipo} onChange={handleChange} options={TIPOS_EQUIPO} />
                                </Field>
                                <Field label="Serial">
                                    <input type="text" name="serial" value={formData.serial} onChange={e => setFormData(p => ({ ...p, serial: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Placa *" required>
                                    <input type="text" name="placa" required value={formData.placa} onChange={e => setFormData(p => ({ ...p, placa: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Marca *" required>
                                    <input type="text" name="marca" required value={formData.marca} onChange={e => setFormData(p => ({ ...p, marca: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Modelo *" required>
                                    <input type="text" name="modelo" required value={formData.modelo} onChange={e => setFormData(p => ({ ...p, modelo: e.target.value.toUpperCase() }))} className={inputCls} />
                                </Field>
                                <Field label="Nombre de Equipo">
                                    <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={inputCls} />
                                </Field>
                                <div className="col-span-2 lg:col-span-4">
                                    <Field label="Procesador">
                                        <SelectField name="procesador" value={formData.procesador} onChange={handleChange} options={PROCESADORES} />
                                    </Field>
                                </div>
                                <Field label="Memoria RAM">
                                    <SelectField name="memoriaRam" value={formData.memoriaRam} onChange={handleChange} options={MEMORIAS_RAM} />
                                </Field>
                                <Field label="Tamaño Disco Duro">
                                    <SelectField name="discoDuro" value={formData.discoDuro} onChange={handleChange} options={DISCOS_DUROS} />
                                </Field>
                                <div className="col-span-2">
                                    <Field label="Sistema Operativo">
                                        <SelectField name="sistemaOperativo" value={formData.sistemaOperativo} onChange={handleChange} options={SISTEMAS_OPERATIVOS} />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 4: COMPRA Y GARANTÍA */}
                        <div className="bg-purple-50 rounded-lg p-4">
                            <SectionHeader title="Compra y Garantía" icon="📅" />
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
        </div>
    );
};

export default ActivosForm;
