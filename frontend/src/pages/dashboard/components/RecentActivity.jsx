
import { formatDate } from '../../../lib/utils';

const RecentActivity = ({ activity }) => {
    if (!activity || activity.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No hay actividad reciente.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {activity.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex space-x-3">
                            <div className={`
                                flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white
                                ${item.type === 'MANTENIMIENTO' ? 'bg-orange-500' : 'bg-blue-500'}
                            `}>
                                {item.type === 'MANTENIMIENTO' ? '🔧' : '👤'}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">{item.description}</h3>
                                    <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Por: <span className="font-medium text-gray-700">{item.user}</span>
                                    </p>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                        ${item.status === 'FINALIZADO' || item.status === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                                            item.status === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}
                                    `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivity;
