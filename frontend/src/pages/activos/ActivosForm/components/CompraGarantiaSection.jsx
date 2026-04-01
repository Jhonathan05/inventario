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
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Compra y Garantía" icon="📅" />
                <button 
                    type="button"
                    onClick={() => setShowCompraGarantia(!showCompraGarantia)}
                    className="text-xs font-medium text-purple-700 hover:text-purple-800 bg-white px-2 py-1 rounded border border-purple-200 shadow-sm transition-all"
                >
                    {showCompraGarantia ? '▲ Contraer' : '▼ Expandir'}
                </button>
            </div>
            
            {showCompraGarantia && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Field label="Fecha de Compra">
                        <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Fin de Garantía">
                        <input type="date" name="garantiaHasta" value={formData.garantiaHasta} onChange={handleChange} className={inputCls} />
                    </Field>
                    <Field label="Tiempo de Uso">
                        <div className={`${inputCls} bg-gray-100 text-gray-600`}>
                            {tiempoUso || '—'}
                        </div>
                    </Field>
                    <Field label="Valor de Compra">
                        <input type="number" name="valorCompra" value={formData.valorCompra} onChange={handleChange} className={inputCls} />
                    </Field>
                    <div className="col-span-2 lg:col-span-4">
                        <Field label="Observaciones">
                            <textarea name="observaciones" rows="2" value={formData.observaciones} onChange={handleChange} className={inputCls}></textarea>
                        </Field>
                    </div>
                    <div className="col-span-2 lg:col-span-4">
                        <Field label="Imagen Principal">
                            <div className="flex items-center gap-4 mt-1">
                                {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded shadow" />}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        </Field>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompraGarantiaSection;
