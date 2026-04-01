import React from 'react';
import SelectWithAdd from '../../../../components/SelectWithAdd';
import { SectionHeader, Field, inputCls } from './Shared';

const EquipoSection = ({ formData, handleChange, handleUpperChange, catalogs, canEditCatalogs, handleOpenCatalogModal }) => (
    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
        <SectionHeader title="Características del Equipo" icon="💻" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <input type="text" name="serial" required value={formData.serial} onChange={handleUpperChange} className={inputCls} />
            </Field>
            <Field label="Placa" required>
                <input type="text" name="placa" required value={formData.placa} onChange={handleUpperChange} className={inputCls} />
            </Field>
            <Field label="Activo Fijo">
                <input type="text" name="activoFijo" value={formData.activoFijo} onChange={handleUpperChange} className={inputCls} />
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
                <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={inputCls} />
            </Field>
            <div className="col-span-2 lg:col-span-4">
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
            <div className="col-span-2">
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
