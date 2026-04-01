import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import api from '../../lib/axios';

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const AsignarActivoModal = ({ open, onClose, activo }) => {
    const [selectedFuncionarioId, setSelectedFuncionarioId] = useState('');
    const [tipo, setTipo] = useState('ASIGNACION');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setTipo(activo?.estado === 'ASIGNADO' ? 'TRASLADO' : 'ASIGNACION');
        }
    }, [open, activo]);

    const { data: funcionariosRaw = [] } = useQuery({
        queryKey: ['funcionarios', 'activos'],
        queryFn: () => funcionariosService.getAll({ activo: true, limit: 500 }).then(r => r.data || r),
        enabled: !!open,
        staleTime: 1000 * 60 * 2,
    });
    const funcionarios = sortList(funcionariosRaw);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/asignaciones', {
                activoId: activo.id,
                funcionarioId: selectedFuncionarioId,
                tipo,
                observaciones
            });
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar movimiento');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {tipo === 'ASIGNACION' ? 'Asignar Activo' : 'Trasladar Activo'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Equipo: <span className="font-semibold text-gray-900">{activo.marca} {activo.modelo} ({activo.placa})</span>
                    </p>

                    {error && <div className="mb-4 text-sm text-red-600 font-medium">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Funcionario Receptor *</label>
                            <select
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={selectedFuncionarioId}
                                onChange={(e) => setSelectedFuncionarioId(e.target.value)}
                            >
                                <option value="">Seleccione un funcionario...</option>
                                {funcionarios.map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.nombre} ({f.cedula}) - {f.area}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="ASIGNACION">ASIGNACIÓN INICIAL</option>
                                <option value="TRASLADO">TRASLADO ENTRE FUNCIONARIOS</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Observaciones (opcional)</label>
                            <textarea
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                placeholder="Estado del equipo, accesorios incluidos, etc."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading || !selectedFuncionarioId} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Procesando...' : 'Confirmar Movimiento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AsignarActivoModal;
