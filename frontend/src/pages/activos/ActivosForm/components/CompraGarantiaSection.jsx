import React from 'react';
import { SectionHeader, Field, inputCls } from './Shared';

const calcYearsOfUse = (fechaCompraStr) => {
    if (!fechaCompraStr) return null;
    const compra = new Date(fechaCompraStr);
    const now = new Date();
    const diff = now - compra;
    if (diff < 0) return null;
    const years = (diff / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
    return `${years} años`;
};

const CompraGarantiaSection = ({ formData, handleChange, handleImageChange, preview, showCompraGarantia, setShowCompraGarantia }) => {
    const tiempoUso = calcYearsOfUse(formData.fechaCompra);

    return (
        <div className="relative group/section transition-all duration-700">
            <div className="absolute -left-12 top-0 h-full w-1.5 bg-text-accent/20 group-hover/section:bg-text-accent transition-colors duration-1000"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 mb-12 pb-10 border-b-4 border-border-default shadow-sm">
                <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-text-accent animate-pulse">[ &gt;TX ]</span>
                    <h4 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] leading-none">PROCUREMENT_AND_WARRANTY_LOG</h4>
                </div>
                <button 
                    type="button"
                    onClick={() => setShowCompraGarantia(!showCompraGarantia)}
                    className="text-[11px] font-black uppercase tracking-[0.4em] border-2 border-border-strong px-8 py-3 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/50 shadow-xl active:scale-95 group/btn"
                >
                    {showCompraGarantia ? '[ - ] COLLAPSE_PROC_PROTO' : '[ + ] EXPAND_PROCUREMENT_DETAIL_RX'}
                </button>
            </div>
            
            <div className="flex items-center gap-10 mb-12 border-l-8 border-border-default/40 pl-8 bg-bg-base/20 py-4 shadow-inner">
                 <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5">&omega;</div>
                 <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.5em] italic">FINAL_PAYLOAD_IMAGE_BUFFER_RX</p>
            </div>
            
            {showCompraGarantia && (
                <div className="animate-fadeIn space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        <Field label="TX_DATE_PURCHASE">
                            <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="WARRANTY_EXP_RX">
                            <input type="date" name="garantiaHasta" value={formData.garantiaHasta} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="TIME_IN_NODE_TX">
                            <div className={`${inputCls} bg-bg-elevated/20 text-text-accent font-black italic border-dashed opacity-80 flex items-center gap-4`}>
                                <span className="opacity-20">&gt;</span> {tiempoUso || 'NULL_BUFFER_ACK'}
                            </div>
                        </Field>
                        <Field label="ACQUISITION_VAL_0x">
                            <input type="number" name="valorCompra" value={formData.valorCompra} onChange={handleChange} className={inputCls} placeholder="0.00..." />
                        </Field>
                    </div>

                    <Field label="LOG_OPS_MANIFEST_METADATA_NOTES">
                        <textarea name="observaciones" rows="4" value={formData.observaciones} onChange={handleChange} className={`${inputCls} resize-none italic font-mono`} placeholder="CAPTURE_SYSTEM_LOG_DETAILS_RX..."></textarea>
                    </Field>

                    <Field label="VISUAL_NODE_TRACE_IMAGE_BUFF">
                        <div className="flex flex-wrap items-center gap-10 mt-6 bg-bg-base/40 p-10 border-4 border-border-default/30 shadow-inner group/imgarea">
                            {preview && (
                                <div className="relative group/img shadow-[0_30px_70px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500">
                                    <div className="absolute -top-4 -right-4 z-20 bg-text-accent text-bg-base text-[9px] px-3 py-1 font-black uppercase tracking-widest shadow-2xl animate-pulse">LIVE_BUFF_RX</div>
                                    <img src={preview} alt="Preview" className="h-32 w-32 object-cover border-4 border-border-strong group-hover/img:border-text-accent transition-all duration-700" />
                                    <div className="absolute inset-0 bg-text-accent/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            )}
                            <div className="flex-1 min-w-[280px] space-y-6">
                                <div className="relative overflow-hidden group/file">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                        className="w-full text-[11px] text-text-muted font-black uppercase tracking-[0.3em] 
                                            file:mr-10 file:py-4 file:px-10 file:border-4 file:border-border-strong file:bg-bg-elevated file:text-text-primary file:text-[11px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent hover:file:text-text-accent file:transition-all active:file:scale-95" 
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-[9px] text-text-muted font-black uppercase tracking-[0.5em] opacity-40 italic border-t-2 border-border-default/20 pt-6">
                                     <span className="text-text-accent opacity-50 font-black">::</span> SUPPORTED_NODE_TYPES: [.JPG, .PNG, .WEBP] // MAX_SEGMENT: 5MB
                                </div>
                            </div>
                        </div>
                    </Field>
                </div>
            )}
        </div>
    );
};

export default CompraGarantiaSection;
