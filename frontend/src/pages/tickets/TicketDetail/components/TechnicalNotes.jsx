import { ChatBubbleLeftRightIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const TechnicalNotes = ({ 
    ticket, 
    localTicket, 
    setLocalTicket, 
    handleGuardarNotasTecnicas, 
    saving 
}) => {
    return (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 print-section">
            <h2 className="text-[15px] font-black text-charcoal-900 mb-8 flex items-center gap-3 border-b border-gray-50 pb-5 print-section-title">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary" /> 
                Documentación de la Solución Técnica
            </h2>
            <div className="space-y-8">
                <div className="grid-1-col">
                    <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2.5 opacity-70">Bitácora de Procedimiento Aplicado</label>
                    <textarea
                        rows="6"
                        value={localTicket?.solucionTecnica ?? ticket?.solucionTecnica ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), solucionTecnica: e.target.value }))}
                        className="w-full text-[13px] font-medium p-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed text-charcoal-700"
                        placeholder="Documenta aquí los pasos técnicos realizados..."
                    />
                </div>
                <div className="grid-1-col">
                    <label className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2.5 opacity-70">Conclusiones y Recomendaciones</label>
                    <textarea
                        rows="3"
                        value={localTicket?.conclusiones ?? ticket?.conclusiones ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), conclusiones: e.target.value }))}
                        className="w-full text-[13px] font-medium p-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed text-charcoal-700"
                        placeholder="Resumen final del cierre del caso..."
                    />
                </div>
                <div className="flex justify-end no-print pt-4">
                    <button
                        onClick={handleGuardarNotasTecnicas}
                        disabled={saving}
                        className="bg-charcoal-900 text-white px-10 py-4 rounded-full hover:bg-black flex items-center gap-2 shadow-lg shadow-charcoal-900/10 transition-all font-black text-[11px] uppercase tracking-widest border border-charcoal-900 disabled:opacity-50"
                    >
                        <CloudArrowUpIcon className="w-5 h-5" />
                        {saving ? 'Procesando...' : 'Fijar Memoria Técnica'}
                    </button>
                </div>
            </div>
        </div>
    );
};
