import React, { useState, useEffect, useRef } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

// Combobox de búsqueda de funcionarios por nombre o documento
const FuncionarioSearch = ({ label, funcionarios, value, onChange, excludeId = null, placeholder = '-- Buscar funcionario --' }) => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = funcionarios.find(f => f.id == value);

    const filtered = funcionarios
        .filter(f => excludeId == null || f.id !== parseInt(excludeId))
        .filter(f => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                f.nombre?.toLowerCase().includes(q) ||
                f.codigoPersonal?.toLowerCase().includes(q) ||
                f.cargo?.toLowerCase().includes(q)
            );
        });

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (f) => {
        onChange(f.id);
        setQuery('');
        setOpen(false);
    };

    const handleClear = () => {
        onChange('');
        setQuery('');
    };

    return (
        <div ref={ref} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {selected ? (
                // Chip del funcionario seleccionado
                <div className="flex items-center gap-2 p-2 border border-indigo-300 rounded-md bg-indigo-50">
                    <div className="flex-1">
                        <span className="font-medium text-indigo-900">{selected.nombre}</span>
                        {selected.codigoPersonal && <span className="ml-2 text-xs text-indigo-600">Doc: {selected.codigoPersonal}</span>}
                        {selected.cargo && <span className="ml-2 text-xs text-gray-500">— {selected.cargo}</span>}
                    </div>
                    <button type="button" onClick={handleClear} className="text-indigo-400 hover:text-red-500 text-lg leading-none" title="Cambiar funcionario">✕</button>
                </div>
            ) : (
                // Input de búsqueda
                <div>
                    <input
                        type="text"
                        autoComplete="off"
                        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm"
                        placeholder={placeholder}
                        value={query}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    />
                    {open && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500">No se encontraron resultados</div>
                            ) : (
                                filtered.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 border-b border-gray-100 last:border-0"
                                        onClick={() => handleSelect(f)}
                                    >
                                        <span className="font-medium text-gray-900">{f.nombre}</span>
                                        {f.codigoPersonal && <span className="ml-2 text-xs text-gray-500">Doc: {f.codigoPersonal}</span>}
                                        {f.cargo && <span className="ml-2 text-xs text-gray-400">— {f.cargo}</span>}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GenerarActa = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Datos del formulario
    const [formData, setFormData] = useState({
        tipo: 'ASIGNACION', // ASIGNACION, DEVOLUCION, TRASLADO
        funcionarioId: '',
        funcionarioDestinoId: '', // Para TRASLADO
        activosIds: [],
        observaciones: ''
    });

    // Listas cargadas
    const [funcionarios, setFuncionarios] = useState([]);
    const [activosDisponibles, setActivosDisponibles] = useState([]);

    useEffect(() => {
        loadFuncionarios();
    }, []);

    // Cargar activos cuando cambia el tipo o el funcionario
    useEffect(() => {
        if (formData.tipo && formData.funcionarioId) {
            loadActivosValidos();
        } else {
            setActivosDisponibles([]);
        }
    }, [formData.tipo, formData.funcionarioId]);

    const loadFuncionarios = async () => {
        try {
            const res = await axios.get('/funcionarios');
            setFuncionarios(res.data);
        } catch (err) {
            console.error('Error cargando funcionarios', err);
        }
    };

    const loadActivosValidos = async () => {
        try {
            setLoading(true);
            let params = {};

            if (formData.tipo === 'ASIGNACION') {
                // Buscar activos DISPONIBLES
                // Endpoint inventario soporta filtros?
                // Mejor: Usar el endpoint de reporte inventario que tiene filtros potentes
                // O un endpoint específico de activos
                params = { estado: 'DISPONIBLE' };
            } else if (formData.tipo === 'DEVOLUCION' || formData.tipo === 'TRASLADO') {
                // Buscar activos ASIGNADOS al funcionario
                // Podemos filtrar por asignaciones actuales
                // Necesitamos un endpoint que nos de los activos de un funcionario
                params = {
                    asignadoA: formData.funcionarioId,
                    estado: 'ASIGNADO'
                    // El backend debe soportar filtrar por 'asignadoA' en /activos o /reportes/por-funcionario 
                };
            }

            let url = '/activos';
            if (formData.tipo === 'ASIGNACION') {
                url = '/activos?estado=DISPONIBLE';
            } else {
                url = `/activos?funcionarioId=${formData.funcionarioId}`;
            }

            const res = await axios.get(url);

            setActivosDisponibles(res.data || []);

        } catch (err) {
            console.error('Error cargando activos', err);
            setActivosDisponibles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                tipo: formData.tipo,
                funcionarioId: formData.funcionarioId,
                funcionarioDestinoId: formData.funcionarioDestinoId,
                activosIds: formData.activosIds,
                observaciones: formData.observaciones
            };

            const res = await axios.post('/actas/generar', payload);

            // Descargar archivo
            const link = document.createElement('a');
            link.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}${res.data.archivoUrl}`;
            link.setAttribute('download', 'Acta.xls');
            document.body.appendChild(link);
            link.click();
            link.remove();

            alert('Acta generada exitosamente!');
            navigate('/actas'); // Volver al historial

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al generar el acta');
        } finally {
            setLoading(false);
        }
    };

    const toggleActivo = (id) => {
        setFormData(prev => {
            const exists = prev.activosIds.includes(id);
            if (exists) {
                return { ...prev, activosIds: prev.activosIds.filter(x => x !== id) };
            } else {
                return { ...prev, activosIds: [...prev.activosIds, id] };
            }
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Generar Novedad de Activo</h1>

            {/* Steps */}
            <div className="flex mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`flex-1 text-center py-2 border-b-4 ${step >= i ? 'border-indigo-600 text-indigo-800 font-bold' : 'border-gray-200 text-gray-400'}`}>
                        Paso {i}: {i === 1 ? 'Tipo y Funcionario' : i === 2 ? 'Selección de Activos' : 'Confirmación'}
                    </div>
                ))}
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">

                {/* PASO 1 */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Novedad</label>
                            <div className="flex space-x-4">
                                {['ASIGNACION', 'DEVOLUCION', 'TRASLADO'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData({ ...formData, tipo: t, activosIds: [] })}
                                        className={`px-4 py-2 rounded-md font-medium flex-1 ${formData.tipo === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <FuncionarioSearch
                            label={
                                formData.tipo === 'ASIGNACION' ? 'Funcionario que Recibe' :
                                    formData.tipo === 'TRASLADO' ? 'Funcionario Origen (Entrega)' : 'Funcionario que Entrega'
                            }
                            funcionarios={funcionarios}
                            value={formData.funcionarioId}
                            onChange={(id) => setFormData({ ...formData, funcionarioId: id, activosIds: [], funcionarioDestinoId: '' })}
                            placeholder="🔍 Buscar por nombre, documento o cargo..."
                        />

                        {formData.tipo === 'TRASLADO' && (
                            <FuncionarioSearch
                                label="Funcionario Destino (Recibe)"
                                funcionarios={funcionarios}
                                value={formData.funcionarioDestinoId}
                                onChange={(id) => setFormData({ ...formData, funcionarioDestinoId: id })}
                                excludeId={formData.funcionarioId}
                                placeholder="🔍 Buscar por nombre, documento o cargo..."
                            />
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                disabled={!formData.funcionarioId || (formData.tipo === 'TRASLADO' && !formData.funcionarioDestinoId)}
                                onClick={() => setStep(2)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 2 */}
                {step === 2 && (
                    <div>
                        <h3 className="text-lg font-medium mb-4">
                            Seleccione Activos ({formData.activosIds.length})
                        </h3>

                        {loading ? (
                            <div className="text-center py-10">Cargando activos...</div>
                        ) : activosDisponibles.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No se encontraron activos {formData.tipo === 'ASIGNACION' ? 'DISPONIBLES' : 'ASIGNADOS'} para este funcionario.
                            </div>
                        ) : (
                            <>
                                {/* Buscador */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="🔍 Buscar por serial, placa o nombre..."
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-[400px] overflow-y-auto border rounded-md">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 w-10">
                                                    <input
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            const term = searchTerm.toLowerCase();
                                                            const visibles = activosDisponibles.filter(a =>
                                                                !term ||
                                                                a.placa?.toLowerCase().includes(term) ||
                                                                a.serial?.toLowerCase().includes(term) ||
                                                                (a.tipo || a.descripcion)?.toLowerCase().includes(term)
                                                            );

                                                            if (e.target.checked) {
                                                                const newIds = [...new Set([...formData.activosIds, ...visibles.map(a => a.id)])];
                                                                setFormData({ ...formData, activosIds: newIds });
                                                            } else {
                                                                const visibleIds = visibles.map(a => a.id);
                                                                setFormData({ ...formData, activosIds: formData.activosIds.filter(id => !visibleIds.includes(id)) });
                                                            }
                                                        }}
                                                        checked={
                                                            activosDisponibles.length > 0 &&
                                                            activosDisponibles
                                                                .filter(a => !searchTerm || (a.placa?.toLowerCase().includes(searchTerm.toLowerCase()) || a.serial?.toLowerCase().includes(searchTerm.toLowerCase()) || (a.tipo || a.descripcion)?.toLowerCase().includes(searchTerm.toLowerCase())))
                                                                .every(a => formData.activosIds.includes(a.id))
                                                        }
                                                    />
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial/Placa</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {activosDisponibles
                                                .filter(activo => {
                                                    const term = searchTerm.toLowerCase();
                                                    return !term ||
                                                        activo.placa?.toLowerCase().includes(term) ||
                                                        activo.serial?.toLowerCase().includes(term) ||
                                                        (activo.tipo || activo.descripcion || '').toLowerCase().includes(term);
                                                })
                                                .map(activo => (
                                                    <tr key={activo.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.activosIds.includes(activo.id)}
                                                                onChange={() => toggleActivo(activo.id)}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">{activo.tipo || activo.descripcion}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <div className="font-medium">{activo.placa}</div>
                                                            <div className="text-gray-500 text-xs">{activo.serial}</div>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">{activo.marca} {activo.modelo}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                            >
                                Atrás
                            </button>
                            <button
                                disabled={formData.activosIds.length === 0}
                                onClick={() => setStep(3)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 3 */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium text-gray-900 mb-2">Resumen</h3>
                            <p><strong>Tipo:</strong> {formData.tipo}</p>
                            <p><strong>Funcionario:</strong> {funcionarios.find(f => f.id == formData.funcionarioId)?.nombre}</p>
                            {formData.funcionarioDestinoId && (
                                <p><strong>Destino:</strong> {funcionarios.find(f => f.id == formData.funcionarioDestinoId)?.nombre}</p>
                            )}
                            <p><strong>Activos seleccionados:</strong> {formData.activosIds.length}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Observaciones (Opcional)
                            </label>
                            <textarea
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                rows="3"
                                value={formData.observaciones}
                                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                placeholder="Comentarios adicionales para el acta..."
                            ></textarea>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(2)}
                                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 flex items-center shadow-lg transform active:scale-95 transition-all"
                            >
                                {loading ? 'Generando...' : '📄 Generar Acta y Realizar Movimiento'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerarActa;
