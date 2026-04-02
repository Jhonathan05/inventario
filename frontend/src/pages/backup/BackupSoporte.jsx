import { useState } from 'react';
import api from '../../lib/axios';

const BackupSoporte = () => {
    const [loading, setLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [confirmRestore, setConfirmRestore] = useState(false);

    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleExport = async () => {
        try {
            setLoading(true);
            const isPartial = dateRange.start || dateRange.end;
            setStatus({ message: isPartial ? 'INIT_PARTIAL_PACK_GENERATION_FILTERING_IMAGES...' : 'INIT_FULL_SYSTEM_BACKUP_COMPRESSION...', type: 'info' });

            const params = new URLSearchParams();
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);

            const response = await api.get(`/respaldo/export?${params.toString()}`, {
                responseType: 'blob',
                timeout: 300000
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            const prefix = isPartial ? 'BACKUP_PARTIAL' : 'BACKUP_FULL';
            link.setAttribute('download', `${prefix}_FNC_${timestamp}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setStatus({ message: `BACKUP_STREAM_SUCCESS: PACKAGE_OFFLINED_OK.`, type: 'success' });
            setDateRange({ start: '', end: '' });
        } catch (err) {
            console.error('EXPORT_FAULT:', err);
            setStatus({ message: 'CRITICAL_EXPORT_FAULT: BUFFER_GENERATION_FAILED_TERMINATED.', type: 'error' });
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
            setStatus({ message: `RESTORE_PROTOCOL_INIT: MERGING ${selectedFiles.length} VOLUMES... DO_NOT_INTERRUPT_PROCESS_OR_BUFFER_CRASH.`, type: 'info' });

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('backups', file);
            });

            const res = await api.post('/respaldo/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 300000
            });

            setStatus({ message: `RESTORE_SUCCESS: ${res.data.message.toUpperCase()}`, type: 'success' });
            setSelectedFiles([]);
            setConfirmRestore(false);

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (err) {
            console.error('IMPORT_FAULT:', err);
            setStatus({
                message: err.response?.data?.message?.toUpperCase() || 'CRITICAL_RESTORE_FAULT: SYSTEM_INTEGRITY_COMPROMISED_FATAL_ENCOUNTER.',
                type: 'error'
            });
        } finally {
            setImportLoading(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-5 px-6 text-[13px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner";

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 border-l-4 border-l-border-default/10 animate-fadeIn">
            {/* Header / System Vault Command */}
            <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-30 transition-opacity">SYS_REDUNDANCY_IO_VAULT_0x33</div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.6em] text-text-primary leading-tight">
                                 / system_redundancy_hook
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-4">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.5em] opacity-60">DATA_VAULT_ONLINE // <span className="text-text-primary underline decoration-text-accent decoration-2 underline-offset-4">CRC_STABLE_VERIFIED</span></p>
                            </div>
                            <span className="text-border-default h-6 w-[2px] bg-border-default/30"></span>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic">DISASTER_RECOVERY_PROTOCOLS_LOADED</p>
                        </div>
                    </div>
                </div>
                {/* Visual Progress accent */}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-border-default/10">
                     <div className="h-full bg-text-accent w-full opacity-20"></div>
                </div>
            </div>

            {/* Global Communication Context */}
            {status.message && (
                <div className={`p-10 border-4 flex items-center gap-10 shadow-3xl animate-fadeIn relative overflow-hidden ${
                    status.type === 'success' ? 'bg-bg-surface border-border-default text-text-primary shadow-[0_0_50px_rgba(var(--text-primary),0.05)]' :
                    status.type === 'error' ? 'bg-bg-base border-text-accent text-text-accent animate-shake shadow-[0_0_50px_rgba(var(--text-accent),0.1)]' :
                    'bg-bg-base border-border-default text-text-muted'
                }`}>
                    <div className="absolute top-0 right-0 p-6 opacity-20 text-[11px] font-black uppercase tracking-[0.5em] italic">SYS_MSG_STREAM_RX</div>
                    {status.type === 'error' && <div className="absolute top-0 left-0 w-2 bg-text-accent h-full animate-pulse"></div>}
                    <span className="text-5xl font-black shrink-0 leading-none opacity-80">
                        {status.type === 'success' ? '[ OK ]' : status.type === 'error' ? '[ !! ]' : '[ >> ]'}
                    </span>
                    <div className="pt-2 flex-1">
                        <p className="text-[14px] font-black uppercase tracking-[0.4em] leading-relaxed italic border-l-4 border-current pl-10 bg-bg-base/30 py-4 decoration-2 underline decoration-current/10 underline-offset-8">
                            {status.message}
                        </p>
                        <div className="flex items-center gap-6 mt-6">
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest bg-bg-surface px-4 py-1.5 border border-current/10">STATUS_BIT_TYPE: {status.type.toUpperCase()} // LOG_ID: 0xRE82_{Math.random().toString(16).substring(2,6).toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                {/* Protocol 01: Export Data Stream */}
                <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl flex flex-col hover:border-border-strong transition-all relative overflow-hidden group/stage">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[1em] group-hover/stage:text-text-accent transition-all">EXPORT_TX_STREAM_0xAF</div>
                    <div className="flex items-center gap-10 mb-12 border-b-4 border-border-default pb-10">
                        <span className="text-4xl font-black text-text-primary group-hover/stage:translate-x-4 transition-transform opacity-30 group-hover/stage:opacity-100">&lsaquo;RX</span>
                        <h2 className="text-[15px] font-black text-text-primary uppercase tracking-[0.5em] group-hover/stage:text-text-accent transition-colors"># EXPORT_SYSTEM_BUFFER</h2>
                    </div>
                    
                    <p className="text-[12px] text-text-muted font-black mb-12 uppercase tracking-widest opacity-60 leading-relaxed border-l-4 border-border-default pl-10 italic bg-bg-base/30 py-6">
                        GENERATE_COMPRESSED_REDUNDANCY_PACKAGE_BLOB. <br/>SQL_DUMP_STREAM + MEDIA_STORAGE_BLOBS_INCLUDED.
                    </p>

                    <div className="space-y-8 mb-14 flex-1">
                        <div className="flex items-center gap-8 group/item">
                            <div className="w-3 h-3 bg-text-accent shadow-[0_0_8px_rgba(var(--text-accent),0.5)]"></div>
                            <div className="flex flex-col">
                                <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] font-black leading-relaxed group-hover/item:text-text-primary transition-colors">
                                    POSTGRES_SQL_BUFFER_STREAM
                                </p>
                                <span className="text-[9px] text-text-primary font-black opacity-40 uppercase tracking-tighter mt-1">[ PROTOCOL_ALWAYS_FULL_TX ]</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 group/item">
                            <div className="w-3 h-3 bg-text-accent shadow-[0_0_8px_rgba(var(--text-accent),0.5)]"></div>
                            <div className="flex flex-col">
                                <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] font-black leading-relaxed group-hover/item:text-text-primary transition-colors">
                                    MEDIA_VOLUME_STORAGE_ARRAY
                                </p>
                                <span className="text-[9px] text-text-primary font-black opacity-40 uppercase tracking-tighter mt-1">[ TEMPORAL_FILTER_LAYER_ENABLED ]</span>
                            </div>
                        </div>
                    </div>

                    {/* Date Stream Selection Enclave */}
                    <div className="bg-bg-base border-2 border-border-default p-10 mb-12 shadow-inner group/filter relative ring-inset hover:border-text-accent/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-[10px] font-black uppercase tracking-widest group-hover/filter:opacity-20 transition-opacity">IO_CHANNEL_FILTER_LAYER</div>
                        <p className="text-[11px] font-black text-text-muted mb-10 uppercase tracking-[0.4em] flex items-center gap-6 group-hover/filter:text-text-primary transition-colors">
                            <span className="w-4 h-[2px] bg-text-accent group-hover/filter:w-8 transition-all"></span> OPTIONAL_MEDIA_STREAM_OFFSET
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="group/field">
                                <label className="block text-[11px] font-black text-text-muted mb-4 uppercase tracking-[0.4em] opacity-60 group-focus-within/field:text-text-accent transition-colors">:: START_TS_OFFSET_RX</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className={inputCls}
                                />
                            </div>
                            <div className="group/field">
                                <label className="block text-[11px] font-black text-text-muted mb-4 uppercase tracking-[0.4em] opacity-60 group-focus-within/field:text-text-accent transition-colors">:: END_TS_OFFSET_TX</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    min={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className={inputCls}
                                />
                            </div>
                        </div>
                        {(dateRange.start || dateRange.end) && (
                            <div className="mt-10 p-8 border-2 border-text-accent/40 bg-text-accent/5 animate-slideDown shadow-lg flex items-center gap-8">
                                <span className="text-3xl font-black text-text-accent animate-pulse shrink-0">[!]</span>
                                <p className="text-[11px] text-text-accent font-black uppercase tracking-[0.6em] leading-relaxed italic">
                                    WARNING: PARTIAL_PACKAGE_GENERATION_VOIDS_SYSTEM_INTEGRITY_EXPECTATIONS_RECOVERY_MAY_BE_INCOMPLETE
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full px-12 py-8 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_50px_rgba(var(--text-primary),0.2)] disabled:opacity-20 uppercase tracking-[0.8em] active:scale-95 group/btn relative overflow-hidden"
                    >
                        {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                        <span className="relative z-10 flex items-center justify-center gap-8 group-hover/btn:tracking-[1em] transition-all">
                            {loading ? 'COMPRESSING_SYSTEM_PACK_STATE...' :
                                dateRange.start || dateRange.end ? '[ GENERATE_PARTIAL_OFFLINE_TX ]' : '[ GENERATE_REDUNDANCY_RECOVERY_VAULT ]'
                            }
                            {!loading && <span className="opacity-30 group-hover/btn:translate-x-4 transition-transform text-2xl">&darr;</span>}
                        </span>
                    </button>
                </div>

                {/* Protocol 02: Combined Node Recovery */}
                <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl flex flex-col hover:border-border-strong transition-all relative overflow-hidden group/stage">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[1em] group-hover/stage:text-text-accent transition-all">RESTORE_TX_PROTOCOL_0xFD</div>
                    <div className="flex items-center gap-10 mb-12 border-b-4 border-border-default pb-10">
                        <span className="text-4xl font-black text-text-primary group-hover/stage:translate-x-4 transition-transform opacity-30 group-hover/stage:opacity-100">TX&rsaquo;</span>
                        <h2 className="text-[15px] font-black text-text-primary uppercase tracking-[0.5em] group-hover/stage:text-text-accent transition-colors"># COMBINED_NODE_RESTORE</h2>
                    </div>

                    <p className="text-[12px] text-text-muted font-black mb-10 uppercase tracking-widest opacity-60 leading-relaxed border-l-4 border-border-default pl-10 italic bg-bg-base/30 py-6">
                        MOUNT_REDUNDANCY_VOLUMES_FS. SYSTEM_WILL_SUTURE_RECORDS_INTO_CURRENT_DATABASE_CORE_STATE.
                    </p>

                    <div className="border-4 border-text-accent bg-text-accent/10 p-10 flex gap-10 items-center mb-12 shadow-3xl relative overflow-hidden group/warning animate-shake ring-4 ring-text-accent ring-inset">
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-text-accent group-hover:h-full group-hover:opacity-10 transition-all duration-700"></div>
                        <span className="text-6xl font-black text-text-accent leading-none animate-pulse shrink-0">!!!</span>
                        <div className="flex-1 z-10">
                            <p className="text-[11px] text-text-accent leading-relaxed font-black uppercase tracking-[0.4em]">
                                <span className="block mb-4 text-[16px] tracking-[0.8em] text-text-primary underline decoration-text-accent decoration-4 underline-offset-8">FATAL_DESTRUCTIVE_PROTOCOL</span>
                                LIVE_DATABASE_WILL_BE_PURGED_AND_REPLACED_BY_INPUT_STREAM_MANIFEST. THIS_IO_IS_TOTAL_AND_IRREVERSIBLE_CRC_VERIFICATION_REQUIRED.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleImport} className="space-y-10 flex-1 flex flex-col">
                        {!selectedFiles.length ? (
                            <div className="relative border-4 border-dashed border-border-default p-14 text-center hover:border-text-accent hover:bg-bg-elevated transition-all flex-1 flex flex-col justify-center items-center group/drop cursor-pointer bg-bg-base/40 shadow-inner overflow-hidden">
                                <input
                                    type="file"
                                    accept=".zip"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={importLoading}
                                />
                                <div className="text-[12px] font-black text-text-muted mb-8 uppercase tracking-[0.6em] opacity-30 group-hover/drop:opacity-60 transition-opacity">[ CORE_IO_RECOVERY_ENCLAVE ]</div>
                                <div className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] leading-loose group-hover/drop:scale-105 transition-all">
                                    DRAG_AND_DROP_OFFLINE_ZIP_BUFS <br/> 
                                    <span className="underline decoration-text-accent/30 decoration-4 underline-offset-[16px] hover:decoration-text-accent transition-all inline-block mt-4">:: MOUNT_REDUNDANCY_STORAGE_VOLUMES ::</span>
                                </div>
                                <span className="text-[10px] text-text-muted font-black mt-14 uppercase tracking-[0.6em] opacity-20 group-hover/drop:opacity-50 transition-opacity italic">BUFFERED_STREAM_V.2_STABLE_READY</span>
                                {loading && <div className="absolute inset-0 bg-text-accent/5 animate-pulse"></div>}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-[180px] animate-fadeIn">
                                <div className="border-4 border-border-default bg-bg-base p-10 flex-1 shadow-inner max-h-64 overflow-y-auto custom-scrollbar relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-text-accent opacity-30 shadow-[0_0_15px_rgba(var(--text-accent),0.4)]"></div>
                                    <div className="text-[11px] font-black text-text-muted mb-8 uppercase tracking-[0.5em] border-b-2 border-border-default pb-6 flex justify-between items-center group-hover/stage:text-text-accent transition-colors">
                                        STAGED_VOLUMES_DETECTED :: <span className="text-text-primary bg-bg-surface px-4 py-1 border-2 border-border-default shadow-sm text-lg">[0x{selectedFiles.length.toString().padStart(2, '0')}]</span>
                                    </div>
                                    <ul className="space-y-6">
                                        {selectedFiles.map((f, idx) => (
                                            <li key={idx} className="flex justify-between items-center bg-bg-surface border-2 border-border-default px-8 py-5 group/file hover:border-text-accent hover:shadow-2xl transition-all relative overflow-hidden">
                                                <div className="absolute left-0 top-0 h-full w-1 bg-text-accent/30 group-hover/file:w-full group-hover/file:opacity-5 transition-all"></div>
                                                <div className="flex items-center gap-8 overflow-hidden relative z-10">
                                                    <span className="text-[10px] font-black text-text-muted opacity-40 uppercase tabular-nums tracking-tighter">[ ZIP_PKG_ARRAY_IDX_{idx} ]</span>
                                                    <span className="text-[13px] font-black text-text-primary uppercase truncate max-w-[280px] group-hover/file:tracking-widest transition-all" title={f.name}>{f.name.toUpperCase().replace(/ /g, '_')}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="text-text-muted hover:text-text-accent transition-all p-3 hover:scale-125 relative z-10 focus:outline-none"
                                                    title="DISMOUNT_VOLUME_STREAM"
                                                >
                                                    <span className="text-4xl font-black opacity-40 hover:opacity-100">[ &times; ]</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFiles([])}
                                    className="mt-8 text-[11px] font-black text-text-muted hover:text-text-accent uppercase tracking-[0.5em] transition-all hover:translate-x-6 flex items-center gap-4 group/clear"
                                >
                                    <span className="opacity-30 group-hover/clear:translate-x-[-10px] transition-transform">&lsaquo;</span> [ ABORT_ALL_STAGED_VOLUMES ]
                                </button>
                            </div>
                        )}

                        {selectedFiles.length > 0 && !confirmRestore && (
                            <button
                                type="button"
                                onClick={() => setConfirmRestore(true)}
                                className="w-full px-12 py-8 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_40px_rgba(var(--text-primary),0.3)] uppercase tracking-[0.7em] active:scale-95 animate-fadeIn group/verify ring-4 ring-text-primary hover:ring-text-accent ring-inset"
                            >
                                <span className="group-hover:tracking-[0.9em] transition-all flex items-center justify-center gap-8">
                                    [ INIT_STRICT_INTEGRITY_VERIF ]
                                    <span className="text-2xl opacity-30 group-hover/verify:translate-x-4 transition-transform">&raquo;</span>
                                </span>
                            </button>
                        )}

                        {confirmRestore && (
                            <div className="space-y-8 animate-slideUp border-t-2 border-border-default/50 pt-10">
                                <button
                                    type="submit"
                                    disabled={importLoading}
                                    className="w-full relative overflow-hidden px-14 py-10 text-[16px] font-black text-bg-base bg-text-accent hover:bg-border-strong transition-all shadow-[0_0_80px_rgba(var(--text-accent),0.4)] disabled:opacity-50 uppercase tracking-[0.6em] active:scale-95 group/fatal ring-8 ring-text-accent hover:ring-border-strong transition-all"
                                >
                                    {importLoading && <div className="absolute inset-0 bg-black/30 animate-loadingBar"></div>}
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        {importLoading ? (
                                            <span className="flex items-center justify-center gap-10">
                                                <div className="w-6 h-6 border-4 border-bg-base border-t-transparent animate-spin rounded-full"></div>
                                                REWRITING_SYSTEM_CORE_MANIFEST_TX...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="group-hover/fatal:scale-110 transition-transform tracking-[0.8em]">!! CONFIRM_TOTAL_PURGE_TX !!</span>
                                                <span className="text-[10px] opacity-60 tracking-[0.3em]">RECOVERY_RESTORE_SUTURE_INIT</span>
                                            </>
                                        )}
                                    </div>
                                    {!importLoading && <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000 20px, #000 40px)' }} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmRestore(false)}
                                    className="w-full py-4 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.4em] transition-all border-2 border-transparent hover:border-border-default bg-bg-base/30 shadow-xl"
                                >
                                    [ ABORT_RECOVERY_REWRITE_PROTOCOL ]
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Controller Footer CRC Metadata Overlay */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 p-14 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-text-accent/40 to-transparent"></div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-8 relative z-10 group-hover/footer:text-text-primary transition-colors">
                     <div className="w-5 h-5 bg-text-accent rotate-45 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.9)]"></div>
                     CMD_VAULT_CONTROLLER_STABLE_RX // HASH_CHECK_0x88FE_PASSED
                </div>
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.5em] italic group-hover:text-text-primary transition-all relative z-10 tabular-nums">
                     COLOMBIA_ITSM_DR_MANAGER // BUFFER_COMMIT: STABLE_ACKN
                </div>
            </div>
        </div>
    );
};

export default BackupSoporte;
