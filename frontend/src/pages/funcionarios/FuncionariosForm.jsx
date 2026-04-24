import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { funcionariosService } from '../../api/funcionarios.service';
import SelectWithAdd from '../../components/SelectWithAdd';
import CatalogModal from '../../components/CatalogModal';
import { MUNICIPIOS_TOLIMA } from '../../lib/constants';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

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

const SectionCard = ({ title, subtitle, icon, children, className = "" }) => (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-7 ${className}`}>
        <div>
            <h3 className="text-xl font-black text-charcoal-900 tracking-tight capitalize">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mt-1 opacity-80">{subtitle}</p>}
        </div>
        <div className="space-y-5">
            {children}
        </div>
    </div>
);

const Field = ({ label, id, children, required, className = "" }) => (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
        {label && (
            <label htmlFor={id} className="block text-[10px] font-bold text-charcoal-400 uppercase tracking-widest ml-1 opacity-70">
                {label} {required && <span className="text-primary">*</span>}
            </label>
        )}
        {children}
    </div>
);

const sortList = (list) => {
    if (!list) return [];
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a || '').toString().toUpperCase();
        const valB = (b.nombre || b.valor || b || '').toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const FuncionariosForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [activeModal, setActiveModal] = useState({ open: false, domain: '', title: '' });

    // Fetch options
    const { data: rawOptions = { areas: [], cargos: [], ciudades: [], seccionales: [] } } = useQuery({
        queryKey: ['funcionarios', 'options'],
        queryFn: funcionariosService.getOptions
    });

    // Fetch funcionario if editing
    const { data: funcionario, isLoading: fetchingFuncionario } = useQuery({
        queryKey: ['funcionarios', id],
        queryFn: () => funcionariosService.getById(id),
        enabled: !!id
    });

    const options = {
        areas: sortList(rawOptions.areas || []),
        cargos: sortList(rawOptions.cargos || []),
        ciudades: sortList([...new Set([...(rawOptions.ciudades || []), ...MUNICIPIOS_TOLIMA])]),
        seccionales: sortList(rawOptions.seccionales || [])
    };

    useEffect(() => {
        if (funcionario) {
            setFormData({
                ...DEFAULT_STATE,
                ...funcionario,
                activo: funcionario.activo ?? true,
                departamento: funcionario.departamento || 'TOLIMA'
            });
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
            if (name === 'ciudad') {
                next.municipio = newValue;
                if (!prev.ubicacion || prev.ubicacion === prev.ciudad) {
                    next.ubicacion = newValue;
                }
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (id) {
                await funcionariosService.update(id, formData);
                toast.success('Funcionario actualizado');
            } else {
                await funcionariosService.create(formData);
                toast.success('Funcionario creado');
            }
            queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
            navigate('/funcionarios');
        } catch (err) {
            const msg = err.response?.data?.error || 'Error al guardar funcionario';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCatalogModal = (domain, title) => {
        setActiveModal({ open: true, domain, title });
    };

    const inputCls = "w-full bg-gray-100/60 border-1.5 border-transparent rounded-full py-2 px-6 text-[11px] font-bold text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-0 focus:border-primary transition-all uppercase min-h-[36px] h-[36px]";
    const emailCls = inputCls.replace('uppercase', 'lowercase');

    if (fetchingFuncionario) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <ArrowPathIcon className="w-10 h-10 text-primary animate-spin" />
                <p className="text-charcoal-400 font-bold uppercase tracking-widest text-[11px]">Sincronizando registro corporativo...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 animate-slide-up space-y-10 px-4 md:px-0">
            {/* Header Ejecutivo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4 md:px-0">
                <div>
                    <h1 className="page-header-title">
                        {id ? 'Editar Registro de Funcionario' : 'Crear Nuevo Funcionario'}
                    </h1>
                    <p className="page-header-subtitle">
                        Complete los detalles para registrar un nuevo empleado en el sistema corporativo.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/funcionarios')}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="funcionario-form"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Procesando...' : 'Guardar Funcionario'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 text-rose-800 rounded-3xl flex items-center gap-4">
                    <span className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center text-sm font-bold opacity-70">!</span>
                    <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
                </div>
            )}

            <form id="funcionario-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Columna Principal: Identificación */}
                <div className="lg:col-span-7 space-y-8">
                    <SectionCard title="Identificación y Contacto" subtitle="Información personal básica.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <Field label="Nombre Completo" id="nombre" required className="md:col-span-2">
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputCls} placeholder="Ej. Juan Carlos Pérez" required />
                            </Field>
                            <Field label="Documento de Identidad" id="cedula" required>
                                <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} className={inputCls} placeholder="Número de Documento" required />
                            </Field>
                            <Field label="Alias Técnico / Shortname" id="shortname">
                                <input type="text" id="shortname" name="shortname" value={formData.shortname} onChange={handleChange} className={inputCls} placeholder="Ej. JuanP" />
                            </Field>
                            <Field label="Correo Electrónico" id="email" required className="md:col-span-2">
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={emailCls} placeholder="juan.perez@fnc.com" required />
                            </Field>
                            <Field label="Teléfono Móvil" id="telefono">
                                <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className={inputCls} placeholder="+57 300 000 0000" />
                            </Field>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary/20 transition-all" />
                                    <span className="text-[11px] font-black text-charcoal-400 uppercase tracking-widest group-hover:text-charcoal-800 transition-colors">Vínculo Activo</span>
                                </label>
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* Columna Lateral: Laboral y Ubicación */}
                <div className="lg:col-span-5 space-y-8">
                    <SectionCard title="Información Laboral">
                        <SelectWithAdd
                            label="Cargo u Oficio"
                            name="cargo"
                            required
                            value={formData.cargo}
                            onChange={handleChange}
                            options={options.cargos}
                            canAdd
                            onAdd={() => handleOpenCatalogModal('CARGO', 'Nuevo Cargo')}
                        />
                        <SelectWithAdd
                            label="Área / Departamento"
                            name="area"
                            required
                            value={formData.area}
                            onChange={handleChange}
                            options={options.areas}
                            canAdd
                            onAdd={() => handleOpenCatalogModal('AREA', 'Nueva Área')}
                        />
                        <SelectWithAdd
                            label="Tipo de Contrato"
                            name="vinculacion"
                            value={formData.vinculacion}
                            onChange={handleChange}
                            options={sortList(['EMPLEADO', 'CONTRATISTA', 'EXTERNO', 'PASANTE'])}
                            canAdd={false}
                        />
                    </SectionCard>

                    <SectionCard title="Ubicación y Sede">
                        <SelectWithAdd
                            label="Sede Principal / Seccional"
                            required
                            name="seccional"
                            value={formData.seccional}
                            onChange={handleChange}
                            options={options.seccionales}
                            canAdd
                            onAdd={() => handleOpenCatalogModal('SECCIONAL', 'Nueva Seccional')}
                        />
                        <SelectWithAdd
                            label="Ciudad / Municipio"
                            required
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            options={options.ciudades}
                            canAdd={false}
                        />
                        <Field label="Piso / Oficina">
                            <input type="text" name="piso" value={formData.piso} onChange={handleChange} className={inputCls} placeholder="Ej. Piso 2 / Oficina 204" />
                        </Field>
                    </SectionCard>
                </div>
            </form>

            <CatalogModal 
                open={activeModal.open} 
                onClose={() => setActiveModal(prev => ({ ...prev, open: false }))}
                domain={activeModal.domain} 
                title={activeModal.title}
                onSaveSuccess={() => queryClient.invalidateQueries({ queryKey: ['funcionarios', 'options'] })}
            /> 
        </div>
    );
};

export default FuncionariosForm;
