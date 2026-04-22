import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo2.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-surface">
            {/* Panel izquierdo — Hero institucional */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-end p-12 gradient-primary">
                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10" />
                    <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-white/5" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 mt-auto"
                >
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/15 text-white/90 backdrop-blur-md">
                            Sistema Institucional
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-4 text-white font-headline">
                        Gestión de<br />
                        Inventario TIC
                    </h1>
                    <p className="text-lg max-w-md leading-relaxed text-white/75">
                        Comité Departamental de Cafeteros del Tolima — Plataforma de control y seguimiento de activos tecnológicos.
                    </p>
                </motion.div>
            </div>

            {/* Panel derecho — Formulario */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="mb-10 text-center">
                        <img
                            src={logo}
                            alt="Logo FNC"
                            className="h-56 w-auto mx-auto mb-4 object-contain"
                        />
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-2 font-headline text-on-surface">
                            Acceso Institucional
                        </h2>
                        <p className="text-[0.95rem] text-on-surface-variant">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2 text-on-surface-variant font-body"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nombre@cafedecolombia.com"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm font-body border border-outline-variant bg-surface-container focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-on-surface"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-2 text-on-surface-variant font-body"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm font-body border border-outline-variant bg-surface-container focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-on-surface"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-3 rounded-xl text-sm bg-error-container text-error"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-sm font-semibold gradient-primary text-on-primary font-headline cursor-pointer disabled:opacity-60 transition-all active:scale-[0.98] shadow-float hover:shadow-ambient"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Ingresando...
                                </span>
                            ) : (
                                'Ingresar al sistema'
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-outline">
                            Federación Nacional de Cafeteros de Colombia
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
