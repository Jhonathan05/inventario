import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck as ShieldCheckIcon, 
    Database as DatabaseIcon, 
    Cloud as CloudIcon 
} from 'lucide-react';
import UsuariosList from '../usuarios/UsuariosList';
import BackupSoporte from '../backup/BackupSoporte';
import ConfiguracionR2 from './components/ConfiguracionR2';

const Administracion = () => {
    const [activeTab, setActiveTab] = useState('usuarios');

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda Unificado */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Administración del Sistema</h1>
                    <p className="page-header-subtitle">
                        Gestión centralizada de usuarios, seguridad y respaldos de información.
                    </p>
                </div>

                {/* Switcher Estilo Agenda */}
                <div className="switcher-container overflow-x-auto max-w-full pb-1 lg:pb-0">
                    <div className="flex min-w-max gap-1">
                        <button 
                            onClick={() => setActiveTab('usuarios')}
                            className={`switcher-item ${activeTab === 'usuarios' ? 'switcher-item-active' : 'switcher-item-inactive'} flex items-center gap-2 whitespace-nowrap`}
                        >
                            <ShieldCheckIcon size={16} />
                            Usuarios
                        </button>
                        <button 
                            onClick={() => setActiveTab('backups')}
                            className={`switcher-item ${activeTab === 'backups' ? 'switcher-item-active' : 'switcher-item-inactive'} flex items-center gap-2 whitespace-nowrap`}
                        >
                            <DatabaseIcon size={16} />
                            Backups
                        </button>
                        <button 
                            onClick={() => setActiveTab('r2')}
                            className={`switcher-item ${activeTab === 'r2' ? 'switcher-item-active' : 'switcher-item-inactive'} flex items-center gap-2 whitespace-nowrap`}
                        >
                            <CloudIcon size={16} />
                            Configuración R2
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'usuarios' && <UsuariosList />}
                    {activeTab === 'backups' && <BackupSoporte />}
                    {activeTab === 'r2' && <ConfiguracionR2 />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Administracion;
