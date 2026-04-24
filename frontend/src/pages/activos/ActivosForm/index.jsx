import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { activosService } from '../../../api/activos.service';
import { categoriasService } from '../../../api/categorias.service';
import { catalogosService } from '../../../api/catalogos.service';
import { funcionariosService } from '../../../api/funcionarios.service';
import SelectWithAdd from '../../../components/SelectWithAdd';
import CatalogModal from '../../../components/CatalogModal';
import { 
    CameraIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

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

const SectionCard = ({ title, subtitle, children, className = "" }) => (
    <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-7 ${className}`}>
        <div>
            <h3 className="text-xl font-black text-charcoal-900 tracking-tight capitalize">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mt-1 opacity-80">{subtitle}</p>}
        </div>
        <div className="space-y-6">
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
    const data = list.data || list;
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
        const valA = (a.nombre || a.valor || a || '').toString().toUpperCase();
        const valB = (b.nombre || b.valor || b || '').toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const ActivosForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const canEditCatalogs = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState({ open: false, domain: '', title: '', isCategory: false });

    // Queries
    const { data: asset, isLoading: assetLoading } = useQuery({
        queryKey: ['activos', id],
        queryFn: () => activosService.getById(id),
        enabled: !!id
    });

    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias', 'full'],
        queryFn: async () => sortList(await categoriasService.getAll())
    });

    const { data: catalogs = {} } = useQuery({
        queryKey: ['catalogos', 'full'],
        queryFn: async () => {
            const res = await catalogosService.getAll();
            const grouped = (res?.data || res).reduce((acc, curr) => {
                if (curr?.dominio) {
                    if (!acc[curr.dominio]) acc[curr.dominio] = [];
                    acc[curr.dominio].push(curr.valor);
                }
                return acc;
            }, {});
            Object.keys(grouped).forEach(k => { grouped[k] = sortList(grouped[k]); });
            return grouped;
        }
    });

    const { data: funcionarios = [] } = useQuery({
        queryKey: ['funcionarios', 'all-minimal'],
        queryFn: async () => {
            const res = await funcionariosService.getAll({ limit: 1000 });
            return sortList(res?.data || res);
        }
    });

    useEffect(() => {
        if (asset) {
            setFormData({
                ...DEFAULT_STATE,
                ...asset,
                fechaCompra: asset.fechaCompra ? asset.fechaCompra.split('T')[0] : '',
                garantiaHasta: asset.garantiaHasta ? asset.garantiaHasta.split('T')[0] : '',
            });
            if (asset.imagen) setPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/uploads/${asset.imagen}`);
        }
    }, [asset]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'categoriaId') {
                const cat = categorias.find(c => String(c.id) === String(value));
                if (cat) next.tipo = cat.nombre || cat.valor || '';
            }
            if (name === 'cedulaFuncionario') {
                const func = funcionarios.find(f => String(f.cedula) === String(value));
                if (func) {
                    next.nombreFuncionario = func.nombre || 'SIN NOMBRE';
                    next.shortname = func.shortname || '';
                    next.area = func.area || 'SIN ÁREA';
                    next.cargo = func.cargo || 'SIN CARGO';
                    next.ciudad = func.ciudad || 'IBAGUE';
                    next.ubicacion = func.seccional || func.ubicacion || 'SIN UBICACIÓN';
                }
            }
            return next;
        });
    };

    const handleUpperChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleOpenCatalogModal = (domain, title, isCategory = false) => {
        setActiveModal({ open: true, domain, title, isCategory });
    };

    const handleCatalogSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['catalogos'] });
        queryClient.invalidateQueries({ queryKey: ['categorias'] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });
            if (imagen) data.append('imagen', imagen);

            if (id) {
                await activosService.update(id, data);
                toast.success('Activo actualizado exitosamente');
            } else {
                await activosService.create(data);
                toast.success('Activo creado exitosamente');
            }
            queryClient.invalidateQueries({ queryKey: ['activos'] });
            navigate('/activos');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al guardar el activo');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-gray-100/60 border-1.5 border-transparent rounded-full py-2 px-6 text-[11px] font-bold text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-0 focus:border-primary transition-all uppercase min-h-[36px] h-[36px]";

    if (assetLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <ArrowPathIcon className="w-10 h-10 text-primary animate-spin" />
                <p className="text-charcoal-400 font-bold uppercase tracking-widest text-[11px]">Sincronizando inventario técnico...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 animate-slide-up space-y-10 px-4 md:px-0 pb-20">
            {/* Header Ejecutivo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4 md:px-0">
                <div>
                    <h1 className="page-header-title">
                        {id ? 'Editar Registro de Activo' : 'Nuevo Activo Tecnológico'}
                    </h1>
                    <p className="page-header-subtitle">
                        Gestión detallada de hardware, licencias y asignación administrativa.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/activos')}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="activos-form"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Guardando...' : 'Guardar Activo'}
                    </button>
                </div>
            </div>

            <form id="activos-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* COLUMNA IZQUIERDA: Especificaciones Técnicas */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* CARD 1: Identidad del Equipo */}
                    <SectionCard 
                        title="Identidad del Equipo" 
                        subtitle="Datos físicos y serialización del activo."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SelectWithAdd
                                label="Categoría"
                                required
                                name="categoriaId"
                                value={formData.categoriaId || ''}
                                onChange={handleChange}
                                options={categorias}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('', 'Nueva Categoría', true)}
                            />
                            <Field label="Placa Inventario" required>
                                <input type="text" name="placa" value={formData.placa || ''} onChange={handleUpperChange} className={inputCls} placeholder="Ej. FNC-0001" required />
                            </Field>
                            <Field label="Número Serial" required>
                                <input type="text" name="serial" value={formData.serial || ''} onChange={handleUpperChange} className={inputCls} placeholder="Ej. S/N 123456" required />
                            </Field>
                            <SelectWithAdd
                                label="Marca"
                                required
                                name="marca"
                                value={formData.marca || ''}
                                onChange={handleChange}
                                options={catalogs.MARCA || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('MARCA', 'Nueva Marca')}
                            />
                            <SelectWithAdd
                                label="Modelo"
                                required
                                name="modelo"
                                value={formData.modelo || ''}
                                onChange={handleChange}
                                options={catalogs.MODELO || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('MODELO', 'Nuevo Modelo')}
                            />
                            <Field label="Activo Fijo SAP">
                                <input type="text" name="activoFijo" value={formData.activoFijo || ''} onChange={handleUpperChange} className={inputCls} placeholder="Código SAP" />
                            </Field>
                        </div>

                        <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <Field label="Imagen del Activo">
                                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-primary/20 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-charcoal-400">
                                        <CameraIcon className="w-8 h-8 mb-2 opacity-30" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Subir Fotografía</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </Field>
                            {preview && (
                                <div className="h-32 rounded-3xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* CARD 2: Especificaciones de Hardware */}
                    <SectionCard 
                        title="Especificaciones de Hardware" 
                        subtitle="Componentes internos y sistema operativo."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectWithAdd
                                label="Procesador"
                                name="procesador"
                                value={formData.procesador || ''}
                                onChange={handleChange}
                                options={catalogs.PROCESADOR || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('PROCESADOR', 'Nuevo Procesador')}
                            />
                            <SelectWithAdd
                                label="Memoria RAM"
                                name="memoriaRam"
                                value={formData.memoriaRam || ''}
                                onChange={handleChange}
                                options={catalogs.MEMORIA_RAM || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('MEMORIA_RAM', 'Nueva RAM')}
                            />
                            <SelectWithAdd
                                label="Disco Duro / Almacenamiento"
                                name="discoDuro"
                                value={formData.discoDuro || ''}
                                onChange={handleChange}
                                options={catalogs.DISCO_DURO || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('DISCO_DURO', 'Nuevo Disco')}
                            />
                            <SelectWithAdd
                                label="Sistema Operativo"
                                name="sistemaOperativo"
                                value={formData.sistemaOperativo || ''}
                                onChange={handleChange}
                                options={catalogs.SISTEMA_OPERATIVO || []}
                                canAdd={canEditCatalogs}
                                onAdd={() => handleOpenCatalogModal('SISTEMA_OPERATIVO', 'Nuevo SO')}
                            />
                        </div>
                    </SectionCard>

                </div>

                {/* COLUMNA DERECHA: Administración y Asignación */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* CARD 3: Administración */}
                    <SectionCard title="Administración">
                        <Field label="Estado del Activo">
                            <select name="estado" value={formData.estado || 'DISPONIBLE'} onChange={handleChange} className={inputCls}>
                                <option value="DISPONIBLE">DISPONIBLE</option>
                                <option value="ASIGNADO">ASIGNADO</option>
                                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                                <option value="BAJA">DADO DE BAJA</option>
                            </select>
                        </Field>
                        <SelectWithAdd
                            label="Estado Operativo"
                            name="estadoOperativo"
                            value={formData.estadoOperativo || ''}
                            onChange={handleChange}
                            options={catalogs.ESTADO_OPERATIVO || []}
                            canAdd={false}
                        />
                        <SelectWithAdd
                            label="Razón del Estado"
                            name="razonEstado"
                            value={formData.razonEstado || ''}
                            onChange={handleChange}
                            options={catalogs.RAZON_ESTADO || []}
                            canAdd={false}
                        />
                    </SectionCard>

                    {/* CARD 4: Asignación */}
                    <SectionCard title="Asignación de Usuario">
                        <SelectWithAdd
                            label="Funcionario Responsable"
                            name="cedulaFuncionario"
                            value={formData.cedulaFuncionario}
                            onChange={handleChange}
                            options={funcionarios.map(f => ({ id: f.cedula, valor: f.nombre }))}
                            canAdd={false}
                            placeholder="Buscar Colaborador..."
                        />
                        {formData.cedulaFuncionario && (
                            <div className="animate-slide-up space-y-4 pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest underline underline-offset-4">Detalles de Asignación:</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-[12px] font-bold text-charcoal-800 capitalize leading-tight">{formData.nombreFuncionario?.toLowerCase()}</p>
                                        <p className="text-[10px] font-semibold text-charcoal-400 capitalize">{formData.cargo?.toLowerCase()} — {formData.area?.toLowerCase()}</p>
                                        <p className="text-[10px] font-semibold text-charcoal-400 capitalize opacity-70">Ubicación: {formData.ubicacion?.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    {/* CARD 5: Compra y Garantía */}
                    <SectionCard title="Financiero y Garantía">
                        <Field label="Fecha de Compra">
                            <input type="date" name="fechaCompra" value={formData.fechaCompra || ''} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="Vencimiento Garantía">
                            <input type="date" name="garantiaHasta" value={formData.garantiaHasta || ''} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="Valor de Compra (Pesos)">
                            <input type="number" name="valorCompra" value={formData.valorCompra || ''} onChange={handleChange} className={inputCls} placeholder="$ 0.00" />
                        </Field>
                    </SectionCard>

                </div>

                <div className="lg:col-span-12">
                   <SectionCard title="Observaciones Adicionales">
                        <textarea 
                            name="observaciones" 
                            value={formData.observaciones || ''} 
                            onChange={handleUpperChange} 
                            rows="4" 
                            className={`${inputCls.replace('rounded-full', 'rounded-2xl')} resize-none py-4 min-h-[120px]`} 
                            placeholder="Detalles sobre el historial, daños previos o notas administrativas..."
                        />
                   </SectionCard>
                </div>

            </form>

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
