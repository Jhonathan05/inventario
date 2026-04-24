import { useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

const DocumentosList = ({ activoId, documentos, onUpdate }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño (ej. max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('El archivo es demasiado grande (Máx 5MB)');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('activoId', activoId);

        setUploading(true);
        setError('');

        try {
            await api.post('/documentos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate(); // Recargar datos
        } catch (err) {
            console.error(err);
            setError('Error al subir el archivo');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este documento?')) return;
        try {
            await api.delete(`/documentos/${id}`);
            onUpdate();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-charcoal-900 capitalize tracking-tight">Documentos Adjuntos</h3>
                {canEdit && (
                    <div>
                        <label htmlFor="file-upload" className={`btn-primary cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {uploading ? 'Subiendo...' : '+ Subir Documento'}
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                    </div>
                )}
            </div>

            {error && <div className="text-rose-600 font-bold text-xs mb-3 italic">! {error}</div>}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-transparent border-b border-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Nombre del archivo</th>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo</th>
                            <th className="px-6 py-4 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Fecha registro</th>
                            {canEdit && <th className="px-6 py-4 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {documentos?.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="whitespace-nowrap px-6 py-4 text-[13px] font-semibold text-primary hover:underline">
                                    <a href={doc.ruta.startsWith('/') ? doc.ruta : `/${doc.ruta}`} target="_blank" rel="noopener noreferrer">
                                        {doc.nombre?.toLowerCase()}
                                    </a>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="bg-charcoal-50 text-charcoal-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-charcoal-100 uppercase">
                                        {doc.tipo?.split('/')[1] || 'Doc'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-[12px] text-charcoal-500 font-medium">{new Date(doc.creadoEn).toLocaleDateString()}</td>
                                {canEdit && (
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(doc.id)} 
                                            className="text-rose-600 hover:text-rose-800 font-bold text-[11px] hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {(!documentos || documentos.length === 0) && (
                            <tr><td colSpan="4" className="py-12 text-center text-charcoal-300 italic font-bold text-[11px]">No hay documentos adjuntos en este expediente.</td></tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentosList;
