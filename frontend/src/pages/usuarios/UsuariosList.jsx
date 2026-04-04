import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../../api/usuarios.service';
import UsuarioForm from './components/UsuarioForm';

const Usuarios = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    // - [x] `UsuariosList.jsx`: Optimize card view density.
    // - [/] `ActivoDetail.jsx`: Scale down massive headings and tabs.
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
        <div className="space-y-6 sm:space-y-10 font-mono mb-24 page-padding animate-fadeIn">
            {/* Header */}
            <div className="bg-bg-surface border border-border-default p-4 sm:p-6 shadow-lg relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-[8px] font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity hidden sm:block">AUTH_KEY_STREAM_RX_0x77</div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-text-accent animate-pulse"></div>
                            <h1 className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-text-primary leading-tight">
                                / user_access_control
                            </h1>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                            <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">SECURE_CREDENTIAL_STORAGE_ACTIVE</p>
                            <p className="text-[9px] text-text-primary font-black uppercase tracking-widest bg-bg-base px-2 py-0.5 border border-border-default/50 tabular-nums">
                                {usuarios.length.toString().padStart(3, '0')}_NODES
                            </p>
                        </div>
                    </div>
                    <button
                        id="btn-create-usuario"
                        onClick={handleCreate}
                        className="bg-bg-elevated border border-border-strong px-4 sm:px-8 py-2 sm:py-3 text-[10px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden w-full sm:w-auto text-center"
                    >
                        [ + ] CREATE_IDENTITY
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-text-accent/20">
                    <div className="h-full bg-text-accent w-1/3 animate-loadingBarSlow"></div>
                </div>
            </div>

            {error && (
                <div className="p-4 sm:p-8 border border-text-accent sm:border-2 bg-text-accent/5 text-text-accent shadow-xl relative overflow-hidden flex items-center gap-6">
                    <span className="font-black text-4xl leading-none animate-pulse">!!</span>
                    <div className="pt-1 min-w-0">
                        <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-2">SYSTEM_AUTH_EXCEPTION_DETECTED</p>
                        <p className="text-[11px] font-black opacity-80 border-l-2 border-text-accent/30 pl-4 py-1 uppercase tracking-widest truncate">{error.message || error}</p>
                    </div>
                </div>
            )}

            {/* Tabla (desktop sm+) */}
            <div className="table-desktop bg-bg-surface border border-border-default shadow-lg overflow-hidden relative group/table hover:border-border-strong transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b border-border-default">
                                <th scope="col" className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/20">:: IDENTITY</th>
                                <th scope="col" className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/20">:: EMAIL</th>
                                <th scope="col" className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/20">:: ACCESS_LVL</th>
                                <th scope="col" className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/20">:: STATUS</th>
                                <th scope="col" className="px-4 py-3 text-right text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">CMD</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {loading && usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="text-[13px] font-black text-text-accent animate-pulse uppercase tracking-[1em]"># SYNCING...</div>
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic">! NO_USERS_FOUND</div>
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-bg-elevated transition-all group/row border-l-2 border-l-transparent hover:border-l-text-accent cursor-default">
                                        <td className="px-4 py-3 border-r border-border-default/10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center border border-border-default font-black text-[9px] bg-bg-base group-hover/row:border-text-accent transition-colors flex-shrink-0">
                                                    {usuario.nombre.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors">
                                                        {usuario.nombre.replace(/ /g, '_')}
                                                    </p>
                                                    <p className="text-[8px] text-text-muted font-black mt-0.5 tracking-[0.2em] opacity-40 tabular-nums">0x{String(usuario.id).slice(0, 6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-r border-border-default/10 text-[10px] text-text-primary font-black tracking-wide tabular-nums opacity-80 group-hover/row:opacity-100 transition-opacity">
                                            {usuario.email.toLowerCase()}
                                        </td>
                                        <td className="px-4 py-3 border-r border-border-default/10">
                                            <span className={`inline-flex items-center border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transition-all
                                                ${usuario.rol === 'ADMIN' ? 'border-text-accent text-text-accent bg-text-accent/5' : 'border-border-default text-text-muted bg-bg-base'}`}>
                                                /{usuario.rol}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-r border-border-default/10">
                                            <span className={`inline-flex items-center border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-bg-base transition-all
                                                ${usuario.activo ? 'text-text-primary border-border-default opacity-60' : 'text-text-accent border-text-accent animate-pulse'}`}>
                                                {usuario.activo ? 'ACTIVE' : 'LOCKED'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(usuario)}
                                                className="inline-flex items-center justify-center text-[9px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border border-border-default bg-bg-base px-3 py-1.5 uppercase tracking-widest transition-all shadow-md active:scale-95"
                                            >
                                                → EDIT
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cards (móvil) */}
            <div className="cards-mobile">
                {loading && usuarios.length === 0 && (
                    <div className="py-10 text-center">
                        <div className="text-[12px] font-black text-text-accent animate-pulse uppercase tracking-[0.8em]"># SYNCING...</div>
                    </div>
                )}
                {!loading && usuarios.length === 0 && (
                    <div className="py-10 text-center border border-dashed border-border-default/30 p-6">
                        <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40 italic">! NO_USERS_FOUND</div>
                    </div>
                )}
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="card-mobile-item border-l-2 border-l-transparent hover:border-l-text-accent transition-all p-3 mb-2">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center border border-border-default font-black text-[9px] bg-bg-base">
                                    {usuario.nombre.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] font-black text-text-primary uppercase tracking-tight truncate">
                                        {usuario.nombre}
                                    </p>
                                    <p className="text-[8px] text-text-muted opacity-40 tabular-nums">0x{String(usuario.id).slice(0, 6).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`inline-flex border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider
                                    ${usuario.activo ? 'text-text-primary border-border-default opacity-60' : 'text-text-accent border-text-accent'}`}>
                                    {usuario.activo ? 'ON' : 'OFF'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 pl-8">
                            <div>
                                <span className="card-mobile-label text-[8px]">Email</span>
                                <p className="text-[10px] font-black text-text-primary tracking-wide truncate">{usuario.email.toLowerCase()}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="card-mobile-label text-[8px]">Rol</span>
                                    <span className={`inline-flex border px-1.5 py-0.1 text-[9px] font-black uppercase tracking-widest
                                        ${usuario.rol === 'ADMIN' ? 'border-text-accent text-text-accent bg-text-accent/5' : 'border-border-default text-text-muted bg-bg-base'}`}>
                                        /{usuario.rol}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleEdit(usuario)}
                                    className="text-[9px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border border-border-default bg-bg-base px-3 py-1.5 uppercase tracking-widest transition-all active:scale-95"
                                >
                                    → EDIT
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <UsuarioForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    usuario={selectedUsuario}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-6 bg-bg-surface/40 border border-border-default opacity-40">
                <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-text-accent rotate-45 animate-pulse"></div>
                    CONTROL_LAYER_SERVICE_ACCESS_BUFFER
                </div>
                <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] italic">
                    ACCESS_LEVEL: MASTER_ROOT
                </div>
            </div>
        </div>
    );
};

export default Usuarios;
