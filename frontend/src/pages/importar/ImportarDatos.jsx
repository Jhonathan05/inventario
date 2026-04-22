import { useState, useRef } from 'react';
import api from '../../lib/axios';

const TABS = [
    { key: 'activos', label: '📦 Activos', color: 'indigo' },
    { key: 'funcionarios', label: '👤 Funcionarios', color: 'emerald' },
    { key: 'cmdb', label: '🔄 CMDB Unificada', color: 'fuchsia' },
];

const ESTADO_CLASSES = {
    CREADO: 'bg-green-100 text-green-800',
    ACTUALIZADO: 'bg-blue-100 text-blue-800',
    ERROR: 'bg-red-100 text-red-800',
};

const ESTADO_ICONS = { CREADO: '✅', ACTUALIZADO: '🔄', ERROR: '❌' };

const ImportarDatos = () => {
    const [tab, setTab] = useState('activos');
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const handleDescargarPlantilla = () => {
        // En ZimaOS VITE_API_URL puede estar indefinido, usar ruta relativa /api por defecto
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const url = `${baseUrl}/importar/plantilla/${tab}`;
        const link = document.createElement('a');
        link.href = url;

        let fileName = 'Plantilla.xlsx';
        if (tab === 'activos') fileName = 'Plantilla_Activos.xlsx';
        else if (tab === 'funcionarios') fileName = 'Plantilla_Funcionarios.xlsx';
        else if (tab === 'cmdb') fileName = 'Plantilla_CMDB.xlsx';

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleFileChange = (file) => {
        if (!file) return;
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('Por favor seleccione un archivo Excel (.xlsx o .xls)');
            return;
        }
        setArchivo(file);
        setResultado(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleImportar = async () => {
        if (!archivo) return;
        setLoading(true);
        setResultado(null);
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);
            const res = await api.post(`/importar/${tab}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResultado(res.data);
        } catch (err) {
            setResultado({ error: err.response?.data?.error || 'Error al procesar el archivo.' });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setArchivo(null);
        setResultado(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Importar Datos</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Cargue un archivo Excel para importar Activos o Funcionarios masivamente.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => { setTab(t.key); handleReset(); }}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key
                            ? 'border-indigo-600 text-indigo-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="space-y-6">

                {/* Paso 1: Descargar Plantilla */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">1</span>
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold text-gray-900 mb-1">Descargar la plantilla</h2>
                            <p className="text-sm text-gray-500 mb-3">
                                Descargue la plantilla Excel con las columnas exactas y una fila de ejemplo.
                                Complete sus datos respetando el orden y formato de las columnas.
                            </p>
                            <button
                                onClick={handleDescargarPlantilla}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                            >
                                ⬇️ Descargar Plantilla {tab === 'activos' ? 'Activos' : tab === 'funcionarios' ? 'Funcionarios' : 'CMDB'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Paso 2: Cargar Archivo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">2</span>
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold text-gray-900 mb-1">Cargar archivo Excel</h2>
                            <p className="text-sm text-gray-500 mb-3">
                                Seleccione o arrastre el archivo Excel completado.
                                Solo se aceptan archivos <code className="bg-gray-100 px-1 rounded">.xlsx</code>.
                            </p>

                            {/* Zona Drop */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver
                                    ? 'border-indigo-400 bg-indigo-50'
                                    : archivo
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                                    }`}
                            >
                                {archivo ? (
                                    <div>
                                        <div className="text-3xl mb-2">📄</div>
                                        <p className="font-medium text-green-700">{archivo.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {(archivo.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-3xl mb-2">📂</div>
                                        <p className="text-sm text-gray-600">
                                            Arrastre su archivo aquí o <span className="text-indigo-600 font-medium">haga clic para seleccionar</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Solo archivos .xlsx</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={(e) => handleFileChange(e.target.files[0])}
                            />

                            {/* Botones */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    disabled={!archivo || loading}
                                    onClick={handleImportar}
                                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Procesando...' : '⬆️ Importar'}
                                </button>
                                {archivo && (
                                    <button
                                        onClick={handleReset}
                                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                {resultado && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">📊 Resultados de la importación</h2>

                        {resultado.error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 text-sm">
                                {resultado.error}
                            </div>
                        ) : (
                            <>
                                {/* Resumen */}
                                {tab === 'cmdb' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                                        {[
                                            { label: 'Funcionarios Creados', value: resultado.resumen.funcionariosCreados, color: 'emerald' },
                                            { label: 'Funcionarios Act.', value: resultado.resumen.funcionariosActualizados, color: 'teal' },
                                            { label: 'Activos Creados', value: resultado.resumen.activosCreados, color: 'indigo' },
                                            { label: 'Activos Act.', value: resultado.resumen.activosActualizados, color: 'blue' },
                                            { label: 'Asignaciones Nuevas', value: resultado.resumen.asignacionesCreadas, color: 'fuchsia' },
                                            { label: 'Errores', value: resultado.resumen.errores, color: 'red' },
                                        ].map(s => (
                                            <div key={s.label} className={`rounded-lg p-3 text-center bg-${s.color}-50 border border-${s.color}-100`}>
                                                <div className={`text-xl font-bold text-${s.color}-700`}>{s.value}</div>
                                                <div className={`text-xs text-${s.color}-600 mt-0.5`}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                        {[
                                            { label: 'Total', value: resultado.resumen.total, color: 'gray' },
                                            { label: 'Creados', value: resultado.resumen.creados, color: 'green' },
                                            { label: 'Actualizados', value: resultado.resumen.actualizados, color: 'blue' },
                                            { label: 'Errores', value: resultado.resumen.errores, color: 'red' },
                                        ].map(s => (
                                            <div key={s.label} className={`rounded-lg p-3 text-center bg-${s.color}-50 border border-${s.color}-100`}>
                                                <div className={`text-2xl font-bold text-${s.color}-700`}>{s.value}</div>
                                                <div className={`text-xs text-${s.color}-600 mt-0.5`}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tabla de resultados por fila */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fila</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {resultado.resultados.map((r, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-2 text-gray-500">{r.fila}</td>
                                                    <td className="px-3 py-2">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CLASSES[r.estado]}`}>
                                                            {ESTADO_ICONS[r.estado]} {r.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-700">{r.mensaje}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportarDatos;
