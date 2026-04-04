import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useActivosForm } from './useActivosForm';
import CatalogModal from '../../../components/CatalogModal';

// Components
import AdminSection from './components/AdminSection';
import FuncionarioSection from './components/FuncionarioSection';
import EquipoSection from './components/EquipoSection';
import CompraGarantiaSection from './components/CompraGarantiaSection';

const ActivosForm = ({ open, onClose, activo }) => {
    const { user } = useAuth();
    const canEditCatalogs = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const {
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
    } = useActivosForm(activo, open, onClose);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono selection:bg-text-accent selection:text-bg-base" role="dialog" aria-modal="true">
            <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/90 backdrop-blur-md transition-opacity duration-500" onClick={() => onClose(false)}></div>

                <div className="relative inline-block align-top bg-bg-surface border-4 border-border-default p-12 text-left shadow-[0_60px_150px_rgba(0,0,0,0.9)] transform transition-all sm:my-12 sm:w-full sm:max-w-6xl z-10 overflow-hidden animate-fadeIn duration-500 hover:border-text-accent/30">
                    {/* Visual decoration and background stream */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[2em] italic">ASSET_COMMIT_HOOK_v4.2</div>
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                    
                    <div className="flex items-center justify-between mb-12 border-b-4 border-border-default pb-10 relative">
                        <div className="flex items-center gap-8">
                             <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.6)]"></div>
                             <div>
                                <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.5em] leading-none mb-4">
                                    / {activo ? 'MODIFY_ASSET_NODE_RX' : 'REGISTER_NEW_ASSET_IO'}
                                </h3>
                                <p className="text-[11px] text-text-muted font-bold mt-2 uppercase tracking-[0.4em] opacity-40 italic">REGISTRY_PATH: core.inventory // NODE_ID: {activo?.id?.slice(0,12).toUpperCase() || 'NULL_STREAM'}</p>
                             </div>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90 active:scale-75 p-4 bg-bg-base/30 border-2 border-transparent hover:border-border-default shadow-xl">
                            [ &times; ]
                        </button>
                    </div>

                    {error && (
                        <div className="mb-14 p-8 border-4 border-text-accent bg-text-accent/5 text-text-accent font-black text-[13px] uppercase tracking-[0.6em] animate-pulse shadow-[0_20px_60px_rgba(var(--text-accent),0.2)] relative overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-8">
                                <span className="text-2xl">!</span> CRITICAL_COMMIT_FAULT :: {error} 
                            </span>
                            <div className="absolute top-0 right-0 p-3 opacity-20 text-[9px] uppercase tracking-widest italic">INTERRUPT_0xEE</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-16 animate-fadeIn relative z-10">
                        <div className="grid grid-cols-1 gap-16">
                             <div className="bg-bg-base/30 border-4 border-border-default/40 p-10 hover:border-text-accent/20 transition-all duration-700 shadow-inner group/section relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[9px] font-black italic">BLOCK_0x01_ADMIN</div>
                                 <AdminSection 
                                    formData={formData} 
                                    handleChange={handleChange} 
                                    catalogs={catalogs} 
                                    categorias={categorias} 
                                    canEditCatalogs={canEditCatalogs} 
                                    handleOpenCatalogModal={handleOpenCatalogModal} 
                                 />
                             </div>

                             <div className="bg-bg-base/30 border-4 border-border-default/40 p-10 hover:border-text-accent/20 transition-all duration-700 shadow-inner group/section relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[9px] font-black italic">BLOCK_0x02_HOLDER</div>
                                 <FuncionarioSection 
                                    formData={formData} 
                                    showFuncionario={showFuncionario} 
                                    setShowFuncionario={setShowFuncionario} 
                                 />
                             </div>

                             <div className="bg-bg-base/30 border-4 border-border-default/40 p-10 hover:border-text-accent/20 transition-all duration-700 shadow-inner group/section relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[9px] font-black italic">BLOCK_0x03_EQUIP</div>
                                 <EquipoSection 
                                    formData={formData} 
                                    handleChange={handleChange} 
                                    handleUpperChange={handleUpperChange} 
                                    catalogs={catalogs} 
                                    canEditCatalogs={canEditCatalogs} 
                                    handleOpenCatalogModal={handleOpenCatalogModal} 
                                 />
                             </div>

                             <div className="bg-bg-base/30 border-4 border-border-default/40 p-10 hover:border-text-accent/20 transition-all duration-700 shadow-inner group/section relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[9px] font-black italic">BLOCK_0x04_PAYLOAD</div>
                                 <CompraGarantiaSection 
                                    formData={formData} 
                                    handleChange={handleChange} 
                                    handleImageChange={handleImageChange} 
                                    preview={preview} 
                                    showCompraGarantia={showCompraGarantia} 
                                    setShowCompraGarantia={setShowCompraGarantia} 
                                 />
                             </div>
                        </div>

                        <div className="pt-12 flex flex-col sm:flex-row gap-10 border-t-8 border-border-default/50 relative overflow-hidden group/footer">
                            <div className="absolute top-0 left-0 w-full h-[4px] bg-bg-base/50"></div>
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-10 py-6 text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.6em] border-4 border-border-strong hover:border-text-accent transition-all bg-bg-base/60 shadow-2xl active:scale-95 group/discard relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                     <span className="group-hover/discard:-translate-x-3 transition-transform opacity-30 group-hover:opacity-100">&larr;</span> 
                                     [ DISCARD_PROC_TX ]
                                </span>
                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/discard:opacity-100 transition-opacity"></div>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-14 py-6 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_20px_80px_rgba(var(--text-primary),0.3)] hover:shadow-[0_30px_100px_rgba(var(--text-accent),0.4)] disabled:opacity-20 uppercase tracking-[0.8em] hover:scale-105 active:scale-90 group/commit relative overflow-hidden"
                            >
                                {loading ? (
                                    <span className="relative z-10 flex items-center justify-center gap-8">
                                         <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                         TX_SYNCING... 
                                    </span>
                                ) : (
                                    <span className="relative z-10 flex items-center justify-center gap-8">
                                         [ EXECUTE_COMMIT_RX ]
                                         <span className="opacity-20 group-hover/commit:opacity-100 group-hover/commit:translate-x-4 transition-all font-normal">&rsaquo;&rsaquo;</span>
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/commit:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                        {/* Final graphical parity detail */}
                        <div className="text-center opacity-10 text-[8px] font-black uppercase tracking-[2em] pt-8 group-hover/footer:opacity-30 transition-opacity italic">CORE_IDENT_CONTROLLER_v4.2 // TOLIMA_NODE_TX</div>
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
