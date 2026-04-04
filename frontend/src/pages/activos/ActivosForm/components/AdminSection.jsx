import React from 'react';
import SelectWithAdd from '../../../../components/SelectWithAdd';
import { SectionHeader, Field, inputCls } from './Shared';

const AdminSection = ({ formData, handleChange, catalogs, categorias, canEditCatalogs, handleOpenCatalogModal }) => (
    <div className="relative group/section transition-all duration-700">
        <div className="absolute -left-12 top-0 h-full w-1.5 bg-text-accent/20 group-hover/section:bg-text-accent transition-colors duration-1000"></div>
        <SectionHeader title="ADMIN_GOVERNANCE_IO" />
        
        <div className="flex items-center gap-10 mb-12 border-l-8 border-border-default/40 pl-8 bg-bg-base/20 py-4 shadow-inner">
             <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5">&alpha;</div>
             <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.5em] italic">CORE_ADMIN_METADATA_STREAM_RX</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <SelectWithAdd
                label="Entidad Propietaria"
                name="empresaPropietaria"
                value={formData.empresaPropietaria}
                onChange={handleChange}
                options={catalogs.EMPRESA_PROPIETARIA}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('EMPRESA_PROPIETARIA', 'Empresa Propietaria')}
            />
            <Field label="Unidad Dependencia_RX">
                <input type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} className={inputCls} placeholder="CORE_UNIT_TX..." />
            </Field>
            <SelectWithAdd
                label="Stream Recurso TX"
                name="fuenteRecurso"
                value={formData.fuenteRecurso}
                onChange={handleChange}
                options={catalogs.FUENTE_RECURSO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('FUENTE_RECURSO', 'Fuente de Recurso')}
            />
            <SelectWithAdd
                label="Tipo de Recurso RX"
                name="tipoRecurso"
                value={formData.tipoRecurso}
                onChange={handleChange}
                options={catalogs.TIPO_RECURSO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_RECURSO', 'Tipo de Recurso')}
            />
            <SelectWithAdd
                label="Protocolo Control"
                name="tipoControl"
                value={formData.tipoControl}
                onChange={handleChange}
                options={catalogs.TIPO_CONTROL}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_CONTROL', 'Tipo de Control')}
            />
            <SelectWithAdd
                label="Estado Operativo IO"
                name="estadoOperativo"
                value={formData.estadoOperativo}
                onChange={handleChange}
                options={catalogs.ESTADO_OPERATIVO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('ESTADO_OPERATIVO', 'Estado Operativo')}
            />
            <SelectWithAdd
                label="Razón del Status RX"
                name="razonEstado"
                value={formData.razonEstado}
                onChange={handleChange}
                options={catalogs.RAZON_ESTADO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('RAZON_ESTADO', 'Razón del Estado')}
            />
            <SelectWithAdd
                label="Category Manifest"
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
