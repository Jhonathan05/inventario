import { REPORT_TYPES } from '../reportConfigs';

export const ReportTypeSelector = ({ onSelect }) => {
    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Reportes</h1>
                <p className="mt-1 text-sm text-gray-600">Selecciona un tipo de reporte para personalizar y exportar</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {REPORT_TYPES.map((report) => (
                    <button key={report.id} onClick={() => onSelect(report)}
                        className="text-left bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 hover:shadow-md hover:ring-indigo-300 transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{report.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">{report.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
