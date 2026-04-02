import React from 'react';
import { SectionHeader, Field, inputCls } from './Shared';

const FuncionarioSection = ({ formData, showFuncionario, setShowFuncionario }) => (
    <div className="bg-bg-surface border border-border-default p-10 shadow-3xl hover:border-border-strong transition-all relative overflow-hidden group/section">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black">HOLDER_METADATA_STREAM</div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-6 border-b border-border-default/30">
            <div className="flex items-center gap-4">
                <span className="text-xl font-black text-text-primary">[ &gt;TX ]</span>
                <h4 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">INFORMACION_DEL_FUNCIONARIO</h4>
            </div>
            <button 
                type="button"
                onClick={() => setShowFuncionario(!showFuncionario)}
                className="text-[10px] font-black uppercase tracking-[0.3em] border border-border-default px-6 py-2 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/30 shadow-xl"
            >
                {showFuncionario ? '[ - ] COLLAPSE_PROTO' : '[ + ] EXPAND_HOLDER_DETAIL'}
            </button>
        </div>
        
        {showFuncionario ? (
            <div className="animate-fadeIn">
                <p className="text-[9px] text-text-accent mb-8 uppercase tracking-[0.2em] font-black bg-text-accent/5 p-4 border border-text-accent/20">
                    !! READONLY_NODE_ACCESS :: DATA_MANAGED_BY_EXTERNAL_HR_MODULE_01
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <Field label="Empresa Funcionario">
                        <input type="text" name="empresaFuncionario" value={formData.empresaFuncionario} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <Field label="Empleado o Contratista">
                        <input type="text" name="tipoPersonal" value={formData.tipoPersonal} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <Field label="Cédula del Funcionario">
                        <input type="text" name="cedulaFuncionario" value={formData.cedulaFuncionario} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <Field label="Shortname">
                        <input type="text" name="shortname" value={formData.shortname} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <div className="lg:col-span-2">
                        <Field label="Nombres y Apellidos">
                            <input type="text" name="nombreFuncionario" value={formData.nombreFuncionario} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Departamento">
                        <input type="text" name="departamento" value={formData.departamento} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <Field label="Ciudad">
                        <input type="text" name="ciudad" value={formData.ciudad} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <div className="lg:col-span-2">
                        <Field label="Cargo">
                            <input type="text" name="cargo" value={formData.cargo} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Área">
                        <input type="text" name="area" value={formData.area} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                    <Field label="Ubicación y Piso">
                        <input type="text" name="ubicacion" value={formData.ubicacion} readOnly disabled className={`${inputCls} bg-bg-base/30 text-text-muted border-dashed opacity-50 cursor-not-allowed`} />
                    </Field>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-6 animate-fadeIn">
                <span className="text-text-accent text-xl font-black">&gt;&gt;</span>
                <p className="text-[12px] text-text-primary font-black uppercase tracking-[0.4em] animate-pulse">
                    {formData.nombreFuncionario || 'NULL_ASSIGNMENT_HOLDER'}
                </p>
            </div>
        )}
    </div>
);

export default FuncionarioSection;
