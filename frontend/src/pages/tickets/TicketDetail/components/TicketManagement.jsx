import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { generateTicketReport } from '../reports/TicketReport';

export const TicketManagement = ({ 
    ticket, 
    user, 
    tecnicoAsignado, 
    setTecnicoAsignado, 
    tecnicos, 
    handleAsignarTecnico, 
    nuevoEstado, 
    setNuevoEstado, 
    handleCambiarEstado 
}) => {
    return (
        <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 no-print">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Gestión del Caso</h3>
            <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Analista Asignado</label>
                <div className="flex gap-2">
                    <select value={tecnicoAsignado} onChange={e => setTecnicoAsignado(e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-md shadow-sm bg-white focus:ring-blue-500">
                        <option value="">-- Sin Asignar --</option>
                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                    <button onClick={handleAsignarTecnico}
                        disabled={String(tecnicoAsignado) === String(ticket.asignadoAId || '')}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                        Asignar
                    </button>
                </div>
            </div>
            <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Estado del Caso</label>
                <div className="flex gap-2">
                    <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded-md shadow-sm bg-white focus:ring-blue-500">
                        <option value="CREADO">Creado</option>
                        <option value="EN_CURSO">En Curso</option>
                        <option value="EJECUCION">En Ejecución</option>
                        <option value="SIN_RESPUESTA">Sin Respuesta</option>
                        <option value="RESUELTO">Resuelto</option>
                        <option value="COMPLETADO">Completado</option>
                    </select>
                    <button onClick={handleCambiarEstado} disabled={nuevoEstado === ticket.estado}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                        Actualizar
                    </button>
                </div>
            </div>
            <div className="pt-2">
                <button
                    onClick={() => generateTicketReport(ticket, user)}
                    className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xl"
                >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    GENERAR REPORTE DE CICLO DE VIDA (PDF)
                </button>
            </div>
        </div>
    );
};
