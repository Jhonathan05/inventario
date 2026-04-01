import React from 'react';
import SelectWithAdd from '../../../../components/SelectWithAdd';
import { SectionHeader, Field, inputCls } from './Shared';

const AdminSection = ({ formData, handleChange, catalogs, categorias, canEditCatalogs, handleOpenCatalogModal }) => (
    <div className="bg-indigo-50 rounded-lg p-4">
        <SectionHeader title="Administración del Equipo" icon="🏢" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SelectWithAdd
                label="Empresa Propietaria"
                name="empresaPropietaria"
                value={formData.empresaPropietaria}
                onChange={handleChange}
                options={catalogs.EMPRESA_PROPIETARIA}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('EMPRESA_PROPIETARIA', 'Empresa Propietaria')}
            />
            <Field label="Dependencia">
                <input type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} className={inputCls} />
            </Field>
            <SelectWithAdd
                label="Fuente de Recurso"
                name="fuenteRecurso"
                value={formData.fuenteRecurso}
                onChange={handleChange}
                options={catalogs.FUENTE_RECURSO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('FUENTE_RECURSO', 'Fuente de Recurso')}
            />
            <SelectWithAdd
                label="Tipo de Recurso"
                name="tipoRecurso"
                value={formData.tipoRecurso}
                onChange={handleChange}
                options={catalogs.TIPO_RECURSO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_RECURSO', 'Tipo de Recurso')}
            />
            <SelectWithAdd
                label="Administrado / Controlado"
                name="tipoControl"
                value={formData.tipoControl}
                onChange={handleChange}
                options={catalogs.TIPO_CONTROL}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_CONTROL', 'Tipo de Control')}
            />
            <SelectWithAdd
                label="Estado Operativo"
                name="estadoOperativo"
                value={formData.estadoOperativo}
                onChange={handleChange}
                options={catalogs.ESTADO_OPERATIVO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('ESTADO_OPERATIVO', 'Estado Operativo')}
            />
            <SelectWithAdd
                label="Razón del Estado"
                name="razonEstado"
                value={formData.razonEstado}
                onChange={handleChange}
                options={catalogs.RAZON_ESTADO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('RAZON_ESTADO', 'Razón del Estado')}
            />
            <SelectWithAdd
                label="Categoría"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                options={categorias}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('', 'Categoría', true)}
            />
        </div>
    </div>
);

export default AdminSection;
