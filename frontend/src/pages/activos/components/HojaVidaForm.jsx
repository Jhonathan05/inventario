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

    const inputCls = "block w-full bg-bg-base border-4 border-border-default py-6 px-10 text-[13px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)] active:scale-[0.99]";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono selection:bg-text-accent selection:text-bg-base" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-6 text-center">
                {/* Backdrop Layer */}
                <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn duration-500" onClick={() => onClose(false)}></div>
                
                {/* Modal Container */}
                <div className="relative bg-bg-surface border-4 border-border-default p-14 text-left shadow-[0_60px_150px_rgba(0,0,0,0.9)] w-full max-w-3xl z-10 overflow-hidden animate-fadeInUp group/modal hover:border-text-accent/30 transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.8em] italic">EVENT_COMMIT_LOG_STREAM_v4.2 // AF_TX</div>
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-16 border-b-4 border-border-default pb-12 relative">
                        <div className="flex items-center gap-8">
                             <div className="w-5 h-5 bg-text-accent animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.6)]"></div>
                             <div>
                                 <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.6em] leading-none mb-4">
                                     / register_event_stamp_tx
                                 </h3>
                                 <p className="text-[11px] text-text-muted font-black mt-2 uppercase tracking-[0.4em] opacity-40 italic">BUFFER_POOL: chrono_logs_active_v4 // node_tx_0xAF44</p>
                             </div>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90 p-4 bg-bg-base/30 border-2 border-transparent hover:border-border-default">
                            [ &times; ]
                        </button>
                    </div>

                    {/* Error Feedback Area */}
                    {error && (
                        <div className="mb-14 p-8 border-4 border-text-accent bg-text-accent/5 text-text-accent font-black text-[13px] uppercase tracking-[0.6em] animate-pulse flex items-center gap-10 shadow-[0_30px_70px_rgba(var(--text-accent),0.2)]">
                            <span className="text-4xl">!!</span>
                            <div>
                                <div className="mb-1">IO_STAMP_FAULT: {error}</div>
                                <div className="text-[10px] opacity-40 uppercase tracking-[0.5em] italic">VALIDATE_PAYLOAD_INTEGRITY // REINITIALIZE_TX_0xAF</div>
                            </div>
                        </div>
                    )}

                    {/* Event Form */}
                    <form onSubmit={handleSubmit} className="space-y-14 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: EVENT_TYPE_CLASS_TX</label>
                                <div className="relative group/sel">
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
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted opacity-40 pointer-events-none font-black text-xl group-hover/sel:text-text-accent transition-colors">&raquo;</div>
                                </div>
                            </div>

                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: SEC_TIMESTAMP_RX</label>
                                <input type="date" name="fecha" required className={inputCls} value={formData.fecha} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-6 group/field">
                            <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: EVENT_DESCRIPTION_ENTRY *</label>
                            <textarea 
                                name="descripcion" 
                                required 
                                rows="6" 
                                className={`${inputCls} resize-none group-focus:border-text-accent leading-relaxed italic`} 
                                value={formData.descripcion} 
                                onChange={handleChange} 
                                placeholder="LOG_EVENT_DETAILS_HERE... [ STRING_BUFFER_TX_RX_IO ]"
                            ></textarea>
                            <div className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-20 text-right">0x{formData.descripcion.length.toString(16).padStart(4, '0')}_HEX_BYTES</div>
                        </div>

                        <div className="space-y-6 group/field">
                            <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: ATTACH_BINARY_EVIDENCE_PAYLOAD</label>
                            <div className="bg-bg-base/40 p-12 border-4 border-dashed border-border-default/40 relative overflow-hidden group/file shadow-inner hover:bg-bg-base/60 hover:border-text-accent/20 transition-all duration-700">
                                <div className="absolute top-0 right-0 p-6 opacity-5 text-[10px] font-black uppercase tracking-tighter group-hover/file:opacity-20 transition-opacity">BINARY_RX_GATEWAY</div>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-[11px] text-text-muted font-black uppercase tracking-[0.3em] 
                                        file:mr-10 file:py-4 file:px-10 file:border-4 file:border-border-strong file:bg-bg-elevated file:text-text-primary file:text-[11px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent hover:file:bg-bg-surface transition-all active:file:scale-95 shadow-2xl" 
                                    accept=".jpg,.jpeg,.png,.pdf" 
                                />
                                <div className="mt-8 flex items-center justify-between opacity-30 italic">
                                     <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">MAX_ALLOC_VAL: 0x5MB_LIMIT</p>
                                     <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">FORMATS: [.JPG, .PNG, .PDF]</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 flex flex-col sm:flex-row gap-10 border-t-8 border-border-default/50 relative group/footer">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-12 py-6 text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.6em] border-4 border-border-strong hover:border-text-accent transition-all bg-bg-base/60 shadow-2xl active:scale-95 group/disc relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                     <span className="opacity-30 group-hover/disc:-translate-x-4 transition-transform">&larr;</span> [ DISCARD_PROC_TX ]
                                </span>
                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/disc:opacity-100 transition-opacity"></div>
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] px-14 py-6 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_20px_80px_rgba(var(--text-primary),0.3)] disabled:opacity-20 uppercase tracking-[0.8em] relative overflow-hidden group/exec active:scale-95"
                            >
                                {loading ? (
                                    <span className="relative z-10 flex items-center justify-center gap-8 animate-pulse italic">
                                         <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                         RX_SYNCING_LOG_BUFFER...
                                    </span>
                                ) : (
                                    <span className="relative z-10 flex items-center justify-center gap-8">
                                         [ EXECUTE_COMMIT_TX_AF22 ]
                                         <span className="opacity-20 group-hover/exec:translate-x-4 transition-all">&raquo;</span>
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/exec:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                        <div className="text-center opacity-10 text-[8px] font-black uppercase tracking-[2em] pt-8 italic group-hover/footer:opacity-30 transition-all">CORE_CHRONO_CONTROLLER_v4.2 // AF_TX</div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HojaVidaForm;
