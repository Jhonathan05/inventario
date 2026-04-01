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
        <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
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
