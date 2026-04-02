import React from 'react';
import SelectWithAdd from '../../../../components/SelectWithAdd';
import { SectionHeader, Field, inputCls } from './Shared';

const EquipoSection = ({ formData, handleChange, handleUpperChange, catalogs, canEditCatalogs, handleOpenCatalogModal }) => (
    <div className="bg-bg-surface border border-border-default p-10 shadow-3xl hover:border-border-strong transition-all relative overflow-hidden group/section">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black">HARDWARE_SPEC_STREAM</div>
        <SectionHeader title="CARACTERISTICAS_DEL_EQUIPO" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <SelectWithAdd
                label="Tipo de Equipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={handleChange}
                options={catalogs.TIPO_EQUIPO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('TIPO_EQUIPO', 'Tipo de Equipo')}
            />
            <Field label="Serial" required>
                <input type="text" name="serial" required value={formData.serial} onChange={handleUpperChange} className={inputCls} placeholder="SN_0x..." />
            </Field>
            <Field label="Placa" required>
                <input type="text" name="placa" required value={formData.placa} onChange={handleUpperChange} className={inputCls} placeholder="P_IDENT..." />
            </Field>
            <Field label="Activo Fijo">
                <input type="text" name="activoFijo" value={formData.activoFijo} onChange={handleUpperChange} className={inputCls} placeholder="AF_TAG..." />
            </Field>
            <SelectWithAdd
                label="Marca"
                name="marca"
                required
                value={formData.marca}
                onChange={handleChange}
                options={catalogs.MARCA}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MARCA', 'Marca')}
            />
            <SelectWithAdd
                label="Modelo"
                name="modelo"
                required
                value={formData.modelo}
                onChange={handleChange}
                options={catalogs.MODELO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MODELO', 'Modelo')}
            />
            <Field label="Nombre de Equipo">
                <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={inputCls} placeholder="NODE_HOST_ID..." />
            </Field>
            <div className="lg:col-span-1">
                {/* Vacío o extra field */}
            </div>

            <div className="lg:col-span-2">
                <SelectWithAdd
                    label="Procesador"
                    name="procesador"
                    value={formData.procesador}
                    onChange={handleChange}
                    options={catalogs.PROCESADOR}
                    canAdd={canEditCatalogs}
                    onAdd={() => handleOpenCatalogModal('PROCESADOR', 'Procesador')}
                />
            </div>
            <SelectWithAdd
                label="Memoria RAM"
                name="memoriaRam"
                value={formData.memoriaRam}
                onChange={handleChange}
                options={catalogs.MEMORIA_RAM}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('MEMORIA_RAM', 'Memoria RAM')}
            />
            <SelectWithAdd
                label="Tamaño Disco Duro"
                name="discoDuro"
                value={formData.discoDuro}
                onChange={handleChange}
                options={catalogs.DISCO_DURO}
                canAdd={canEditCatalogs}
                onAdd={() => handleOpenCatalogModal('DISCO_DURO', 'Disco Duro')}
            />
            <div className="lg:col-span-2">
                <SelectWithAdd
                    label="Sistema Operativo"
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
