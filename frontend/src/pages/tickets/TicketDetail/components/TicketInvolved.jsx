import { UserIcon, ComputerDesktopIcon, UsersIcon } from '@heroicons/react/24/outline';

export const TicketInvolved = ({ ticket }) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 print-section">
            <h3 className="text-[11px] font-bold uppercase text-charcoal-400 tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4 print-section-title">
                <UsersIcon className="w-4 h-4 text-primary" />
                Intervinientes y Activos
            </h3>
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 no-print border border-blue-500/10">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-charcoal-400 block mb-1 uppercase tracking-widest opacity-70">Solicitante Externo</span>
                        <p className="text-[14px] font-bold text-charcoal-800 capitalize tracking-tight leading-none mb-1">{ticket.funcionario?.nombre?.toLowerCase()}</p>
                        <p className="text-[11px] font-medium text-charcoal-400 capitalize">{ticket.funcionario?.area?.toLowerCase() || 'sin área corporativa'}</p>
                    </div>
                </div>
                {ticket.activo && (
                    <div className="flex items-start gap-4 pt-6 border-t border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 no-print border border-purple-500/10">
                            <ComputerDesktopIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-charcoal-400 block mb-1 uppercase tracking-widest opacity-70">Infraestructura Vinculada</span>
                            <p className="text-[14px] font-bold text-charcoal-800 tracking-tight leading-none mb-1">PLACA: {ticket.activo.placa}</p>
                            <p className="text-[11px] font-medium text-charcoal-400 capitalize">{ticket.activo.marca?.toLowerCase()} {ticket.activo.modelo?.toLowerCase()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
