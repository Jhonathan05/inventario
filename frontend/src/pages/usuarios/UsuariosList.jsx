import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../../api/usuarios.service';
import UsuarioForm from './components/UsuarioForm';

const Usuarios = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const { data: usuarios = [], isLoading: loading, error } = useQuery({
        queryKey: ['usuarios'],
        queryFn: usuariosService.getAll,
    });

    const handleCreate = () => {
        setSelectedUsuario(null);
        setIsModalOpen(true);
    };

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    const handleCloseModal = (shouldRefresh) => {
        setIsModalOpen(false);
        setSelectedUsuario(null);
        if (shouldRefresh) {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        }
    };

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Header / Auth Controller Command Area */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">AUTH_KEY_STREAM_RX_0x77</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                                 / user_access_control_hub
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">SECURE_CREDENTIAL_STORAGE_ACTIVE</p>
                            </div>
                            <span className="text-border-default/30 h-5 w-[2px] bg-border-default/30"></span>
                            <p className="text-[11px] text-text-primary font-black uppercase tracking-widest bg-bg-base px-3 py-1 border border-border-default/50 tabular-nums">
                                {usuarios.length.toString().padStart(3, '0')}_NODES_IDENTIFIED
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-bg-elevated border-2 border-border-strong px-12 py-5 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.6em] transition-all shadow-3xl hover:scale-105 active:scale-95 group/btn relative overflow-hidden"
                    >
                        <span className="relative z-10 group-hover/btn:tracking-[0.8em] transition-all">[ + ] CREATE_NEW_IDENTITY_NODE</span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                </div>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                     <div className="h-full bg-text-accent w-1/3 animate-loadingBarSlow"></div>
                </div>
            </div>

            {error && (
                <div className="p-10 border-2 border-text-accent bg-text-accent/5 text-text-accent shadow-3xl relative overflow-hidden animate-shake flex items-center gap-10">
                    <div className="absolute top-0 right-0 p-6 opacity-20 text-[10px] font-black uppercase tracking-[0.4em]">! SECURITY_BREACH_LOG_REPORT</div>
                    <span className="font-black text-6xl leading-none animate-pulse">!!</span>
                    <div className="pt-1">
                        <p className="text-[14px] font-black uppercase tracking-[0.5em] mb-4">SYSTEM_AUTH_EXCEPTION_DETECTED</p>
                        <p className="text-[12px] font-black opacity-80 border-l-4 border-text-accent/30 pl-6 py-2 uppercase tracking-widest">{error.message || error}</p>
                    </div>
                </div>
            )}

            {/* Data Manifest / User Registry Table */}
            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group/table hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/table:text-text-accent transition-colors">USER_ACCESS_MAP_BUFFER_0x22_RX</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: IDENTITY_NODE_ALIAS</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: EMAIL_ENDPOINT_ADDR</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ACCESS_PRIVILEGE_LVL</th>
                                <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: OPERATIONAL_STATUS_FLAG</th>
                                <th scope="col" className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {loading && usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="text-[15px] font-black text-text-accent animate-pulse uppercase tracking-[1.5em]"># SYNCING_USER_ACCESS_MANIFEST...</div>
                                        <div className="mt-8 text-[10px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic">DECRYPTING_CREDENTIAL_MAP_0xIO // CRC_CHECK: OK</div>
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="inline-block p-16 bg-bg-base border-2 border-dashed border-border-default/30 shadow-inner">
                                            <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic">
                                                ! NO_USER_NODES_ALLOCATED_IN_STORAGE_BUFFER
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 flex items-center justify-center border-2 border-border-default font-black text-[10px] bg-bg-base group-hover/row:border-text-accent transition-colors">
                                                     {usuario.nombre.substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors tabular-nums">
                                                        {usuario.nombre.replace(/ /g, '_')}
                                                    </p>
                                                    <p className="text-[10px] text-text-muted font-black mt-2 tracking-[0.3em] opacity-40 tabular-nums">HEX_UID: 0x{String(usuario.id).slice(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10 text-[12px] text-text-primary font-black tracking-widest tabular-nums opacity-80 group-hover/row:opacity-100 transition-opacity">
                                            {usuario.email.toUpperCase()}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <span className={`inline-flex items-center border-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all
                                                ${usuario.rol === 'ADMIN' ? 'border-text-accent text-text-accent bg-text-accent/5' : 'border-border-default text-text-muted bg-bg-base'}`}>
                                                /{usuario.rol.replace(/_/g, '_')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <span className={`inline-flex items-center border-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-bg-base shadow-xl transition-all
                                                ${usuario.activo ? 'text-text-primary border-border-default opacity-60' : 'text-text-accent border-text-accent animate-pulse'}`}>
                                                {usuario.activo ? '[_ACTIVE_NODE_]' : '[_LOCKED_PENDING_]'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(usuario)}
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border-2 border-border-default bg-bg-base px-8 py-4 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn-mod"
                                            >
                                                <span className="opacity-40 group-hover/btn-mod:translate-x-2 transition-transform mr-4">→</span>
                                                [ MODIFY_IDENTITY_NODE ]
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Logic Integration Bridge */}
            {isModalOpen && (
                <UsuarioForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    usuario={selectedUsuario}
                />
            )}

            {/* Archive Footer Controller Identifier */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-8 p-12 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-6">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                     CONTROL_LAYER_SERVICE_ACCESS_BUFFER // KERNEL_NODE_RX_ACTIVE
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">
                     COLOMBIA_IT_IDENTITY_MANIFEST // ACCESS_LEVEL: MASTER_ROOT
                </div>
            </div>
        </div>
    );
};

export default Usuarios;
