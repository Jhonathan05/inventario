import { useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

const DocumentosList = ({ activoId, documentos, onUpdate }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Documentos Adjuntos</h3>
                {canEdit && (
                    <div>
                        <label htmlFor="file-upload" className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                            {canEdit && <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {documentos?.map((doc) => (
                            <tr key={doc.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 text-indigo-600 hover:text-indigo-900">
                                    <a href={doc.ruta.startsWith('/') ? doc.ruta : `/${doc.ruta}`} target="_blank" rel="noopener noreferrer">
                                        {doc.nombre}
                                    </a>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{doc.tipo.split('/')[1]}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(doc.creadoEn).toLocaleDateString()}</td>
                                {canEdit && (
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                                        <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900 ml-4">
                                            Eliminar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {(!documentos || documentos.length === 0) && (
                            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No hay documentos adjuntos</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentosList;
