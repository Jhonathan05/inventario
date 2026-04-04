import { useState } from 'react';
import api from '../lib/axios';

const CatalogModal = ({ open, onClose, domain, title, onSaveSuccess, isCategory = false }) => {
    const [nombre, setNombre] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        setSaving(true);
        setError('');
        try {
            let newVal;
            if (isCategory) {
                const res = await api.post('/categorias', { nombre: nombre.toUpperCase() });
                newVal = res.data;
            } else {
                const res = await api.post('/catalogos', {
                    dominio: domain,
                    valor: nombre.toUpperCase()
                });
                newVal = res.data;
            }
            onSaveSuccess(newVal);
            setNombre('');
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[10002] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 text-center">
                <div className="fixed inset-0 bg-black/70 transition-opacity backdrop-blur-sm" onClick={onClose}></div>

                <div className="relative w-[calc(100vw-1.5rem)] xs:w-80 sm:w-96 bg-bg-surface border-2 sm:border-4 border-border-default shadow-[0_40px_100px_rgba(0,0,0,0.8)] transform transition-all font-mono animate-slideUp overflow-hidden">
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b-2 border-border-default bg-bg-base">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-surface flex-shrink-0">+</div>
                            <h3 className="text-[11px] sm:text-[13px] font-black text-text-primary uppercase tracking-[0.3em] sm:tracking-[0.5em]">
                                AGREGAR_{title?.toUpperCase().replace(/ /g, '_') || 'ITEM'}
                            </h3>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-4 sm:mx-6 mt-4 p-3 border border-text-accent bg-text-accent/5 text-text-accent text-[11px] font-black uppercase tracking-widest">
                            ! {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-[10px] sm:text-[11px] font-black text-text-muted uppercase tracking-[0.4em] mb-2 sm:mb-3">:: NOMBRE / VALOR *</label>
                            <input
                                type="text"
                                autoFocus
                                required
                                className="block w-full bg-bg-base border-2 sm:border-4 border-border-default py-3 sm:py-4 px-4 sm:px-6 text-[12px] sm:text-[14px] font-black text-text-primary uppercase tracking-widest focus:border-text-accent focus:outline-none transition-all"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="INGRESE_VALOR..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2 sm:pt-4 border-t border-border-default/30">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-3 sm:py-4 bg-text-primary border-2 border-text-primary text-bg-base font-black text-[11px] sm:text-[12px] uppercase tracking-[0.3em] hover:bg-text-accent hover:border-text-accent transition-all disabled:opacity-30 active:scale-95"
                            >
                                {saving ? 'SAVING...' : '# GUARDAR'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 sm:py-4 bg-bg-base border-2 border-border-default text-text-muted font-black text-[11px] sm:text-[12px] uppercase tracking-[0.3em] hover:text-text-primary hover:border-text-primary transition-all active:scale-95"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CatalogModal;
