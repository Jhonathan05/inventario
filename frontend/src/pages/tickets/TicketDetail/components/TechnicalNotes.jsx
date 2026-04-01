import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export const TechnicalNotes = ({ 
    ticket, 
    localTicket, 
    setLocalTicket, 
    handleGuardarNotasTecnicas, 
    saving 
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print-section">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 print-section-title">
                <ChatBubbleLeftIcon className="w-5 h-5 text-indigo-500 no-print" /> Documentación de la Solución Técnica
            </h2>
            <div className="space-y-4">
                <div className="grid-1-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Diagnóstico y Solución Técnica Aplicada</label>
                    <textarea
                        rows="6"
                        value={localTicket?.solucionTecnica ?? ticket?.solucionTecnica ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), solucionTecnica: e.target.value }))}
                        className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none font-mono"
                        placeholder="Documenta aquí los pasos técnicos realizados..."
                    />
                </div>
                <div className="grid-1-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Conclusiones y Recomendaciones</label>
                    <textarea
                        rows="3"
                        value={localTicket?.conclusiones ?? ticket?.conclusiones ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), conclusiones: e.target.value }))}
                        className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Resumen final del cierre del caso..."
                    />
                </div>
                <div className="flex justify-end no-print">
                    <button
                        onClick={handleGuardarNotasTecnicas}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Notas Técnicas'}
                    </button>
                </div>
            </div>
        </div>
    );
};
