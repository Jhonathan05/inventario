import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const result = await login(email, password);
        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center bg-charcoal-50">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-fnc-700 via-fnc-600 to-fnc-500 fixed top-0 left-0" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
                {/* Logo block */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fnc-600 shadow-lg mb-4">
                        <span className="text-2xl">☕</span>
                    </div>
                    <h1 className="text-2xl font-bold text-fnc-700 tracking-wide">Inventario TIC</h1>
                    <p className="text-sm text-charcoal-500 font-medium mt-0.5">Federación Nacional de Cafeteros — Tolima</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 p-8">
                    <h2 className="text-lg font-semibold text-charcoal-800 mb-1">Iniciar sesión</h2>
                    <p className="text-sm text-charcoal-400 mb-6">Ingresa tus credenciales para continuar</p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 px-3 text-charcoal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-fnc-600 sm:text-sm"
                                placeholder="usuario@cafedecolombia.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-charcoal-700 mb-1.5">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 px-3 text-charcoal-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-fnc-600 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-fnc-50 border border-fnc-200 p-3 text-sm text-fnc-700 font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-fnc-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fnc-700 active:bg-fnc-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fnc-600"
                        >
                            Ingresar
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-charcoal-400">
                    © {new Date().getFullYear()} Federación Nacional de Cafeteros de Colombia
                </p>
            </div>
        </div>
    );
};

export default Login;
