import { useState } from 'react';
import api from '../../lib/axios';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ShieldCheckIcon, ExclamationTriangleIcon, CloudArrowUpIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const BackupSoporte = () => {
    const [loading, setLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [confirmRestore, setConfirmRestore] = useState(false);

    // Estados para Rangos y Múltiples Archivos
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleExport = async () => {
        try {
            setLoading(true);
            const isPartial = dateRange.start || dateRange.end;
            setStatus({ message: isPartial ? 'Generando paquete parcial filtrando imágenes...' : 'Generando paquete de respaldo total...', type: 'info' });

            const params = new URLSearchParams();
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            const response = await api.get(`/respaldo/export?${params.toString()}`, {
                responseType: 'blob',
                timeout: 300000 // 5 min para DB grande/Archivos pesados
            });

            // Crear link de descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            const prefix = isPartial ? 'BACKUP_PARCIAL' : 'BACKUP_TOTAL';
            link.setAttribute('download', `${prefix}_FNC_${timestamp}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setStatus({ message: `Backup descargado exitosamente.`, type: 'success' });
            setDateRange({ start: '', end: '' }); // Limpiar formulario
        } catch (err) {
            console.error('Error exportando:', err);
            setStatus({ message: 'Error al generar el backup.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
            setConfirmRestore(false);
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        try {
            setImportLoading(true);
            setStatus({ message: `Restaurando sistema uniendo ${selectedFiles.length} archivo(s)... Por favor NO CIERRE ESTA VENTANA.`, type: 'info' });

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('backups', file); // Importante: 'backups' (plural) según el multer config
            });

            const res = await api.post('/respaldo/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 300000 // 5 minutos de espera para evitar cortes
            });

            setStatus({ message: res.data.message, type: 'success' });
            setSelectedFiles([]);
            setConfirmRestore(false);

            // Sugerir recarga
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (err) {
            console.error('Error importando:', err);
            setStatus({
                message: err.response?.data?.message || 'Error crítico durante la restauración.',
                type: 'error'
            });
        } finally {
            setImportLoading(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-charcoal-800">Copia de Seguridad y Soporte</h1>
                <p className="text-charcoal-500 mt-1">Gestión de respaldos para recuperación ante desastres y migración de servidor.</p>
            </div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                        status.type === 'error' ? 'bg-fnc-50 border-fnc-200 text-fnc-700' :
                            'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                    {status.type === 'success' ? <ShieldCheckIcon className="h-5 w-5" /> :
                        status.type === 'error' ? <ExclamationTriangleIcon className="h-5 w-5" /> :
                            <CloudArrowUpIcon className="h-5 w-5 animate-pulse" />
                    }
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Export Card */}
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-fnc-600">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-fnc-100 rounded-lg text-fnc-700">
                            <ArrowDownTrayIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-charcoal-800">Exportar Datos</h2>
                    </div>
                    <p className="text-sm text-charcoal-500 mb-6 italic">
                        Genera archivos ZIP con los datos del sistema. Si los años pesan mucho, descarga historiales mensuales.
                    </p>

                    <ul className="text-xs text-charcoal-400 space-y-2 mb-6">
                        <li className="flex items-center gap-2">✅ Base de Datos <span className="font-bold">(Siempre Completa)</span> para consistencia</li>
                        <li className="flex items-center gap-2">✅ Carpetas de Imágenes (Filtrables por Fecha)</li>
                    </ul>

                    {/* Rango de Fechas */}
                    <div className="bg-charcoal-50 p-4 rounded-lg border border-charcoal-100 mb-6">
                        <p className="text-xs font-bold text-charcoal-700 mb-3">Filtro Opcional de Imágenes (Rango Mensual)</p>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-charcoal-500 mb-1">Desde</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full text-sm rounded bg-white border-charcoal-200 px-2 py-1"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-charcoal-500 mb-1">Hasta</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    min={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full text-sm rounded bg-white border-charcoal-200 px-2 py-1"
                                />
                            </div>
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <p className="text-[10px] text-fnc-600 mt-2 font-medium">
                                Atención: Excluirá imágenes y archivos fuera de este rango de tiempo para hacer un archivo más liviano.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-fnc-600 hover:bg-fnc-700 disabled:bg-fnc-300 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
                    >
                        {loading ? 'Generando ZIP...' :
                            <><ArrowDownTrayIcon className="h-5 w-5" />
                                {dateRange.start || dateRange.end ? 'Descargar Respaldo Parcial' : 'Descargar Todo-Completo'}
                            </>}
                    </button>

                </div>

                {/* Import Card */}
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-charcoal-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-charcoal-100 rounded-lg text-charcoal-700">
                            <ArrowUpTrayIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-charcoal-800">Restauración Combinada</h2>
                    </div>
                    <p className="text-sm text-charcoal-500 mb-4 italic">
                        Cargue <strong>uno o varios archivos ZIP</strong> al mismo tiempo. El sistema los unirá para recrear el historial completo.
                    </p>

                    <div className="bg-fnc-50 border border-fnc-100 p-3 rounded-lg flex gap-2 items-start mb-6">
                        <ExclamationTriangleIcon className="h-10 w-10 text-fnc-600 shrink-0" />
                        <p className="text-[11px] text-fnc-800 leading-normal">
                            <span className="font-bold underline uppercase">ADVERTENCIA CRÍTICA:</span> Esta acción es destructiva.
                            La base de datos actual será borrada y reemplazada por la BD del archivo "Más Reciente" entre los que suba.
                        </p>
                    </div>

                    <form onSubmit={handleImport} className="space-y-4 flex-1 flex flex-col">
                        <div className="relative border-2 border-dashed border-charcoal-200 rounded-lg p-6 text-center hover:border-fnc-300 transition-colors bg-charcoal-50 flex-1 flex flex-col justify-center items-center">
                            <input
                                type="file"
                                accept=".zip"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={importLoading}
                            />
                            <DocumentDuplicateIcon className="h-8 w-8 text-charcoal-300 mb-2" />
                            <div className="text-sm text-charcoal-600 font-medium">
                                Arrastra varios archivos .zip aquí
                            </div>
                            <span className="text-xs text-charcoal-400 mt-1">O haz clic para explorar</span>
                        </div>

                        {/* File list preview */}
                        {selectedFiles.length > 0 && (
                            <div className="max-h-32 overflow-y-auto border border-charcoal-100 rounded bg-white p-2">
                                <div className="text-xs font-bold text-charcoal-600 mb-2 pl-1 shadow-sm">
                                    {selectedFiles.length} archivo(s) preparado(s) para fusión:
                                </div>
                                <ul className="space-y-1">
                                    {selectedFiles.map((f, idx) => (
                                        <li key={idx} className="flex justify-between items-center text-xs bg-charcoal-50 px-2 py-1 rounded">
                                            <span className="truncate flex-1" title={f.name}>📄 {f.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="text-fnc-500 hover:text-fnc-700 ml-2"
                                            >✖</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedFiles.length > 0 && !confirmRestore && (
                            <button
                                type="button"
                                onClick={() => setConfirmRestore(true)}
                                className="w-full py-2.5 text-sm font-bold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Validar para Restauración Múltiple
                            </button>
                        )}

                        {confirmRestore && (
                            <div className="animate-pulse">
                                <button
                                    type="submit"
                                    disabled={importLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
                                >
                                    {importLoading ? 'FUSIONANDO...' : '🔥 INICIAR SOBRESCRITURA TOTAL'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmRestore(false)}
                                    className="w-full mt-2 py-1 text-xs font-bold text-charcoal-400 hover:underline"
                                >
                                    Cancelar Operación
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BackupSoporte;
