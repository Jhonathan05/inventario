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
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/80 border-border-default backdrop-blur-sm transition-opacity" onClick={() => onClose(false)}></div>

                <div className="relative inline-block align-top bg-bg-surface border border-border-default p-10 text-left shadow-3xl transform transition-all sm:my-8 sm:w-full sm:max-w-5xl z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black">ASSET_COMMIT_HOOK</div>
                    
                    <div className="flex items-center justify-between mb-10 border-b border-border-default pb-8">
                        <div>
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">
                                / {activo ? 'MODIFY_ASSET_NODE' : 'REGISTER_NEW_ASSET'}
                            </h3>
                            <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest opacity-60">REGISTRY_PATH: inventory.db // UID: {activo?.id?.slice(0,8) || 'NULL'}</p>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-2xl leading-none font-black transition-colors">
                            [ &times; ]
                        </button>
                    </div>

                    {error && (
                        <div className="mb-10 p-6 border border-text-accent bg-bg-base text-text-accent font-black text-[10px] uppercase tracking-widest animate-pulse shadow-xl">
                            ! CRITICAL_COMMIT_FAULT :: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-12 animate-fadeIn">
                        <AdminSection 
                            formData={formData} 
                            handleChange={handleChange} 
                            catalogs={catalogs} 
                            categorias={categorias} 
                            canEditCatalogs={canEditCatalogs} 
                            handleOpenCatalogModal={handleOpenCatalogModal} 
                        />

                        <FuncionarioSection 
                            formData={formData} 
                            showFuncionario={showFuncionario} 
                            setShowFuncionario={setShowFuncionario} 
                        />

                        <EquipoSection 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleUpperChange={handleUpperChange} 
                            catalogs={catalogs} 
                            canEditCatalogs={canEditCatalogs} 
                            handleOpenCatalogModal={handleOpenCatalogModal} 
                        />

                        <CompraGarantiaSection 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleImageChange={handleImageChange} 
                            preview={preview} 
                            showCompraGarantia={showCompraGarantia} 
                            setShowCompraGarantia={setShowCompraGarantia} 
                        />

                        <div className="pt-10 flex flex-col sm:flex-row gap-6 border-t border-border-default/50">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-8 py-4 text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.3em] border border-border-default hover:border-border-strong transition-all bg-bg-base/30 shadow-xl"
                            >
                                [ DISCARD_PROC ]
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-8 py-4 text-[11px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.4em]"
                            >
                                {loading ? '[ SYNCING... ]' : '[ EXECUTE_COMMIT ]'}
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
