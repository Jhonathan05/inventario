/**
 * Pagination — Componente genérico de paginación server-side.
 * Props:
 *  - currentPage  (number)
 *  - totalPages   (number)
 *  - totalItems   (number)
 *  - itemsPerPage (number)
 *  - currentCount (number) — cuántos registros hay en la página actual
 *  - onPageChange (fn)
 */
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, currentCount, onPageChange }) => {
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = indexOfFirstItem + currentCount - 1;

    if (totalItems === 0) return null;

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border border-border-default bg-bg-surface px-4 py-3 sm:px-6 font-mono">
            {/* Desktop */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    PÁGINA <span className="text-text-primary">{currentPage}</span> / <span className="text-text-primary">{totalPages}</span> | TOTAL <span className="text-text-primary">{totalItems}</span>
                </p>
                <nav className="isolate inline-flex -space-x-px border border-border-default" aria-label="Pagination">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated disabled:opacity-30 border-r border-border-default transition-colors text-sm font-bold"
                    >
                        <span className="sr-only">Anterior</span>
                        &lt;
                    </button>
                    <span className="relative inline-flex items-center px-6 py-2 text-[10px] font-bold text-text-primary uppercase tracking-widest bg-bg-base">
                        curr_page: {currentPage}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated disabled:opacity-30 border-l border-border-default transition-colors text-sm font-bold"
                    >
                        <span className="sr-only">Siguiente</span>
                        &gt;
                    </button>
                </nav>
            </div>
            {/* Mobile */}
            <div className="flex flex-1 justify-between sm:hidden w-full gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center border border-border-default bg-bg-base px-4 py-2 text-[10px] font-bold text-text-primary hover:bg-bg-muted disabled:opacity-30 uppercase tracking-widest transition-colors flex-1 justify-center"
                >
                    &lt;_prev
                </button>
                <div className="flex items-center px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    p_ {currentPage} / {totalPages}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center border border-border-default bg-bg-base px-4 py-2 text-[10px] font-bold text-text-primary hover:bg-bg-muted disabled:opacity-30 uppercase tracking-widest transition-colors flex-1 justify-center"
                >
                    next_&gt;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
