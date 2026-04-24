import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cloud as CloudIcon, 
    Send as SendIcon, 
    Lock as LockIcon, 
    Save as SaveIcon, 
    AlertCircle, 
    CheckCircle2, 
    RefreshCw,
    CloudDownload,
    AlertTriangle,
    Database as DatabaseIcon,
    Activity as ActivityIcon,
    ChevronDown,
    X as CloseIcon,
    Timer as TimerIcon
} from 'lucide-react';

const ConfiguracionR2 = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ text: '', type: '' });
    
    // Config states
    const [config, setConfig] = useState({
        R2_ACCESS_KEY: '',
        R2_SECRET_KEY: '',
        R2_BUCKET_NAME: '',
        R2_ENDPOINT: '',
        TELEGRAM_TOKEN: '',
        TELEGRAM_CHAT_ID: '',
        BACKUP_ENCRYPTION_KEY: ''
    });
    const [fallbacks, setFallbacks] = useState({});

    // Backups list states
    const [backups, setBackups] = useState([]);
    const [loadingBackups, setLoadingBackups] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(null);
    const [encryptionKey, setEncryptionKey] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [restoringFile, setRestoringFile] = useState(null);

    // Diagnostics states
    const [diagnostics, setDiagnostics] = useState('');
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await fetchConfig();
        await fetchBackups();
    };

    const fetchConfig = async () => {
        try {
            const response = await api.get('/respaldo/config');
            setConfig(prev => ({ ...prev, ...response.data.config }));
            setFallbacks(response.data.fallbacks || {});
        } catch (err) {
            console.error('Error al cargar configuración:', err);
        }
    };

    const fetchBackups = async () => {
        try {
            setLoadingBackups(true);
            const response = await api.get('/respaldo/r2-list');
            setBackups(response.data.backups || []);
        } catch (err) {
            console.error('Error al cargar backups de R2:', err);
        } finally {
            setLoadingBackups(false);
        }
    };

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const response = await api.get('/respaldo/logs');
            setDiagnostics(response.data);
        } catch {
            setDiagnostics('Error al intentar recuperar los logs.');
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setStatus({ text: '', type: '' });
            const response = await api.patch('/respaldo/config', config);
            const syncMsg = response.data.propagated 
                ? ' Credenciales sincronizadas al servicio de backup.' 
                : ' ⚠️ No se pudo sincronizar al servicio de backup.';
            setStatus({ text: 'Configuración guardada exitosamente.' + syncMsg, type: 'success' });
            await fetchConfig();
        } catch (err) {
            setStatus({ text: 'Error al guardar la configuración.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleTestBackup = async () => {
        if (!confirm('¿Deseas iniciar una prueba de backup ahora? Esto puede tardar unos segundos.')) return;
        try {
            setTesting(true);
            const response = await api.post('/respaldo/trigger');
            setStatus({ 
                text: response.data.message || 'Instrucción enviada. Recibirás un mensaje en Telegram al finalizar.', 
                type: 'success' 
            });
        } catch (err) {
            setStatus({ text: 'Error al iniciar respaldo manual.', type: 'error' });
        } finally {
            setTesting(false);
        }
    };

    const handleRestore = async (filename) => {
        if (confirmText !== 'CONFIRMAR') return;
        try {
            setRestoringFile(filename);
            setShowRestoreModal(null);
            setStatus({ text: `Restaurando base de datos desde ${filename}... por favor, espere.`, type: 'info' });
            const response = await api.post('/respaldo/r2-restore', { filename, encryptionKey });
            setStatus({ text: 'Base de datos restaurada correctamente. Recarga la página.', type: 'success' });
            setTimeout(() => window.location.reload(), 3000);
        } catch (err) {
            setStatus({ text: err.response?.data?.message || 'Error durante la restauración', type: 'error' });
        } finally {
            setRestoringFile(null);
            setConfirmText('');
            setEncryptionKey('');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            
            {/* Lanzar Respaldo Manual */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl" style={{ background: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-ambient)' }}>
                <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}>
                        Lanzar Respaldo Manual
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>
                        Ejecuta un backup completo de la base de datos hacia Cloudflare R2 y envia la confirmacion a Telegram.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleTestBackup}
                        disabled={testing}
                        className="px-6 py-2.5 rounded-2xl text-sm font-bold cursor-pointer disabled:opacity-60 whitespace-nowrap transition-transform active:scale-95"
                        style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                    >
                        {testing ? 'Procesando...' : 'Probar Backup Ahora'}
                    </button>
                    <button
                        onClick={fetchLogs}
                        disabled={loadingLogs}
                        className="text-[10px] font-bold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        <ActivityIcon size={12} />
                        {loadingLogs ? 'Cargando Logs...' : 'Ver Logs de Diagnóstico'}
                    </button>
                </div>
            </div>

            {/* Diagnostics Console */}
            <AnimatePresence>
                {diagnostics && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl font-mono text-[11px] overflow-auto max-h-80 space-y-1 shadow-2xl relative"
                        style={{ background: '#121212', color: '#e0e0e0', border: '1px solid #333' }}
                    >
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10 sticky top-0 bg-[#121212] z-10">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5 mr-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <span className="text-amber-500 font-black tracking-widest uppercase">SYSLOG: BACKUP SERVICE</span>
                            </div>
                            <button onClick={() => setDiagnostics('')} className="bg-white/10 hover:bg-white/20 p-1 rounded-lg transition-colors text-white">
                                <CloseIcon size={16} />
                            </button>
                        </div>
                        <div className="pl-1">
                            {diagnostics.split('\n').map((line, i) => (
                                <div key={i} className={`py-0.5 ${line.includes('ERROR') || line.includes('FALLO') ? 'text-red-400 font-bold bg-red-400/5' : line.includes('OK') || line.includes('Exito') ? 'text-emerald-400 font-bold' : ''}`}>
                                    <span className="opacity-30 mr-2 select-none">{String(i + 1).padStart(3, '0')}</span>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Credentials Section */}
            <div className="rounded-3xl p-8" style={{ background: 'var(--surface-container-lowest)', boxShadow: 'var(--shadow-ambient)' }}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <DatabaseIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}>
                            Credenciales y Variables de Entorno
                        </h2>
                        <p className="text-sm opacity-60">Gestiona los secretos del sistema sincronizados con el contenedor.</p>
                    </div>
                </div>

                        {status.text && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-inner" style={{
                                background: status.type === 'error' ? 'var(--color-error-container)' : status.type === 'success' ? '#ECFDF5' : 'var(--surface-container-high)',
                                color: status.type === 'error' ? 'var(--color-error)' : status.type === 'success' ? '#065F46' : 'var(--on-surface)',
                                border: status.type === 'success' ? '1px solid #10B981' : 'none'
                            }}>
                                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {String(status.text)}
                            </motion.div>
                        )}

                <form onSubmit={handleSave} className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest border-b pb-2 border-outline-variant">
                                <SendIcon size={14} />
                                <span>Telegram Notificaciones</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">Token de Bot (@BotFather)</label>
                                    <input 
                                        type="password"
                                        value={config.TELEGRAM_TOKEN || ''}
                                        onChange={e => setConfig({...config, TELEGRAM_TOKEN: e.target.value})}
                                        className="input-field bg-surface-container-high border-none h-12 px-5 font-mono"
                                    />
                                    {!config.TELEGRAM_TOKEN && fallbacks.TELEGRAM_TOKEN && (
                                        <p className="text-[10px] italic mt-1.5 opacity-60 italic text-primary">Usando valor por defecto del sistema (.env)</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">ID de Chat / Grupo</label>
                                    <input 
                                        type="text"
                                        value={config.TELEGRAM_CHAT_ID || ''}
                                        onChange={e => setConfig({...config, TELEGRAM_CHAT_ID: e.target.value})}
                                        className="input-field bg-surface-container-high border-none h-12 px-5"
                                        placeholder="-100..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest border-b pb-2 border-outline-variant">
                                <CloudIcon size={14} />
                                <span>Cloudflare R2 Storage</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">Endpoint URL (Custom Domain or R2 URL)</label>
                                    <input 
                                        type="text"
                                        value={config.R2_ENDPOINT || ''}
                                        onChange={e => setConfig({...config, R2_ENDPOINT: e.target.value})}
                                        className="input-field bg-surface-container-high border-none h-12 px-5"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">Access Key ID</label>
                                        <input 
                                            type="password"
                                            value={config.R2_ACCESS_KEY || ''}
                                            onChange={e => setConfig({...config, R2_ACCESS_KEY: e.target.value})}
                                            className="input-field bg-surface-container-high border-none h-12 px-5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">Secret Access Key</label>
                                        <input 
                                            type="password"
                                            value={config.R2_SECRET_KEY || ''}
                                            onChange={e => setConfig({...config, R2_SECRET_KEY: e.target.value})}
                                            className="input-field bg-surface-container-high border-none h-12 px-5"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest opacity-50 ml-1">Nombre del Bucket</label>
                                    <input 
                                        type="text"
                                        value={config.R2_BUCKET_NAME || ''}
                                        onChange={e => setConfig({...config, R2_BUCKET_NAME: e.target.value})}
                                        className="input-field bg-surface-container-high border-none h-12 px-5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 max-w-lg">
                            <LockIcon size={20} className="text-amber-600" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-tighter text-amber-800">Cifrado de Backups (AES-256-CBC)</h4>
                                <input 
                                    type="password"
                                    value={config.BACKUP_ENCRYPTION_KEY || ''}
                                    onChange={e => setConfig({...config, BACKUP_ENCRYPTION_KEY: e.target.value})}
                                    className="mt-1 bg-amber-50 h-8 px-3 rounded-lg border border-amber-200 text-xs font-mono w-64 focus:outline-none"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white h-12 px-10 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.97] flex items-center gap-3 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="animate-spin" size={18} /> : <SaveIcon size={18} />}
                            {saving ? 'PROCESANDO...' : 'GUARDAR CONFIGURACIÓN'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Historical R2 Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
                    <div className="flex items-center gap-3">
                        <TimerIcon size={20} className="text-primary" />
                        <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}>
                            Backups en la Nube (R2)
                        </h3>
                    </div>
                    <button 
                        onClick={fetchBackups} 
                        disabled={loadingBackups}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                        style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }}
                    >
                        <RefreshCw size={14} className={loadingBackups ? 'animate-spin' : ''} />
                        {loadingBackups ? 'Buscando...' : 'Actualizar Lista de Objetos'}
                    </button>
                </div>

                <div className="overflow-x-auto rounded-[2rem] shadow-sm" style={{ border: '1px solid var(--outline-variant)' }}>
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase font-black tracking-widest" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface-variant)' }}>
                            <tr>
                                <th className="px-8 py-5">Archivo / Fecha de Captura</th>
                                <th className="px-8 py-5 text-right">Tamaño</th>
                                <th className="px-8 py-5 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {backups.length === 0 && !loadingBackups ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center italic opacity-40 text-sm">
                                        No se han detectado archivos de respaldo en el bucket de R2.
                                    </td>
                                </tr>
                            ) : backups.map((b) => (
                                <tr key={b.filename} className="hover:bg-gray-50/50 transition-colors" style={{ background: 'var(--surface-container-lowest)' }}>
                                    <td className="px-8 py-4">
                                        <div className="font-black text-sm" style={{ color: 'var(--on-surface)' }}>
                                            {new Date(b.date).toLocaleString('es-CO', {
                                                timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', 
                                                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                                            })}
                                        </div>
                                        <div className="text-[11px] font-mono mt-0.5 opacity-50" style={{ color: 'var(--on-surface-variant)' }}>{b.filename}</div>
                                    </td>
                                    <td className="px-8 py-4 text-right font-mono text-xs opacity-60">
                                        {(b.size / 1024 / 1024).toFixed(2)} MB
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <button
                                            onClick={() => setShowRestoreModal(b.filename)}
                                            disabled={restoringFile !== null}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black transition-all shadow-sm active:scale-95"
                                            style={{ 
                                                background: restoringFile === b.filename ? 'var(--surface-container-highest)' : '#FEE2E2', 
                                                color: restoringFile === b.filename ? 'var(--on-surface-variant)' : '#991B1B' 
                                            }}
                                        >
                                            {restoringFile === b.filename ? (
                                                <><RefreshCw size={14} className="animate-spin" /> Restaurando...</>
                                            ) : (
                                                <><CloudDownload size={14} /> Restaurar</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showRestoreModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-md w-full rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                            style={{ background: 'var(--surface-container-lowest)', border: '1px solid var(--color-error-container)' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-amber-500" />
                            
                            <div className="flex items-center gap-4 mb-6 text-rose-600">
                                <AlertTriangle size={48} strokeWidth={2.5} />
                                <h3 className="text-2xl font-black font-headline">Advertencia Crítica</h3>
                            </div>
                            
                            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--on-surface)' }}>
                                Estás a punto de reemplazar <span className="font-black underline">completamente</span> la base de datos actual con la versión del respaldo:
                                <span className="block text-xs font-mono font-black mt-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">{showRestoreModal}</span>
                            </p>
                            
                            <p className="text-xs mb-8 font-bold p-4 bg-amber-50 rounded-2xl border border-amber-100" style={{ color: 'var(--color-error)' }}>
                                ⚠️ ATENCIÓN: Todos los datos registrados después de la fecha de este respaldo se perderán irremediablemente.
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Clave de Descifrado (Master Key)</label>
                                    <input 
                                        type="password" 
                                        value={encryptionKey || ''}
                                        onChange={e => setEncryptionKey(e.target.value)}
                                        placeholder="AES-256 Key"
                                        className="w-full px-5 py-4 rounded-2xl text-sm font-bold bg-surface-container-high border-none focus:ring-2 ring-rose-500/20"
                                        style={{ outline: 'none' }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Escribe "CONFIRMAR" para autorizar</label>
                                    <input 
                                        type="text" 
                                        value={confirmText || ''}
                                        onChange={e => setConfirmText(e.target.value.toUpperCase())}
                                        placeholder="CONFIRMAR"
                                        className="w-full px-5 py-4 rounded-2xl text-center font-black tracking-[0.2em] text-rose-600 bg-surface-container-high border-2 border-transparent focus:border-rose-500/50"
                                        style={{ outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button 
                                    onClick={() => { setShowRestoreModal(null); setConfirmText(''); }}
                                    className="flex-1 py-4 rounded-2xl text-sm font-black transition-colors hover:bg-black/5"
                                    style={{ color: 'var(--on-surface-variant)' }}
                                >
                                    CANCELAR
                                </button>
                                <button 
                                    onClick={() => handleRestore(showRestoreModal)}
                                    disabled={confirmText !== 'CONFIRMAR'}
                                    className="flex-[1.5] py-4 rounded-2xl text-sm font-black shadow-xl shadow-rose-200 transition-all enabled:active:scale-95 disabled:opacity-50"
                                    style={{ background: 'var(--color-error)', color: 'white' }}
                                >
                                    RESTAURAR AHORA
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default ConfiguracionR2;
