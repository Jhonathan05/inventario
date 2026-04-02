import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import SelectWithAdd from '../../components/SelectWithAdd';
import CatalogModal from '../../components/CatalogModal';
import { MUNICIPIOS_TOLIMA } from '../../lib/constants';

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

// Sub-components restyled to monochromatic terminal aesthetic
const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-5 mb-10 border-b-2 border-border-default pb-5">
        <span className="text-[14px] font-black text-text-accent opacity-80 tabular-nums">{icon}</span>
        <h4 className="text-[12px] font-black text-text-primary uppercase tracking-[0.5em]">{title}</h4>
    </div>
);

const Field = ({ label, id, children, required }) => (
    <div className="flex flex-col space-y-3 group/field">
        <label htmlFor={id} className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] cursor-pointer group-focus-within/field:text-text-accent transition-colors opacity-70">
            :: {label} {required && <span className="text-text-accent">*</span>}
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
        ciudades: sortList([...new Set([...(rawOptions.ciudades || []), ...MUNICIPIOS_TOLIMA])]),
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
        const requiredFields = [
            { key: 'nombre', label: 'NOMBRE_COMPLETO' },
            { key: 'cedula', label: 'CEDULA' },
            { key: 'email', label: 'EMAIL' },
            { key: 'cargo', label: 'CARGO' },
            { key: 'departamento', label: 'DEPARTAMENTO' },
            { key: 'ciudad', label: 'CIUDAD' },
            { key: 'seccional', label: 'SECCIONAL' },
            { key: 'municipio', label: 'MUNICIPIO' },
            { key: 'ubicacion', label: 'UBICACION' }
        ];

        const missing = requiredFields.filter(f => !formData[f.key]);
        if (missing.length > 0) {
            setError(`REQUIRED_FIELDS_MISSING: ${missing.map(f => f.label).join(', ')}`);
            if (missing.some(f => ['cargo'].includes(f.key))) setShowLaboral(true);
            if (missing.some(f => ['departamento', 'ciudad', 'seccional', 'municipio', 'ubicacion'].includes(f.key))) setShowUbicacion(true);
            const modalElement = e.target.closest('.overflow-y-auto');
            if (modalElement) modalElement.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setError('INVALID_EMAIL_ENDPOINT_FORMAT_DETECTED');
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
            queryClient.invalidateQueries({ queryKey: ['activos'] });
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.error || 'ERROR_DURING_COMMIT_PHASE_FAILURE');
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

    const inputCls = "w-full bg-bg-base border-2 border-border-default px-6 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner";
    const emailCls = inputCls.replace('uppercase', 'lowercase');

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono animate-fadeIn" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 py-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/95 backdrop-blur-xl transition-opacity duration-500" onClick={() => onClose(false)}></div>
                
                <div className="relative bg-bg-surface border-4 border-border-default p-12 text-left shadow-[0_0_150px_rgba(0,0,0,0.7)] sm:my-16 w-full max-w-5xl z-10 overflow-hidden transform transition-all group/modal animate-slideUp">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[1em] group-hover/modal:opacity-20 group-hover/modal:text-text-accent transition-all">ENTITY_REG_HOOK_RX_KERNEL</div>
                    
                    <div className="flex items-center justify-between mb-14 border-b-4 border-border-default pb-10">
                        <div>
                            <div className="flex items-center gap-5 mb-4">
                                <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.75)]"></div>
                                <h3 className="text-2xl font-black text-text-primary uppercase tracking-[0.5em]">
                                    / {funcionario ? 'modify_personnel_node' : 'register_new_entity'}
                                </h3>
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                                <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60 bg-bg-base px-4 py-1.5 border-2 border-border-default/50 shadow-inner">REGISTRY_PATH: personnel.db // UID: {funcionario?.id || 'SYS_NULL'}</p>
                            </div>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-5xl leading-none font-black transition-all transform hover:rotate-90 active:scale-75 focus:outline-none">
                            [ &times; ]
                        </button>
                    </div>

                    {error && (
                        <div className="mb-14 p-10 bg-text-accent/10 border-2 border-text-accent text-text-accent shadow-3xl relative overflow-hidden animate-shake flex items-center gap-10">
                            <div className="absolute top-0 right-0 p-6 opacity-20 text-[11px] font-black uppercase tracking-widest italic">FATAL_VALIDATION_STREAM</div>
                            <span className="font-black text-6xl leading-none animate-pulse">!!!</span>
                            <div className="space-y-3 z-10">
                                <p className="text-[13px] font-black uppercase tracking-[0.4em] underline decoration-text-accent decoration-2 underline-offset-8">VALIDATION_BUF_FAULT</p>
                                <p className="text-[11px] font-black opacity-90 leading-relaxed uppercase tracking-widest border-l-4 border-text-accent/30 pl-6">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-16">
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="bg-bg-base/20 border-2 border-border-default p-12 hover:border-text-accent/30 transition-all relative group/sec overflow-hidden shadow-inner">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-widest">SEC_01_CORE_IDENTITY_RX</div>
                            <SectionHeader title="01_CORE_IDENTITY_STREAM" icon="[0x01]" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                                <Field label="FULL_LEGAL_NAME_ADDR" id="nombre" required>
                                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputCls} placeholder="EG. PERSONNEL_NAME_01" autoComplete="off" />
                                </Field>
                                <Field label="SHORT_ALIAS_UID" id="shortname">
                                    <input type="text" id="shortname" name="shortname" value={formData.shortname} onChange={handleChange} className={inputCls} placeholder="EG. ALIAS_NODE_01" autoComplete="off" />
                                </Field>
                                <Field label="IDENTIFICATION_UID" id="cedula" required>
                                    <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} className={inputCls} autoComplete="off" placeholder="NUMERIC_UID_BUF" />
                                </Field>
                                <Field label="COMM_EMAIL_ENDPOINT" id="email" required>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={emailCls} placeholder="endpoint@domain.com" autoComplete="off" />
                                </Field>
                                <Field label="COMM_TELEPHONE_PORT" id="telefono">
                                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className={inputCls} autoComplete="off" placeholder="PORT_VAL_X" />
                                </Field>
                                <div className="flex items-end pb-3">
                                    <label className="flex items-center gap-6 cursor-pointer group/toggle border-2 border-border-default hover:border-text-accent p-4 bg-bg-base/50 transition-all shadow-xl">
                                        <input type="checkbox" id="activo" name="activo" checked={formData.activo} onChange={handleChange} className="sr-only" />
                                        <div className={`w-10 h-10 border-2 transition-all flex items-center justify-center ${formData.activo ? 'bg-text-primary border-text-primary ring-2 ring-text-primary ring-offset-2 ring-offset-bg-base' : 'bg-bg-base border-border-default group-hover/toggle:border-text-accent shadow-inner'}`}>
                                            {formData.activo && <span className="text-bg-base text-[18px] font-black">✓</span>}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${formData.activo ? 'text-text-primary' : 'text-text-muted opacity-40 group-hover/toggle:opacity-100'}`}>NODE_ACTIVE_STATE</span>
                                            <span className="text-[8px] font-black text-text-muted opacity-30 uppercase tracking-tighter">IO_CHANNEL_RX</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: INFORMACIÓN LABORAL */}
                        <div className="bg-bg-base/20 border-2 border-border-default p-12 hover:border-text-accent/30 transition-all relative group/sec overflow-hidden shadow-inner">
                             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-widest">SEC_02_CORP_SUBSYSTEM</div>
                            <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-8">
                                <SectionHeader title="02_EMPLOYMENT_SUBSYSTEM" icon="[0x02]" />
                                <button 
                                    type="button" 
                                    onClick={() => setShowLaboral(!showLaboral)}
                                    className={`text-[11px] font-black uppercase tracking-[0.4em] border-2 px-8 py-4 bg-bg-base transition-all shadow-2xl active:scale-95 flex items-center gap-5 ${showLaboral ? 'border-text-accent text-text-accent' : 'border-border-default text-text-muted hover:text-text-primary hover:border-border-strong'}`}
                                >
                                    <span className="opacity-30">{showLaboral ? '[ - ]' : '[ + ]'}</span> 
                                    {showLaboral ? 'COLLAPSE_BUF' : 'EXPAND_BUF'}
                                </button>
                            </div>
                            {showLaboral && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fadeIn relative z-10">
                                    <Field label="INTERNAL_PERS_CODE" id="codigoPersonal">
                                        <input type="text" id="codigoPersonal" name="codigoPersonal" value={formData.codigoPersonal} onChange={handleChange} className={inputCls} autoComplete="off" placeholder="CORE_ID_RX" />
                                    </Field>
                                    <SelectWithAdd
                                        label="CONTRACT_CLASS_SPEC"
                                        name="vinculacion"
                                        value={formData.vinculacion}
                                        onChange={handleChange}
                                        options={sortList(['EMPLEADO', 'CONTRATISTA', 'EXTERNO', 'PASANTE'])}
                                    />
                                    <SelectWithAdd
                                        label="POSITION_ROLE_ADDR"
                                        name="cargo"
                                        required
                                        value={formData.cargo}
                                        onChange={handleChange}
                                        options={options.cargos}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('CARGO', 'NUEVO_CARGO_TX')}
                                    />
                                    <SelectWithAdd
                                        label="AREA_DEPENDENCY_NAMESPACE"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        options={options.areas}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('AREA', 'NUEVA_AREA_TX')}
                                    />
                                    <Field label="EMPLOYER_ENTITY_IO" id="empresaFuncionario">
                                        <input type="text" id="empresaFuncionario" name="empresaFuncionario" value={formData.empresaFuncionario} onChange={handleChange} className={inputCls} autoComplete="off" placeholder="PARENT_NODE" />
                                    </Field>
                                    <Field label="PROJECT_COST_CENTER_ID" id="proyecto">
                                        <input type="text" id="proyecto" name="proyecto" value={formData.proyecto} onChange={handleChange} className={inputCls} autoComplete="off" placeholder="COST_BUDGET_NODE" />
                                    </Field>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 3: UBICACIÓN */}
                        <div className="bg-bg-base/20 border-2 border-border-default p-12 hover:border-text-accent/30 transition-all relative group/sec overflow-hidden shadow-inner">
                             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-widest">SEC_03_GEOGRAPHIC_DOMAIN</div>
                            <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-8">
                                <SectionHeader title="03_LOCATION_DOMAIN" icon="[0x03]" />
                                <button 
                                    type="button" 
                                    onClick={() => setShowUbicacion(!showUbicacion)}
                                    className={`text-[11px] font-black uppercase tracking-[0.4em] border-2 px-8 py-4 bg-bg-base transition-all shadow-2xl active:scale-95 flex items-center gap-5 ${showUbicacion ? 'border-text-accent text-text-accent' : 'border-border-default text-text-muted hover:text-text-primary hover:border-border-strong'}`}
                                >
                                    <span className="opacity-30">{showUbicacion ? '[ - ]' : '[ + ]'}</span> 
                                    {showUbicacion ? 'COLLAPSE_BUF' : 'EXPAND_BUF'}
                                </button>
                            </div>
                            {showUbicacion && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fadeIn relative z-10">
                                    <Field label="DEPT_PROVINCE_ADDR" id="departamento" required>
                                        <input type="text" id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} className={inputCls} autoComplete="off" />
                                    </Field>
                                    <SelectWithAdd
                                        label="MUNICIPALITY_CITY_NODE"
                                        name="ciudad"
                                        required
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        options={options.ciudades}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('CIUDAD', 'NUEVA_CIUDAD_RX')}
                                    />
                                    <SelectWithAdd
                                        label="OFFICE_SECCIONAL_SPEC"
                                        name="seccional"
                                        required
                                        value={formData.seccional}
                                        onChange={handleChange}
                                        options={options.seccionales}
                                        canAdd
                                        onAdd={() => handleOpenCatalogModal('SECCIONAL', 'NUEVA_SECCIONAL_RX')}
                                    />
                                    <Field label="PHYSICAL_SITE_ADDRESS_IO" id="ubicacion" required>
                                        <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className={inputCls} placeholder="EG. FLOOR_01_MURILLO_BRANCH" />
                                    </Field>
                                    <Field label="FLOOR_OFFICE_STATION_ADDR" id="piso">
                                        <input type="text" id="piso" name="piso" value={formData.piso} onChange={handleChange} className={inputCls} placeholder="EG. ROOM_202_NODE" />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-10 justify-end pt-12 border-t-2 border-border-default/50 items-center">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="w-full sm:w-auto px-14 py-6 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.6em] border-2 border-border-default hover:border-border-strong transition-all bg-bg-base/50 shadow-2xl active:scale-95"
                            >
                                [ CANCEL_PROCEDURE_TX ]
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-20 py-6 text-[13px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_50px_rgba(var(--text-accent),0.2)] disabled:opacity-20 uppercase tracking-[0.7em] flex items-center justify-center gap-8 group/submit active:scale-95 relative overflow-hidden ring-4 ring-text-primary hover:ring-text-accent transition-all"
                            >
                                {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin rounded-full"></div>
                                        <span className="relative z-10">EXECUTING_COMMIT...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10 transition-all group-hover/submit:tracking-[0.9em]">[ EXECUTE_DB_COMMIT ]</span>
                                        <span className="opacity-40 group-hover/submit:translate-x-2 transition-transform text-xl relative z-10">&raquo;</span>
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
