import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRightEndOnRectangleIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-fnc-50">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-fnc-200/40 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-fnc-100/50 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="glass w-full max-w-md p-8 relative z-10 animate-slide-up bg-white/80">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-fnc-50 rounded-xl mb-4 text-fnc-600 shadow-sm border border-fnc-100">
                        <ArrowRightEndOnRectangleIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fnc-700 to-fnc-500">
                        Inventario TIC
                    </h1>
                    <p className="text-charcoal-500 mt-2 font-medium">Inicia sesión para continuar</p>
                </div>

                {error && (
                    <div className="p-3 mb-6 bg-red-500/10 text-red-600 rounded-lg text-sm text-center font-medium border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="input-group">
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                            <UserIcon className="w-4 h-4" /> Correo Electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="usuario@cafedecolombia.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white border border-charcoal-200 rounded-xl text-charcoal-800 text-base transition-colors duration-200 focus:outline-none focus:border-fnc-500 focus:ring-1 focus:ring-fnc-500"
                        />
                    </div>

                    <div className="input-group">
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700 mb-2">
                            <LockClosedIcon className="w-4 h-4" /> Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white border border-charcoal-200 rounded-xl text-charcoal-800 text-base transition-colors duration-200 focus:outline-none focus:border-fnc-500 focus:ring-1 focus:ring-fnc-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-fnc-600 to-fnc-700 text-white shadow-md shadow-fnc-600/30 hover:from-fnc-500 hover:to-fnc-600 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 border-none active:scale-[0.97] mt-6 h-14"
                    >
                        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-charcoal-400 font-medium">
                    <p>Federación Nacional de Cafeteros de Colombia</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
