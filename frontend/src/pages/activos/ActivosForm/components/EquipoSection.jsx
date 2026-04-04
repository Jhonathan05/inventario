import React from 'react';
import SelectWithAdd from '../../../../components/SelectWithAdd';
import { SectionHeader, Field, inputCls } from './Shared';

const EquipoSection = ({ formData, handleChange, handleUpperChange, catalogs, canEditCatalogs, handleOpenCatalogModal }) => (
    <div className="relative group/section transition-all duration-700">
        <div className="absolute -left-12 top-0 h-full w-1.5 bg-text-accent/20 group-hover/section:bg-text-accent transition-colors duration-1000"></div>
        <SectionHeader title="TECHNICAL_HARDWARE_NODE_SPECS" />
        
        <div className="flex items-center gap-10 mb-12 border-l-8 border-border-default/40 pl-8 bg-bg-base/20 py-4 shadow-inner">
             <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5">&tau;</div>
             <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.5em] italic">HARDWARE_SPEC_MATRIX_PROTOCOL_RX</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <SelectWithAdd
                label="Tipo de Equipo RX"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                options={catalogs.TIPO_EQUIPO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_EQUIPO', 'Tipo de Equipo')}
            />
            <Field label="Serial_SN_IO" required>
                <input type="text" name="serial" required value={formData.serial} onChange={handleUpperChange} className={inputCls} placeholder="SN_0x..." />
            </Field>
            <Field label="Ident_Placa_TX" required>
                <input type="text" name="placa" required value={formData.placa} onChange={handleUpperChange} className={inputCls} placeholder="P_IDENT..." />
            </Field>
            <Field label="Activo Fijo Tag">
                <input type="text" name="activoFijo" value={formData.activoFijo} onChange={handleUpperChange} className={inputCls} placeholder="AF_TAG_v4..." />
            </Field>
            <SelectWithAdd
                label="Marca Domain"
                name="marca"
                required
                value={formData.marca}
                onChange={handleChange}
                options={catalogs.MARCA}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MARCA', 'Marca')}
            />
            <SelectWithAdd
                label="Modelo Block"
                name="modelo"
                required
                value={formData.modelo}
                onChange={handleChange}
                options={catalogs.MODELO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MODELO', 'Modelo')}
            />
            <Field label="Nombre Node Host ID">
                <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={inputCls} placeholder="NODE_HOST_TX..." />
            </Field>
            <div className="lg:col-span-1 hidden lg:block">
                 <div className="h-full border-l-2 border-border-default/20 border-dashed opacity-20"></div>
            </div>

            <div className="lg:col-span-2">
                <SelectWithAdd
                    label="Procesador Core Unit"
                    name="procesador"
                    value={formData.procesador}
                    onChange={handleChange}
                    options={catalogs.PROCESADOR}
                    canAdd={canEditCatalogs}
                    onAdd={() => handleOpenCatalogModal('PROCESADOR', 'Procesador')}
                />
            </div>
            <SelectWithAdd
                label="Memoria RAM_RX"
                name="memoriaRam"
                value={formData.memoriaRam}
                onChange={handleChange}
                options={catalogs.MEMORIA_RAM}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MEMORIA_RAM', 'Memoria RAM')}
            />
            <SelectWithAdd
                label="Storage_Volume_TX"
                name="discoDuro"
                value={formData.discoDuro}
                onChange={handleChange}
                options={catalogs.DISCO_DURO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('DISCO_DURO', 'Disco Duro')}
            />
            <div className="lg:col-span-2">
                <SelectWithAdd
                    label="System_Core_OS_v4"
                    name="sistemaOperativo"
                    value={formData.sistemaOperativo}
                    onChange={handleChange}
                    options={catalogs.SISTEMA_OPERATIVO}
                    canAdd={canEditCatalogs}
                    onAdd={() => handleOpenCatalogModal('SISTEMA_OPERATIVO', 'Sistema Operativo')}
                />
            </div>
        </div>
    </div>
);

export default EquipoSection;
