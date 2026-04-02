import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-bg-base font-mono selection:bg-text-accent selection:text-bg-base">
            {/* BACKGROUND_GRID_OVERLAY */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fb6107 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
            
            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-full h-[6px] bg-gradient-to-l from-text-accent via-transparent to-transparent opacity-30"></div>

            <div className="bg-bg-surface border-4 border-border-default w-full max-w-xl p-16 relative z-10 shadow-[0_0_150px_rgba(0,0,0,0.8)] transition-all group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-sm font-black uppercase tracking-[1.5em] group-hover:opacity-20 transition-all pointer-events-none">SECURE_AUTH_GATE_0x00</div>
                
                <div className="text-center mb-16 relative">
                    <div className="flex justify-center mb-10">
                        <div className="w-16 h-16 border-4 border-text-accent rotate-45 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.4)] group-hover:scale-110 transition-transform">
                            <div className="w-4 h-4 bg-text-accent -rotate-45"></div>
                        </div>
                    </div>
                    
                    <div className="text-sm font-black text-text-accent mb-6 tracking-[1.2em] opacity-50 uppercase flex items-center justify-center gap-6">
                        <div className="h-px w-10 bg-text-accent/30"></div>
                        [ INITIALIZE_SESSION ]
                        <div className="h-px w-10 bg-text-accent/30"></div>
                    </div>
                    
                    <h1 className="text-4xl font-black text-text-primary uppercase tracking-[0.6em] mb-4 drop-shadow-xl">
                        / core_it_vault
                    </h1>
                    <p className="text-[11px] text-text-muted mt-4 uppercase tracking-[0.4em] font-black opacity-40 italic">AUTHENTICATION_PROTOCOL_V4.2 // ESTABLISH_LINK</p>
                </div>

                {error && (
                    <div className="p-8 mb-12 bg-bg-base border-2 border-text-accent text-[12px] font-black text-text-accent uppercase tracking-[0.3em] leading-relaxed shadow-inner animate-shake relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-text-accent animate-pulse"></div>
                        <span className="text-2xl mr-4">!!!</span>
                        KERNEL_AUTH_REJECTED: {error.toUpperCase().replace(/ /g, '_')} !!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="group/field">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] mb-4 group-focus-within/field:text-text-accent transition-colors opacity-70">
                            :: USER_IDENTIFIER_STREAM
                        </label>
                        <input
                            type="email"
                            placeholder="EMAILID@CAFEDECOLOMBIA.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-8 py-5 bg-bg-base border-2 border-border-default text-text-primary text-[13px] font-black focus:outline-none focus:border-text-accent transition-all uppercase placeholder:opacity-10 appearance-none shadow-inner tracking-widest"
                        />
                    </div>

                    <div className="group/field">
                        <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] mb-4 group-focus-within/field:text-text-accent transition-colors opacity-70">
                            :: ACCESS_TOKEN_BUFFER
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-8 py-5 bg-bg-base border-2 border-border-default text-text-primary text-[13px] font-black focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner tracking-widest"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-8 bg-text-primary border-4 border-text-primary py-6 text-[14px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[1em] transition-all disabled:opacity-20 mt-10 active:scale-95 group/btn shadow-[0_0_60px_rgba(var(--text-primary),0.2)] relative overflow-hidden ring-4 ring-inset ring-black/5"
                    >
                        {isLoading && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                        <span className="relative z-10 flex items-center gap-6 group-hover/btn:tracking-[1.2em] transition-all">
                            {isLoading ? 'SYNCING_CREDENTIALS...' : '[ EXECUTE_LOGIN_COMMIT ]'}
                            {!isLoading && <span className="text-xl group-hover/btn:translate-x-6 transition-all opacity-40">&rsaquo;</span>}
                        </span>
                    </button>
                </form>

                <div className="mt-20 pt-10 border-t-2 border-border-default/20 text-center opacity-40 group-hover:opacity-100 transition-all duration-700">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] italic flex items-center justify-center gap-6">
                        <div className="h-px w-8 bg-border-default"></div>
                        FEDERACION_NACIONAL_CAFETEROS_COLOMBIA
                        <div className="h-px w-8 bg-border-default"></div>
                    </p>
                    <p className="text-[8px] font-black text-border-strong uppercase tracking-[1em] mt-4 opacity-30">ENCRYPTED_ENDPOINT // ADDR_0x77AF</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
