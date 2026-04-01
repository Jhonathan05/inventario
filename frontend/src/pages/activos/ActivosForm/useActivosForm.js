import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { activosService } from '../../../api/activos.service';
import { categoriasService } from '../../../api/categorias.service';
import { catalogosService } from '../../../api/catalogos.service';

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

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
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

export const useActivosForm = (activo, open, onClose) => {
    const [formData, setFormData] = useState(DEFAULT_STATE);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFuncionario, setShowFuncionario] = useState(false);
    const [showCompraGarantia, setShowCompraGarantia] = useState(!activo); // Mostrar expandido si es nuevo
    
    // Modal de catálogos
    const [activeModal, setActiveModal] = useState({ open: false, domain: '', title: '', isCategory: false });

    const queryClient = useQueryClient();

    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias'],
        queryFn: async () => sortList(await categoriasService.getAll())
    });

    const { data: catalogsObj = {} } = useQuery({
        queryKey: ['catalogos'],
        queryFn: async () => {
            const res = await catalogosService.getAll();
            const grouped = res.reduce((acc, curr) => {
                if (!acc[curr.dominio]) acc[curr.dominio] = [];
                acc[curr.dominio].push(curr.valor);
                return acc;
            }, {});
            const sortedGrouped = {};
            Object.keys(grouped).forEach(domain => {
                sortedGrouped[domain] = sortList(grouped[domain]);
            });
            return sortedGrouped;
        }
    });

    const catalogs = {
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
        ...catalogsObj
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
            setShowCompraGarantia(false); // Contraer si es editar
        } else {
            setFormData(DEFAULT_STATE);
            setImagen(null);
            setPreview(null);
            setShowCompraGarantia(true); // Expandido si es nuevo
        }
    }, [activo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'categoriaId') {
                const selectedCat = categorias.find(c => String(c.id) === String(value));
                if (selectedCat) {
                    next.tipo = selectedCat.nombre || selectedCat.valor || '';
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

    const handleCatalogSuccess = (newVal) => {
        if (activeModal.isCategory) {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            setFormData(prev => ({ 
                ...prev, 
                categoriaId: newVal.id,
                tipo: newVal.nombre || newVal.valor || prev.tipo
            }));
        } else {
            queryClient.invalidateQueries({ queryKey: ['catalogos'] });
            const val = newVal.valor;
            const fieldName = getFieldNameByDomain(activeModal.domain);
            if (fieldName) {
                setFormData(prev => ({ ...prev, [fieldName]: val }));
            }
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
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
                await activosService.update(activo.id, data);
            } else {
                await activosService.create(data);
            }
            queryClient.invalidateQueries({ queryKey: ['activos'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            onClose(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar activo');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        preview,
        categorias,
        catalogs,
        showFuncionario,
        setShowFuncionario,
        showCompraGarantia,
        setShowCompraGarantia,
        activeModal,
        setActiveModal,
        handleChange,
        handleUpperChange,
        handleImageChange,
        handleOpenCatalogModal,
        handleCatalogSuccess,
        handleSubmit
    };
};
