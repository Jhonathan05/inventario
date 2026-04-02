import { useState } from 'react';
import api from '../../../lib/axios';

const HojaVidaForm = ({ open, onClose, activoId }) => {
    const [formData, setFormData] = useState({
        tipo: 'MANTENIMIENTO',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('activoId', activoId);
            data.append('tipo', formData.tipo);
            data.append('descripcion', formData.descripcion);
            data.append('fecha', formData.fecha);
            if (file) {
                data.append('file', file);
            }

            await api.post('/hojavida', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onClose(true);
        } catch (err) {
            console.error('Error creating HojaVida:', err);
            const msg = err.response?.data?.error || err.message || 'Error desconocido al guardar';
            setError(`!! TRANSACTION_FAULT :: ${msg.toUpperCase()}`);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-6 text-center">
                {/* Backdrop Layer */}
                <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn" onClick={() => onClose(false)}></div>
                
                {/* Modal Container */}
                <div className="relative bg-bg-surface border-2 border-border-default p-12 text-left shadow-3xl w-full max-w-2xl z-10 overflow-hidden animate-fadeInUp">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">EVENT_COMMIT_LOG_STREAM_0x77</div>
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-10">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                                 <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.5em]">
                                     / register_event_stamp_tx
                                 </h3>
                            </div>
                            <p className="text-[11px] text-text-muted font-black mt-2 uppercase tracking-[0.3em] opacity-60 italic">BUFFER_POOL: chrono_logs_active.db // 0xAF44</p>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90">
                            [ &times; ]
                        </button>
                    </div>

                    {/* Error Feedback Area */}
                    {error && (
                        <div className="mb-10 p-6 border-2 border-text-accent bg-text-accent/5 text-text-accent font-black text-[11px] uppercase tracking-[0.4em] animate-pulse flex items-center gap-6 shadow-xl leading-relaxed">
                            <span className="text-2xl">!!</span>
                            <div>
                                <div>IO_STAMP_FAULT: {error}</div>
                                <div className="text-[8px] opacity-60 mt-1 uppercase tracking-widest">VALIDATE_PAYLOAD_INTEGRITY // RE-INITIALIZE_TX</div>
                            </div>
                        </div>
                    )}

                    {/* Event Form */}
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: EVENT_TYPE_CLASS</label>
                                <div className="relative group">
                                    <select
                                        name="tipo"
                                        className={inputCls}
                                        value={formData.tipo}
                                        onChange={handleChange}
                                    >
                                        <option value="MANTENIMIENTO">0xPREVENTIVE_MAINT</option>
                                        <option value="REPARACION">0xCORRECTIVE_REPAIR</option>
                                        <option value="SUMINISTRO">0xRESOURCE_SUPPLY</option>
                                        <option value="INSPECCION">0xDIAGNOSTIC_PROBE</option>
                                        <option value="ACTUALIZACION">0xSYSTEM_UPGRADE</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted opacity-40 pointer-events-none font-bold">&darr;</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: SEC_TIMESTAMP_RX</label>
                                <input type="date" name="fecha" required className={inputCls} value={formData.fecha} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: EVENT_DESCRIPTION_ENTRY *</label>
                            <textarea 
                                name="descripcion" 
                                required 
                                rows="5" 
                                className={`${inputCls} resize-none group-focus:border-text-accent`} 
                                value={formData.descripcion} 
                                onChange={handleChange} 
                                placeholder="LOG_EVENT_DETAILS_HERE... [ STRING_BUFFER_TX ]"
                            ></textarea>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: ATTACH_BINARY_EVIDENCE (OPT)</label>
                            <div className="bg-bg-base/40 p-8 border-2 border-dashed border-border-default/50 relative overflow-hidden group/file transition-all hover:bg-bg-base/60 hover:border-text-accent/30">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover/file:opacity-20 transition-opacity">BIN_RX_FIELD</div>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-[10px] text-text-muted font-black uppercase tracking-[0.2em] 
                                        file:mr-8 file:py-3 file:px-8 file:border-2 file:border-border-default file:bg-bg-elevated file:text-text-primary file:text-[10px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent hover:file:bg-bg-surface transition-all active:file:scale-95 shadow-xl" 
                                    accept=".jpg,.jpeg,.png,.pdf" 
                                />
                                <div className="mt-6 flex items-center justify-between opacity-40">
                                     <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">MAX_ALLOCATION: 0x5MB_LIMIT</p>
                                     <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">FORMATS: .JPG .PNG .PDF</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex flex-col sm:flex-row gap-8 border-t-2 border-border-default/20">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-10 py-5 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default hover:border-border-strong transition-all bg-bg-base shadow-xl active:scale-95"
                            >
                                [ DISCARD_PROC_TX ]
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-10 py-5 text-[12px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.6em] relative overflow-hidden group/exec active:scale-95"
                            >
                                {loading && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                                <span className="relative z-10">{loading ? '[ SYNCING_BUFFER... ]' : '[ EXECUTE_COMMIT_TX ]'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HojaVidaForm;
