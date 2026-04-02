import React from 'react';

export const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border-default/30">
        <span className="text-xl font-black text-text-primary">[ &gt;RX ]</span>
        <h4 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">{title.replace(/ /g, '_')}</h4>
    </div>
);

export const Field = ({ label, required, children }) => (
    <div className="font-mono space-y-3">
        <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
            :: {label}{required && <span className="text-text-accent ml-2 font-black">[!_REQUIRED]</span>}
        </label>
        {children}
    </div>
);

export const inputCls = "block w-full bg-bg-base border border-border-default py-3 px-4 text-[11px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-border-strong transition-all appearance-none";
export const selectCls = `${inputCls} appearance-none cursor-pointer`;
