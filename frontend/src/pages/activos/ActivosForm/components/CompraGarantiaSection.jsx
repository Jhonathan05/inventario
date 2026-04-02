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
        <div className="bg-bg-surface border border-border-default p-10 shadow-3xl hover:border-border-strong transition-all relative overflow-hidden group/section">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black">PROCUREMENT_METADATA_STREAM</div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-6 border-b border-border-default/30">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-text-primary">[ &gt;TX ]</span>
                    <h4 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">COMPRA_Y_GARANTIA</h4>
                </div>
                <button 
                    type="button"
                    onClick={() => setShowCompraGarantia(!showCompraGarantia)}
                    className="text-[10px] font-black uppercase tracking-[0.3em] border border-border-default px-6 py-2 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/30 shadow-xl"
                >
                    {showCompraGarantia ? '[ - ] COLLAPSE_PROTO' : '[ + ] EXPAND_PROCUREMENT_DETAIL'}
                </button>
            </div>
            
            {showCompraGarantia && (
                <div className="animate-fadeIn space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <Field label="Fecha de Compra">
                            <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="Fin de Garantía">
                            <input type="date" name="garantiaHasta" value={formData.garantiaHasta} onChange={handleChange} className={inputCls} />
                        </Field>
                        <Field label="Tiempo de Uso">
                            <div className={`${inputCls} bg-bg-base/30 text-text-muted italic border-dashed opacity-70`}>
                                &gt; {tiempoUso || 'NULL_BUFFER'}
                            </div>
                        </Field>
                        <Field label="Valor de Compra">
                            <input type="number" name="valorCompra" value={formData.valorCompra} onChange={handleChange} className={inputCls} placeholder="0x00..." />
                        </Field>
                    </div>

                    <Field label="Observaciones">
                        <textarea name="observaciones" rows="3" value={formData.observaciones} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="LOG_EVENT_DETAILS..."></textarea>
                    </Field>

                    <Field label="Imagen Principal">
                        <div className="flex flex-wrap items-center gap-8 mt-4 bg-bg-base/30 p-6 border border-border-default/50">
                            {preview && (
                                <div className="relative group/img shadow-2xl">
                                    <div className="absolute -top-3 -right-3 z-10 bg-text-accent text-bg-base text-[8px] px-2 py-0.5 font-black uppercase tracking-widest shadow-xl">LIVE_NODE</div>
                                    <img src={preview} alt="Preview" className="h-28 w-28 object-cover border-2 border-border-default group-hover/img:border-text-accent transition-all" />
                                </div>
                            )}
                            <div className="flex-1 min-w-[200px]">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="w-full text-[10px] text-text-muted font-black uppercase tracking-widest 
                                        file:mr-8 file:py-3 file:px-8 file:border file:border-border-default file:bg-bg-elevated file:text-text-primary file:text-[10px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent hover:file:text-text-accent transition-all" 
                                />
                                <p className="text-[8px] text-text-muted mt-4 font-black uppercase tracking-[0.2em] opacity-40">SUPPORTED_FORMATS: .JPG .PNG .WEBP // MAX_SEGMENT_SIZE: 5.0MB</p>
                            </div>
                        </div>
                    </Field>
                </div>
            )}
        </div>
    );
};

export default CompraGarantiaSection;
