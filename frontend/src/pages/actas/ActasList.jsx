import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const ActasList = () => {
    const navigate = useNavigate();
    const [actas, setActas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    useEffect(() => {
        loadActas();
    }, []);

    const loadActas = async () => {
        try {
            const res = await axios.get('/actas');
            setActas(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (actaId) => {
        try {
            const response = await axios({
                url: `/actas/${actaId}/download-xlsx`,
                method: 'GET',
                responseType: 'blob', // Importante para descargar archivos
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Acta_${actaId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error descargando el acta:', err);
        }
    };

    const filteredActas = actas.filter(acta => {
        const s = searchTerm.toLowerCase();
        const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;
        const activosTexto = snapshot?.activos?.map(a => `${a.placa} ${a.serial} ${a.tipo}`).join(' ') || '';
        const funcionarioOrigen = snapshot?.funcionarioOrigen?.nombre || acta.funcionario?.nombre || '';
        const funcionarioDestino = snapshot?.funcionarioDestino?.nombre || (acta.tipo === 'ASIGNACION' ? acta.funcionario?.nombre : '');
        const realizadoPor = acta.creadoPor?.nombre || '';

        return (
            acta.tipo.toLowerCase().includes(s) ||
            funcionarioOrigen.toLowerCase().includes(s) ||
            funcionarioDestino.toLowerCase().includes(s) ||
            realizadoPor.toLowerCase().includes(s) ||
            activosTexto.toLowerCase().includes(s)
        );
    });

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Header / Archive Stream Command Center */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">LOG_ARCHIVE_RX_STREAM_0x92</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                                 / activity_logs_archive
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">KERNEL_ARCHIVE_STORAGE_ACTIVE</p>
                            </div>
                            <span className="text-border-default/30 h-5 w-[2px] bg-border-default/30"></span>
                            <p className="text-[11px] text-text-primary font-black uppercase tracking-widest bg-bg-base px-3 py-1 border border-border-default/50 tabular-nums">
                                {filteredActas.length.toString().padStart(4, '0')}_TRANSACTIONS_BUF
                            </p>
                        </div>
                    </div>
                    {canEdit && (
                        <button
                            onClick={() => navigate('/actas/generar')}
                            className="bg-bg-elevated border-2 border-border-strong px-12 py-5 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.6em] transition-all shadow-3xl hover:scale-105 active:scale-95 group/btn relative overflow-hidden"
                        >
                            <span className="relative z-10 group-hover/btn:tracking-[0.8em] transition-all">[ + ] REGISTER_NEW_NOVELTY_TX</span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                </div>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                     <div className="h-full bg-text-accent w-1/6 animate-loadingBarSlow"></div>
                </div>
            </div>

            {/* Query Filter / Data Buffer Search */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-widest">QUERY_STREAM_MAP_RX</div>
                <div className="relative group/search">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[11px] font-black group-focus-within/search:opacity-100 group-focus-within/search:text-text-accent transition-all whitespace-nowrap">
                        SCAN_TX &raquo;
                    </div>
                    <input
                        type="text"
                        placeholder="PLATE_SERIAL_AGENT_TYPE_MANIFEST_FRAGMENT..."
                        className="block w-full bg-bg-base border-2 border-border-default py-5 pl-32 pr-8 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Manifest / Transaction Archive Table */}
            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group/table hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-hover/table:text-text-accent transition-colors">LOG_ARRAY_STREAM_RX_STABLE_TX_MANIFEST</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1200px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: TIMESTAMP_RX</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: OP_TYPE_CODE</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ASSET_NODES_FRAGMENT</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: SENDER_ENTITY_UID</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: RECEIVER_ENTITY_UID</th>
                                <th scope="col" className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_ACTION_PROTOCOL_IO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="text-[15px] font-black text-text-accent animate-pulse uppercase tracking-[1.5em]"># SYNCING_LOG_BUFFER_ARRAY...</div>
                                        <div className="mt-8 text-[10px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic">READING_ARCHIVAL_DATA_LAYERS // PARITY_RX: OK</div>
                                    </td>
                                </tr>
                            ) : filteredActas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-32 text-center">
                                        <div className="inline-block p-16 bg-bg-base border-2 border-dashed border-border-default/30 shadow-inner">
                                            <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic">
                                                ! NO_TX_MATCHES_IN_CURRENT_QUERY_BUFFER_NAMESPACE
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredActas.map(acta => {
                                    const snapshot = typeof acta.detalles === 'string' ? JSON.parse(acta.detalles) : acta.detalles;
                                    let entrega = '';
                                    let recibe = '';
                                    if (acta.tipo === 'ASIGNACION') {
                                        entrega = acta.creadoPor?.nombre;
                                        recibe = acta.funcionario?.nombre;
                                    } else if (acta.tipo === 'DEVOLUCION') {
                                        entrega = acta.funcionario?.nombre;
                                        recibe = acta.creadoPor?.nombre;
                                    } else if (acta.tipo === 'TRASLADO') {
                                        entrega = snapshot?.funcionarioOrigen?.nombre || acta.funcionario?.nombre;
                                        recibe = snapshot?.funcionarioDestino?.nombre || '-';
                                    }

                                    return (
                                        <tr key={acta.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                            <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-muted font-black tracking-widest uppercase tabular-nums">
                                                [{formatDate(acta.fecha).toUpperCase().replace(/ /g, '_')}]
                                            </td>
                                            <td className="px-10 py-8 border-r border-border-default/10">
                                                <span className={`inline-flex items-center border-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all tabular-nums
                                                    ${acta.tipo === 'ASIGNACION' ? 'text-text-primary border-border-default bg-bg-base opacity-70' :
                                                        acta.tipo === 'DEVOLUCION' ? 'text-text-accent border-text-accent bg-text-accent/5' : 
                                                        'text-text-muted border-border-default opacity-40 bg-bg-base'}`}>
                                                    [{acta.tipo}]
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 border-r border-border-default/10 max-w-[320px]">
                                                <div className="flex flex-wrap gap-4">
                                                    {snapshot?.activos?.map(a => (
                                                        <span key={a.id} className="border-2 border-border-default px-3 py-1.5 text-[10px] font-black text-text-primary tracking-widest bg-bg-base/50 shadow-inner group-hover/row:border-text-accent/50 transition-colors tabular-nums">
                                                            /_{a.placa}_
                                                        </span>
                                                    )) || <span className="text-text-muted italic text-[11px] opacity-20 tracking-widest font-black uppercase">// LEGACY_FRAGMENT_DATA_INCOMPLETE</span>}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-primary font-black uppercase tracking-tight truncate max-w-[180px] opacity-60 group-hover/row:opacity-100 transition-opacity tabular-nums">
                                                {entrega?.toUpperCase().replace(/ /g, '_') || 'SYS_NULL_TX_STREAM'}
                                            </td>
                                            <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-primary font-black uppercase tracking-tight truncate max-w-[180px] opacity-60 group-hover/row:opacity-100 transition-opacity tabular-nums">
                                                {recibe?.toUpperCase().replace(/ /g, '_') || 'SYS_NULL_RX_STREAM'}
                                            </td>
                                            <td className="px-10 py-8 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDownload(acta.id)}
                                                    className="inline-flex items-center justify-center text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border-2 border-border-default bg-bg-base px-8 py-4 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn-dl"
                                                    title="DOWNLOAD_XLS_EXPORT_CHANNEL_IO"
                                                >
                                                    <span className="opacity-30 group-hover/btn-dl:text-text-accent group-hover/btn-dl:translate-y-1 transition-all mr-4 font-black">v</span>
                                                    [ XLS_ARCHIVE_TX ]
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Archive Footer Info Interface */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-10 p-12 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-6">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                     DATA_STREAM_END_STABLE // VERSION_0xFD_ARCHIVE
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">
                     COLOMBIA_IT_ASSET_TX_MANIFEST // CHECKSUM: PASS_TX
                </div>
            </div>
        </div>
    );
};

export default ActasList;
