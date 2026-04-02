import { useState, useEffect } from 'react';
import api from '../../../lib/axios';

const UsuarioForm = ({ open, onClose, usuario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'ANALISTA_TIC',
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || '',
                email: usuario.email || '',
                password: '',
                rol: usuario.rol || 'ANALISTA_TIC',
                activo: usuario.activo ?? true
            });
        } else {
            setFormData({
                nombre: '',
                email: '',
                password: '',
                rol: 'ANALISTA_TIC',
                activo: true
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (type !== 'checkbox' && name !== 'email' && name !== 'password' && name !== 'rol') {
            newValue = value.toUpperCase();
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (usuario) {
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;
                await api.put(`/usuarios/${usuario.id}`, dataToUpdate);
            } else {
                await api.post('/usuarios', formData);
            }
            onClose(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'BUFFER_COMMIT_FAULT');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const inputCls = "block w-full bg-bg-base border border-border-default py-4 px-6 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-border-strong transition-all appearance-none shadow-inner";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/90 backdrop-blur-md transition-opacity" onClick={() => onClose(false)}></div>
                <div className="relative bg-bg-surface border-2 border-border-default p-12 text-left shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:my-12 sm:w-full sm:max-w-2xl z-10 overflow-hidden animate-slideUp">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em]">AUTH_COMMIT_BUFFER_RX</div>
                    
                    <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-10">
                        <div>
                            <h3 className="text-xl font-black text-text-primary uppercase tracking-[0.5em]">
                                / {usuario ? 'MODIFY_USER_NODE' : 'REGISTER_NEW_USER'}
                            </h3>
                            <p className="text-[10px] text-text-muted font-black mt-3 uppercase tracking-widest opacity-60">REGISTRY_PATH: auth.db_layer // UID: [ {usuario?.id?.slice(0,8).toUpperCase() || 'NULL_INITIAL'} ]</p>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent p-4 transition-all active:scale-75">
                            <span className="text-3xl font-black">[ &times; ]</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-10 p-8 border-2 border-text-accent bg-bg-base text-text-accent shadow-3xl relative overflow-hidden animate-shake">
                            <div className="absolute top-0 right-0 p-4 opacity-20 text-[10px] font-black uppercase tracking-[0.4em]">! EXECUTION_FAULT</div>
                            <div className="flex items-start gap-6">
                                <span className="font-black text-4xl leading-none animate-pulse">[!!!]</span>
                                <div className="pt-1">
                                    <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-2">SYSTEM_DATA_EXCEPTION</p>
                                    <p className="text-[11px] font-bold opacity-80 border-l-2 border-text-accent/30 pl-4 py-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="sm:col-span-2 group/field">
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 opacity-70 group-focus-within/field:text-text-accent transition-colors">:: FULL_REPRESENTATIVE_NAME *</label>
                                <input type="text" name="nombre" required className={inputCls} value={formData.nombre} onChange={handleChange} placeholder="ENTER_IDENTITY_MANIFEST..." />
                            </div>

                            <div className="sm:col-span-2 group/field">
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 opacity-70 group-focus-within/field:text-text-accent transition-colors">:: EMAIL_ENDPOINT_TARGET *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`${inputCls} tabular-nums tracking-widest`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="USER@DOMAIN_CORE.COM"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    title="REQUIRED: VALID_EMAIL_FORMAT_RX"
                                />
                            </div>

                            <div className="group/field">
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 opacity-70 group-focus-within/field:text-text-accent transition-colors">
                                    :: ACCESS_CREDENTIALS {usuario ? '(LEAVE_BLANK_FOR_STABLE_STATE)' : '*'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required={!usuario}
                                    minLength="6"
                                    className={`${inputCls} tabular-nums`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="******"
                                />
                            </div>

                            <div className="group/field relative">
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 opacity-70 group-focus-within/field:text-text-accent transition-colors">:: ACCESS_LEVEL_RANK *</label>
                                <select name="rol" required className={inputCls} value={formData.rol} onChange={handleChange}>
                                    <option value="ADMIN">ADMIN_LEVEL_ROOT</option>
                                    <option value="CONSULTA">QUERY_ONLY_NODE</option>
                                    <option value="ANALISTA_TIC">TIC_ANALYST_AGENT</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 pt-8 flex items-center pointer-events-none opacity-40 text-[8px] font-black">[ &darr; ]</div>
                            </div>

                            <div className="sm:col-span-2 border-t border-border-default/20 pt-8">
                                <div 
                                    className="flex items-center group/check cursor-pointer inline-flex" 
                                    onClick={() => handleChange({ target: { name: 'activo', type: 'checkbox', checked: !formData.activo } })}
                                >
                                    <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all shadow-xl ${formData.activo ? 'bg-text-primary border-text-primary' : 'bg-bg-base border-border-default group-hover/check:border-text-accent'}`}>
                                        {formData.activo && <div className="w-3 h-3 bg-bg-base rotate-45 animate-fadeIn"></div>}
                                    </div>
                                    <label className="ml-6 text-[11px] font-black text-text-primary uppercase tracking-[0.4em] cursor-pointer group-hover/check:text-text-accent transition-colors">
                                        [ NODE_ACTIVE_STATE_ENABLED ]
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 flex flex-col sm:flex-row gap-8 border-t-2 border-border-default/50">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-10 py-5 text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.4em] border-2 border-border-default hover:border-text-accent transition-all bg-bg-base/30 shadow-xl active:scale-95 group/discard"
                            >
                                [ DISCARD_PROC_STREAM ]
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-10 py-5 text-[11px] font-black bg-text-primary text-bg-base hover:bg-text-accent transition-all shadow-[0_0_30px_rgba(255,51,102,0.2)] disabled:opacity-20 uppercase tracking-[0.5em] active:scale-95 group/commit relative overflow-hidden"
                            >
                                {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                                <span className="relative z-10">{loading ? '[ SYNCING_COMMITS... ]' : '[ EXECUTE_DATABASE_COMMIT ]'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UsuarioForm;
