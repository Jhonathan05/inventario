import React from 'react';

export const SectionHeader = ({ title, icon }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-indigo-100">
        <span className="text-lg">{icon}</span>
        <h4 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{title}</h4>
    </div>
);

export const Field = ({ label, required, children }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);

export const inputCls = "block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm p-2";
export const selectCls = `${inputCls} bg-white`;
