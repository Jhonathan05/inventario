import React from 'react';
import { SectionHeader, Field, inputCls } from './Shared';

const FuncionarioSection = ({ formData, showFuncionario, setShowFuncionario }) => (
    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
        <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Información del Funcionario" icon="👤" />
            <button 
                type="button"
                onClick={() => setShowFuncionario(!showFuncionario)}
                className="text-xs font-medium text-green-700 hover:text-green-800 bg-white px-2 py-1 rounded border border-green-200 shadow-sm transition-all"
            >
                {showFuncionario ? '▲ Contraer' : '▼ Expandir Detalle'}
            </button>
        </div>
        
        {showFuncionario ? (
            <>
                <p className="text-xs text-gray-500 mb-3 italic">Estos campos son informativos y se actualizan desde el módulo de Funcionarios.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Field label="Empresa Funcionario">
                        <input type="text" name="empresaFuncionario" value={formData.empresaFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <Field label="Empleado o Contratista">
                        <input type="text" name="tipoPersonal" value={formData.tipoPersonal} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <Field label="Cédula del Funcionario">
                        <input type="text" name="cedulaFuncionario" value={formData.cedulaFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <Field label="Shortname">
                        <input type="text" name="shortname" value={formData.shortname} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <div className="col-span-2">
                        <Field label="Nombres y Apellidos">
                            <input type="text" name="nombreFuncionario" value={formData.nombreFuncionario} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Departamento">
                        <input type="text" name="departamento" value={formData.departamento} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <Field label="Ciudad">
                        <input type="text" name="ciudad" value={formData.ciudad} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <div className="col-span-2">
                        <Field label="Cargo">
                            <input type="text" name="cargo" value={formData.cargo} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                        </Field>
                    </div>
                    <Field label="Área">
                        <input type="text" name="area" value={formData.area} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                    <Field label="Ubicación y Piso">
                        <input type="text" name="ubicacion" value={formData.ubicacion} readOnly disabled className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
                    </Field>
                </div>
            </>
        ) : (
            <p className="text-xs text-green-600 font-medium">{formData.nombreFuncionario || 'Sin asignar a funcionario'}</p>
        )}
    </div>
);

export default FuncionarioSection;
