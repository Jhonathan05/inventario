import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { formatDate } from '../../../lib/utils';

const RecentActivity = ({ activity }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    if (!activity || activity.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No hay actividad reciente.
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activity.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activity.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            </div>

            <ul className="divide-y divide-gray-200 flex-1">
                {currentItems.map((item) => (
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
                                    <h3 className="text-sm font-medium text-gray-900 truncate pr-2 max-w-[200px] sm:max-w-md">{item.description}</h3>
                                    <p className="text-sm text-gray-500 flex-shrink-0">{new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 truncate pr-2">
                                        Por: <span className="font-medium text-gray-700">{item.user}</span>
                                    </p>
                                    <span className={`inline-flex flex-shrink-0 items-center rounded-full px-2.5 py-0.5 text-[0.65rem] sm:text-xs font-medium uppercase tracking-wider
                                        ${item.status === 'FINALIZADO' || item.status === 'DISPONIBLE' ? 'bg-emerald-100/50 text-emerald-700 border border-emerald-200' :
                                            item.status === 'EN_PROCESO' ? 'bg-amber-100/50 text-amber-700 border border-amber-200' :
                                                'bg-charcoal-100 text-charcoal-700 border border-charcoal-200'}
                                    `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Pagination UI integrada para RecentActivity */}
            {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between mt-auto">
                    <div className="text-xs text-gray-500">
                        Mostrando <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> a{' '}
                        <span className="font-medium text-gray-900">
                            {Math.min(indexOfLastItem, activity.length)}
                        </span> de <span className="font-medium text-gray-900">{activity.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-md border text-sm transition-colors ${currentPage === 1
                                    ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-700 hover:bg-white bg-gray-50'
                                }`}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className={`p-1 rounded-md border text-sm transition-colors ${currentPage === totalPages
                                    ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'border-gray-300 text-gray-700 hover:bg-white bg-gray-50'
                                }`}
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
