import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { licenciasService } from '../../api/licencias.service';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';

const LicenciasList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [asignadaFiltro, setAsignadaFiltro] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        software: '',
        version: '',
        tipoLicencia: 'PERPETUA',
        llaveLicencia: '',
        cantidad: 1,
        costo: '',
        fechaCompra: '',
        vencimiento: '',
        observaciones: ''
    });

    const { data: licenciasResponse, isLoading } = useQuery({
        queryKey: ['licencias', page, search, tipoFiltro, asignadaFiltro],
        queryFn: () => licenciasService.getAll({ 
            page, 
            limit: 10, 
            search, 
            tipoLicencia: tipoFiltro, 
            asignada: asignadaFiltro 
        }),
        keepPreviousData: true
    });

    const licencias = licenciasResponse?.data || [];
    const pagination = licenciasResponse?.pagination || { page: 1, pages: 1 };

    const saveMutation = useMutation({
        mutationFn: (data) => isEditing ? licenciasService.update(currentId, data) : licenciasService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['licencias']);
            toast.success(isEditing ? 'COMMIT_UPDATE_SUCCESS' : 'NODE_REGISTRATION_SUCCESS');
            setShowModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.error || '!! COMMIT_FAULT :: STREAM_REJECTED')
    });

    const deleteMutation = useMutation({
        mutationFn: licenciasService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['licencias']);
            toast.success('DESTRUCTION_PROTOCOL_COMPLETE');
        },
        onError: (err) => toast.error('!! PURGE_FAULT :: STICKY_NODE_ID')
    });

    const handleOpenNew = () => {
        setFormData({
            software: '', version: '', tipoLicencia: 'PERPETUA', llaveLicencia: '',
            cantidad: 1, costo: '', fechaCompra: '', vencimiento: '', observaciones: ''
        });
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            software: item.software || '',
            version: item.version || '',
            tipoLicencia: item.tipoLicencia || 'PERPETUA',
            llaveLicencia: item.llaveLicencia || '',
            cantidad: item.cantidad || 1,
            costo: item.costo || '',
            fechaCompra: item.fechaCompra ? item.fechaCompra.split('T')[0] : '',
            vencimiento: item.vencimiento ? item.vencimiento.split('T')[0] : '',
            observaciones: item.observaciones || ''
        });
        setIsEditing(true);
        setCurrentId(item.id);
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleDelete = (id, soft) => {
        if (window.confirm(`¿CONFIRMAR_DESTRUCCION_DE_REGISTRO: ${soft.toUpperCase()}? (PREVENT_DATA_LOSS)`)) {
            deleteMutation.mutate(id);
        }
    };

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner";

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Header / License Command Center */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">LICENSE_IO_STREAM_RX_0xFD4</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                                 / software_license_manifest
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">KERNEL_VIRTUAL_RESOURCE_MONITOR</p>
                            </div>
                            <span className="text-border-default/30 h-5 w-[2px] bg-border-default/30"></span>
                            <p className="text-[11px] text-text-primary font-black uppercase tracking-widest bg-bg-base px-3 py-1 border border-border-default/50 tabular-nums">
                                {pagination.total || '---'}_NODES_REGISTERED
                            </p>
                        </div>
                    </div>
                    {canEdit && (
                        <button
                            onClick={handleOpenNew}
                            className="bg-bg-elevated border-2 border-border-strong px-12 py-5 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.6em] transition-all shadow-3xl hover:scale-105 active:scale-95 group/btn relative overflow-hidden"
                        >
                            <span className="relative z-10 group-hover/btn:tracking-[0.8em] transition-all">[ + ] REGISTER_NEW_SOFTWARE_IO</span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                </div>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                     <div className="h-full bg-text-accent w-1/4 animate-loadingBarSlow"></div>
                </div>
            </div>

            {/* Query Filter / Data Buffer Search */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-widest">QUERY_ENGINE_RX_0x99</div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-2 relative group/search">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[11px] font-black group-focus-within/search:opacity-100 group-focus-within/search:text-text-accent transition-all whitespace-nowrap">
                            SCAN &raquo;
                        </div>
                        <input
                            type="text"
                            placeholder="SOFTWARE_LABEL_OR_UID_FRAGMENT_IO..."
                            className="block w-full bg-bg-base border-2 border-border-default py-5 pl-32 pr-8 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="relative group/select">
                        <select
                            value={tipoFiltro}
                            onChange={e => { setTipoFiltro(e.target.value); setPage(1); }}
                            className="w-full bg-bg-base border-2 border-border-default px-8 py-5 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="" className="text-text-muted opacity-40">:: ALL_CATEGORIES</option>
                            <option value="PERPETUA">PERPETUAL_VOL</option>
                            <option value="SUSCRIPCION">SUBSCRIPTION_TX</option>
                            <option value="OEM">OEM_VENDOR_LINK</option>
                            <option value="OPEN">VOLUME_OPEN_LIC</option>
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-40 text-[9px] font-black group-hover/select:text-text-accent transition-colors">&darr;</div>
                    </div>
                    <div className="relative group/select">
                        <select
                            value={asignadaFiltro}
                            onChange={e => { setAsignadaFiltro(e.target.value); setPage(1); }}
                            className="w-full bg-bg-base border-2 border-border-default px-8 py-5 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="" className="text-text-muted opacity-40">:: AVAILABILITY_STATE</option>
                            <option value="false">0xUNASSIGNED_POOL</option>
                            <option value="true">0xACTIVE_DEPLOYMENTS</option>
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-40 text-[9px] font-black group-hover/select:text-text-accent transition-colors">&darr;</div>
                    </div>
                </div>
            </div>

            {/* Data Manifest / License Registry Table */}
            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group/table hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/table:text-text-accent transition-colors">LICENSE_INDEX_STORAGE_MAP_RX</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1100px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: SOFTWARE_PROD_NODE</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: LICENSE_LEVEL_BIT</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: KEY_ID_SERIAL_ADDR</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: TX_EXPIRATION_TS_RX</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ALLOC_NODE</th>
                                {canEdit && <th scope="col" className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="text-[15px] font-black text-text-accent animate-pulse uppercase tracking-[1.5em]"># SYNCING_LICENSE_RESOURCE_MAP...</div>
                                        <div className="mt-8 text-[10px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic">MAPPING_VIRTUAL_NODES // CRC_INTEGRITY_CHECK: PASS</div>
                                    </td>
                                </tr>
                            ) : licencias.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="inline-block p-16 bg-bg-base border-2 border-dashed border-border-default/30 shadow-inner">
                                            <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic">! NO_LICENSES_MATCH_STAGED_QUERY_BUFFER</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : licencias.map(lic => (
                                <tr key={lic.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <div className="flex flex-col">
                                            <p className="text-[13px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors tabular-nums">
                                                {lic.software.toUpperCase().replace(/ /g, '_')} <span className="text-text-muted opacity-40 ml-2">v{lic.version}</span>
                                            </p>
                                            <p className="text-[10px] text-text-muted font-black mt-2 tracking-[0.3em] opacity-50 tabular-nums">VAL_UNIT_TX: {formatCurrency(lic.costo)}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <span className="inline-flex items-center border-2 border-border-default bg-bg-base px-6 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary group-hover/row:border-text-accent transition-all shadow-md">
                                            /{lic.tipoLicencia}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        <div className="font-mono text-[11px] text-text-muted border-2 border-border-default/30 group-hover/row:border-text-accent/20 group-hover/row:text-text-primary px-4 py-2 bg-bg-base/30 shadow-inner tabular-nums truncate max-w-[200px] transition-all" title={lic.llaveLicencia}>
                                            {lic.llaveLicencia?.toUpperCase() || 'SYS_OEM_NULL_KEY'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10 whitespace-nowrap">
                                        {lic.tipoLicencia === 'SUSCRIPCION' ? (
                                            <span className={`inline-flex items-center border-2 px-6 py-2 text-[10px] font-black tracking-[0.2em] uppercase shadow-md tabular-nums transition-all ${lic.vencimiento && new Date(lic.vencimiento) < new Date() ? 'text-text-accent border-text-accent animate-pulse bg-text-accent/5' : 'text-text-primary border-border-default bg-bg-base'}`}>
                                                [{formatDate(lic.vencimiento).toUpperCase().replace(/ /g, '_')}]
                                            </span>
                                        ) : <span className="text-text-muted text-[10px] font-black opacity-20 tracking-[0.4em] uppercase">:: PERPETUAL_RESOURCE</span>}
                                    </td>
                                    <td className="px-10 py-8 border-r border-border-default/10">
                                        {lic.activo ? (
                                            <a href={`/activos/${lic.activoId}`} className="group/asset relative">
                                                <div className="flex flex-col">
                                                    <span className="text-text-accent font-black text-[12px] tracking-widest uppercase truncate max-w-[200px] group-hover/asset:text-text-primary transition-colors underline decoration-text-accent/30 decoration-2 underline-offset-4">
                                                        [_{lic.activo.placa}_]
                                                    </span>
                                                    <span className="text-[9px] text-text-muted font-black tracking-widest mt-2 uppercase opacity-40">
                                                        NODE_MAP: {lic.activo.marca.toUpperCase()}
                                                    </span>
                                                </div>
                                            </a>
                                        ) : (
                                            <span className="text-text-muted text-[10px] font-black tracking-[0.3em] opacity-20 uppercase italic">// UNASSIGNED_BUFFER_POOL</span>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-6">
                                            <button 
                                                onClick={() => handleOpenEdit(lic)} 
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted hover:text-text-primary border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/edit"
                                            >
                                                <span className="opacity-40 group-hover/edit:text-text-primary mr-2">E:</span> [ MODIFY ]
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(lic.id, lic.software)} 
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-accent hover:text-text-primary border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/purge"
                                            >
                                                <span className="opacity-40 group-hover/purge:text-text-accent mr-2">!:</span> [ PURGE ]
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Protocol Interface */}
                {pagination.pages > 1 && (
                    <div className="px-10 py-10 bg-bg-base border-t-2 border-border-default flex flex-col sm:flex-row justify-between items-center gap-10 shadow-inner group/nav">
                        <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] flex items-center gap-4">
                             <div className="w-2.5 h-2.5 bg-border-default animate-pulse"></div>
                             BUFFER_SEGMENT_INDEX: <span className="text-text-primary">{pagination.page.toString().padStart(2, '0')}</span>_OF_<span className="text-text-primary">{pagination.pages.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex gap-8">
                            <button 
                                disabled={page === 1} 
                                onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                className="px-10 py-4 bg-bg-surface border-2 border-border-default text-[12px] font-black uppercase tracking-[0.4em] text-text-primary hover:border-text-accent disabled:opacity-20 transition-all shadow-2xl active:scale-95 group/prev"
                            >
                                <span className="group-hover/prev:-translate-x-2 inline-block transition-transform mr-4 font-bold">&larr;</span> PREV_SEGMENT
                            </button>
                            <button 
                                disabled={page >= pagination.pages} 
                                onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                className="px-10 py-4 bg-bg-surface border-2 border-border-default text-[12px] font-black uppercase tracking-[0.4em] text-text-primary hover:border-text-accent disabled:opacity-20 transition-all shadow-2xl active:scale-95 group/next"
                            >
                                NEXT_SEGMENT <span className="group-hover/next:translate-x-2 inline-block transition-transform ml-4 font-bold">&rarr;</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Commit / Edit Wizard Modal Bridge */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-6 text-center">
                        <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn" onClick={() => setShowModal(false)}></div>
                        <div className="relative bg-bg-surface border-2 border-border-default p-12 text-left shadow-3xl w-full max-w-2xl z-10 overflow-hidden animate-fadeInUp">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em]">COMMIT_BUFFER_RX_ENTRY</div>
                            
                            <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                         <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                                         <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.5em]">
                                             / {isEditing ? 'MODIFY_LICENSE_NODE_TX' : 'REGISTER_NEW_SOFTWARE_MANIFEST'}
                                         </h3>
                                    </div>
                                    <p className="text-[11px] text-text-muted font-black mt-2 uppercase tracking-[0.3em] opacity-60 italic">REGISTRY_PATH: resources.software_pool // LOG_RX: {currentId ? `0x${currentId.substring(0,8).toUpperCase()}` : '0xNULL_INIT_RX'}</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90">
                                    [ &times; ]
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: SOFTWARE_MANIFEST_LABEL *</label>
                                        <input required type="text" className={inputCls} value={formData.software} onChange={e => setFormData({...formData, software: e.target.value})} placeholder="EJ: MICROSOFT_OFFICE_LTSC_2024" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: VERSION_VER_BIT</label>
                                        <input type="text" className={inputCls} value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="EJ: 24H1" />
                                    </div>
                                    <div className="space-y-4 relative group">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: LICENSE_CLASS_PROTOCOL *</label>
                                        <select required className={inputCls} value={formData.tipoLicencia} onChange={e => setFormData({...formData, tipoLicencia: e.target.value})}>
                                            <option value="PERPETUA">PERPETUAL_VOL</option>
                                            <option value="SUSCRIPCION">SUBSCRIPTION_TX</option>
                                            <option value="OEM">OEM_VENDOR_LINK</option>
                                            <option value="OPEN">VOLUME_OPEN_LIC</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 translate-y-3 test-text-muted opacity-40 font-bold">&darr;</div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: PRODUCT_KEY_SERIAL_BUFFER_NODE</label>
                                        <input type="text" className={`${inputCls} font-mono tracking-[0.2em] shadow-inner tabular-nums group-focus:border-text-accent`} value={formData.llaveLicencia} onChange={e => setFormData({...formData, llaveLicencia: e.target.value})} placeholder="0x0000-0000-0000-0000" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: PURCHASE_TIMESTAMP_RX</label>
                                        <input type="date" className={inputCls} value={formData.fechaCompra} onChange={e => setFormData({...formData, fechaCompra: e.target.value})} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: COST_VAL_UNIT_TX</label>
                                        <div className="relative">
                                             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-accent font-black">$</div>
                                             <input type="number" step="0.01" className={`${inputCls} pl-12`} value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} placeholder="0x0.00" />
                                        </div>
                                    </div>
                                    {formData.tipoLicencia === 'SUSCRIPCION' && (
                                        <div className="md:col-span-2 space-y-4 animate-fadeIn">
                                            <label className="block text-[11px] font-black text-text-accent uppercase tracking-[0.4em] border-l-2 border-text-accent pl-6">:: CRITICAL_EXPIRATION_NODE_TS_RX *</label>
                                            <input required type="date" className={`${inputCls} border-text-accent/30 bg-text-accent/5 animate-pulseSlow`} value={formData.vencimiento} onChange={e => setFormData({...formData, vencimiento: e.target.value})} />
                                        </div>
                                    )}
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: ANNOTATIONS_METADATA_ARRAY</label>
                                        <textarea rows={4} className={`${inputCls} min-h-[120px] resize-none leading-relaxed transition-all custom-scrollbar`} value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} placeholder="ENTER_REGISTRY_METADATA_LOG_ENTRIES..." />
                                    </div>
                                </div>
                                
                                <div className="pt-12 flex flex-col sm:flex-row gap-8 border-t-2 border-border-default/20">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-10 py-5 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default hover:border-border-strong transition-all bg-bg-base shadow-xl active:scale-95"
                                    >
                                        [ DISCARD_TX_MOD_PROC ]
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveMutation.isLoading}
                                        className="flex-1 px-10 py-5 text-[12px] font-black bg-text-primary text-bg-base hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.6em] relative overflow-hidden group/commit active:scale-95"
                                    >
                                        {saveMutation.isLoading && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                                        <span className="relative z-10">{saveMutation.isLoading ? '[ INITIALIZING_SYNC... ]' : '[ EXECUTE_DATABASE_COMMIT_TX ]'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* IO Status Footer Marker */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-10 p-12 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-6">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                     RESOURCE_MONITOR_CMD_STREAM_RX_STABLE // SYSTEM_IO_0xFD
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">
                     COLOMBIA_IT_VIRTUAL_SOFTWARE_MANIFEST // KERNEL_STABLE_TX
                </div>
            </div>
        </div>
    );
};

export default LicenciasList;
