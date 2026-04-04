import React from 'react';

export const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-6 mb-12 pb-8 border-b-4 border-border-default shadow-sm">
        <span className="text-2xl font-black text-text-accent animate-pulse">[ &gt;RX ]</span>
        <h4 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] leading-none">{title.replace(/ /g, '_')}</h4>
        <div className="flex-1 h-[2px] bg-border-default/20 ml-4 italic opacity-20 text-[9px] font-black uppercase tracking-[1em]">BLOCK_INITIALIZED</div>
    </div>
);

export const Field = ({ label, required, children }) => (
    <div className="font-mono space-y-4 group/field relative">
        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.4em] group-focus-within/field:text-text-accent transition-colors italic">
            :: {label}{required && <span className="text-text-accent ml-3 font-black animate-pulse opacity-60">[!_REQUIRED]</span>}
        </label>
        <div className="relative group/input">
            {children}
            <div className="absolute bottom-0 left-0 h-[2px] bg-text-accent transition-all duration-500 w-0 group-focus-within/input:w-full opacity-60"></div>
        </div>
    </div>
);

export const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[12px] font-black uppercase tracking-[0.15em] text-text-primary placeholder:opacity-10 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner focus:shadow-[0_0_20px_rgba(var(--text-accent),0.05)]";
export const selectCls = `${inputCls} cursor-pointer hover:bg-bg-elevated/40`;
