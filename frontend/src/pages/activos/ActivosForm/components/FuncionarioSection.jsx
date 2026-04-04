import React from 'react';
import { SectionHeader, Field, inputCls } from './Shared';

const FuncionarioSection = ({ formData, showFuncionario, setShowFuncionario }) => (
    <div className="relative group/section transition-all duration-700">
        <div className="absolute -left-12 top-0 h-full w-1.5 bg-text-accent/20 group-hover/section:bg-text-accent transition-colors duration-1000"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 mb-12 pb-10 border-b-4 border-border-default shadow-sm">
            <div className="flex items-center gap-6">
                <span className="text-2xl font-black text-text-accent animate-pulse">[ &gt;TX ]</span>
                <h4 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] leading-none">HOLDER_ALLOCATION_MANIFEST</h4>
            </div>
            <button 
                type="button"
                onClick={() => setShowFuncionario(!showFuncionario)}
                className="text-[11px] font-black uppercase tracking-[0.4em] border-2 border-border-strong px-8 py-3 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/50 shadow-xl active:scale-95 group/btn"
            >
                {showFuncionario ? '[ - ] COLLAPSE_PROTO_LOG' : '[ + ] EXPAND_HOLDER_DETAIL_RX'}
            </button>
        </div>
        
        <div className="flex items-center gap-10 mb-12 border-l-8 border-border-default/40 pl-8 bg-bg-base/20 py-4 shadow-inner">
             <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5">&delta;</div>
             <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.5em] italic">ALLOCATED_NODE_HOLDER_UNITS_RX</p>
        </div>
        
        {showFuncionario ? (
            <div className="animate-fadeIn space-y-12">
                <div className="p-6 bg-text-accent/5 border-l-8 border-text-accent shadow-2xl relative overflow-hidden group/alert">
                    <div className="flex items-center gap-6">
                         <span className="text-2xl text-text-accent animate-bounce font-black">!!</span>
                         <p className="text-[11px] text-text-accent uppercase tracking-[0.3em] font-black">
                            READONLY_NODE_ACCESS_PROTOCOL :: DATA_MANAGED_BY_EXTERNAL_HR_ENTITY_01
                         </p>
                    </div>
                    <div className="absolute top-0 right-0 p-2 opacity-10 text-[8px] font-black italic">INTEGRITY_SHIELD_ACTIVE</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <Field label="Empresa Holder_TX">
                        <input type="text" name="empresaFuncionario" value={formData.empresaFuncionario} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <Field label="Personal Category RX">
                        <input type="text" name="tipoPersonal" value={formData.tipoPersonal} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <Field label="Identity UID Core">
                        <input type="text" name="cedulaFuncionario" value={formData.cedulaFuncionario} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <Field label="Shortname ID">
                        <input type="text" name="shortname" value={formData.shortname} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <div className="lg:col-span-2">
                        <Field label="Full Holder Identity RX">
                            <input type="text" name="nombreFuncionario" value={formData.nombreFuncionario} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Geo Department">
                        <input type="text" name="departamento" value={formData.departamento} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <Field label="Geo Region_TX">
                        <input type="text" name="ciudad" value={formData.ciudad} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <div className="lg:col-span-2">
                        <Field label="Logical Position Role">
                            <input type="text" name="cargo" value={formData.cargo} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Functional Area RX">
                        <input type="text" name="area" value={formData.area} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                    <Field label="Physical Plot / Floor">
                        <input type="text" name="ubicacion" value={formData.ubicacion} readOnly disabled className={`${inputCls} bg-bg-elevated/20 text-text-muted border-dashed border-border-default/50 opacity-40 cursor-not-allowed`} />
                    </Field>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-10 animate-fadeIn p-8 bg-bg-base/30 border-2 border-dashed border-border-default/40 shadow-inner group/summary">
                <span className="text-text-accent text-3xl font-black group-hover:scale-125 transition-transform duration-700 opacity-40 group-hover:opacity-100">&gt;&gt;</span>
                <div className="flex flex-col gap-2">
                    <p className="text-[14px] text-text-primary font-black uppercase tracking-[0.5em] animate-pulse">
                        {formData.nombreFuncionario || 'NULL_ASSIGNMENT_HOLDER_TX'}
                    </p>
                    <div className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-30 italic">HOLDER_MANIFEST_SUMMARY_v4.2</div>
                </div>
            </div>
        )}
    </div>
);

export default FuncionarioSection;
