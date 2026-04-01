import { UserIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export const TicketInvolved = ({ ticket }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 print-section">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider print-section-title">Información del Solicitante y Equipo</h3>
            <div className="grid">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 no-print">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Solicitante</span>
                        <p className="text-sm font-semibold text-gray-900">{ticket.funcionario?.nombre}</p>
                        <p className="text-xs text-gray-500">{ticket.funcionario?.area || 'Sin área'}</p>
                    </div>
                </div>
                {ticket.activo && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 no-print">
                            <ComputerDesktopIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Activo Vinculado</span>
                            <p className="text-sm font-semibold text-gray-900">PLACA: {ticket.activo.placa}</p>
                            <p className="text-xs text-gray-500">{ticket.activo.marca} {ticket.activo.modelo}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
