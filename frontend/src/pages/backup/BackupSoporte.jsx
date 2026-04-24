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
        <div className="relative">
            {/* Efectos de fondo extra para resaltar el glassmorphism si se desea */}

            {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${status.type === 'success' ? 'bg-emerald-50/80 backdrop-blur-sm border-emerald-200 text-emerald-700' :
                    status.type === 'error' ? 'bg-red-50/80 backdrop-blur-sm border-red-200 text-red-700' :
                        'bg-blue-50/80 backdrop-blur-sm border-blue-200 text-blue-700'
                    }`}>
                    {status.type === 'success' ? <ShieldCheckIcon className="h-5 w-5 flex-shrink-0" /> :
                        status.type === 'error' ? <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" /> :
                            <CloudArrowUpIcon className="h-5 w-5 flex-shrink-0 animate-pulse" />
                    }
                    <p className="text-sm font-medium">{String(status.message)}</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
                {/* Export Card */}
                <div className="glass border-t-4 border-t-fnc-600 p-6 flex flex-col hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-fnc-50 to-fnc-100/50 rounded-xl text-fnc-600 shadow-sm border border-fnc-100">
                            <ArrowDownTrayIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-charcoal-800 tracking-tight">Exportar Datos</h2>
                    </div>
                    <p className="text-sm text-charcoal-500 mb-6 italic">
                        Genera archivos ZIP con los datos del sistema. Si los años pesan mucho, descarga historiales mensuales.
                    </p>

                    <ul className="text-xs text-charcoal-500 font-medium space-y-3 mb-8 flex-1">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">✔</span>
                            <span>Base de Datos PostgreSQL <span className="font-bold text-charcoal-700">(Siempre Completa)</span> para garantizar consistencia estructural.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">✔</span>
                            <span>Carpetas de Imágenes de Activos y Soportes (Filtrables por Fecha).</span>
                        </li>
                    </ul>

                    {/* Rango de Fechas */}
                    <div className="bg-white/50 p-4 rounded-xl border border-charcoal-100 mb-6 shadow-sm">
                        <p className="text-xs font-bold text-charcoal-700 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-fnc-500 inline-block" /> Filtro Opcional de Imágenes
                        </p>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs text-charcoal-500 mb-1.5 font-medium">Fecha Desde</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full text-sm rounded-lg bg-white/80 border-charcoal-200 px-3 py-2 focus:ring-fnc-500 focus:border-fnc-500 transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-charcoal-500 mb-1.5 font-medium">Fecha Hasta</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    min={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full text-sm rounded-lg bg-white/80 border-charcoal-200 px-3 py-2 focus:ring-fnc-500 focus:border-fnc-500 transition-colors"
                                />
                            </div>
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <div className="mt-3 p-2 bg-amber-50/80 border border-amber-100 rounded-lg">
                                <p className="text-[10px] text-amber-700 font-medium leading-tight">
                                    Atención: Se excluirán imágenes y soportes subidos fuera de este rango de tiempo para reducir el peso del archivo `.zip`.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-fnc-600 to-fnc-500 hover:from-fnc-700 hover:to-fnc-600 disabled:from-charcoal-300 disabled:to-charcoal-200 disabled:text-charcoal-500 text-white font-bold py-3 pt-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        {loading ? 'Preparando Compresión...' :
                            <><ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
                                {dateRange.start || dateRange.end ? 'Generar Respaldo Parcial' : 'Generar Pack Completo'}
                            </>}
                    </button>

                </div>

                {/* Import Card */}
                <div className="glass border-t-4 border-t-charcoal-700 p-6 flex flex-col hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-charcoal-50 to-charcoal-100 rounded-xl text-charcoal-700 shadow-sm border border-charcoal-200 relative z-10">
                            <ArrowUpTrayIcon className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-charcoal-800 tracking-tight relative z-10">Restauración Combinada</h2>
                    </div>
                    <p className="text-sm text-charcoal-500 mb-4 italic relative z-10">
                        Sube <strong>uno o varios archivos ZIP</strong> simultáneamente. El sistema extraerá e integrará todas las carpetas reconstruyendo el historial de uploads.
                    </p>

                    <div className="bg-gradient-to-br from-red-50/90 to-amber-50/90 backdrop-blur-md border border-red-200/50 p-4 rounded-xl flex gap-3 items-start mb-6 shadow-sm relative z-10">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600 shrink-0 drop-shadow-sm mt-0.5" />
                        <p className="text-[11px] text-red-900 leading-relaxed font-medium">
                            <span className="font-extrabold uppercase tracking-wide block mb-0.5">Advertencia Destructiva:</span>
                            La base de datos viva actual será eliminada irrecuperablemente y reemplazada por el SQL del archivo con fecha más reciente entre los ZIP cargados.
                        </p>
                    </div>

                    <form onSubmit={handleImport} className="space-y-4 flex-1 flex flex-col relative z-10">
                        {/* Dropzone modernizada */}
                        {!selectedFiles.length ? (
                            <div className="relative border-2 border-dashed border-charcoal-300/60 rounded-xl p-8 text-center hover:border-fnc-400 hover:bg-fnc-50/30 transition-all bg-white/40 flex-1 flex flex-col justify-center items-center group">
                                <input
                                    type="file"
                                    accept=".zip"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={importLoading}
                                />
                                <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <DocumentDuplicateIcon className="h-6 w-6 text-fnc-500" />
                                </div>
                                <div className="text-sm text-charcoal-700 font-bold tracking-tight">
                                    Haz clic o arrastra los `.zip`
                                </div>
                                <span className="text-xs text-charcoal-400 font-medium mt-1">Soporta selección de múltiples volúmenes</span>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-[140px]">
                                <div className="max-h-40 overflow-y-auto border border-charcoal-200/60 rounded-xl bg-white/60 backdrop-blur-sm p-2 flex-1 shadow-inner">
                                    <div className="text-xs font-bold text-charcoal-500 mb-2 pl-2 uppercase tracking-wider py-1 border-b border-charcoal-100">
                                        Volúmenes en cola ({selectedFiles.length}):
                                    </div>
                                    <ul className="space-y-1.5 p-1">
                                        {selectedFiles.map((f, idx) => (
                                            <li key={idx} className="flex justify-between items-center text-xs bg-white border border-charcoal-100 shadow-sm px-3 py-2 rounded-lg group">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="text-[10px] bg-charcoal-100 text-charcoal-600 font-bold px-1.5 py-0.5 rounded">ZIP</span>
                                                    <span className="truncate flex-1 font-medium text-charcoal-700" title={f.name}>{f.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
                                                >✖</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedFiles([])}
                                    className="mt-2 text-xs text-center font-medium text-fnc-600 hover:text-fnc-700"
                                >
                                    Vaciar y subir otros archivos
                                </button>
                            </div>
                        )}

                        {selectedFiles.length > 0 && !confirmRestore && (
                            <button
                                type="button"
                                onClick={() => setConfirmRestore(true)}
                                className="w-full mt-auto py-3 pt-3.5 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
                            >
                                Verificar Integridad de Archivos
                            </button>
                        )}

                        {confirmRestore && (
                            <div className="mt-auto animate-slide-up">
                                <button
                                    type="submit"
                                    disabled={importLoading}
                                    className="w-full relative overflow-hidden flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 pt-3.5 px-4 rounded-xl transition-all shadow-md mt-2"
                                >
                                    {importLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            REESCRIBIENDO HISTORIAL...
                                        </span>
                                    ) : (
                                        <>🔥 CONFIRMAR SOBRESCRITURA TOTAL</>
                                    )}
                                    {/* Peligro stripes background pattern CSS inline simple */}
                                    {!importLoading && <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmRestore(false)}
                                    className="w-full mt-3 py-1 text-xs font-bold text-charcoal-400 hover:text-charcoal-600 transition-colors"
                                >
                                    Abortar Operación Rápido
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
