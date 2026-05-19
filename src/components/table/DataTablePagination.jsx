import React from "react";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight
} from "@tabler/icons-react";

export default function DataTablePagination({ table, pageSizeOptions }) {
    const pageCount = table.getPageCount();
    const isMultiPage = pageCount > 1;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    title="Primera página"
                >
                    <IconChevronsLeft size={16} />
                </button>
                <button
                    type="button"
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    title="Página anterior"
                >
                    <IconChevronLeft size={16} />
                </button>
                <button
                    type="button"
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    title="Siguiente página"
                >
                    <IconChevronRight size={16} />
                </button>
                <button
                    type="button"
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                    title="Última página"
                >
                    <IconChevronsRight size={16} />
                </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span>
                    Página <strong className="text-slate-800">{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong className="text-slate-800">{pageCount}</strong>
                </span>

                <div className="flex items-center gap-3">
                    {isMultiPage && (
                        <span className="flex items-center gap-1.5">
                            | Ir a:
                            <input
                                type="number"
                                value={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                                className="w-12 px-1.5 py-1 border border-slate-200 rounded-md text-center text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </span>
                    )}
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-slate-600 font-medium cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        {pageSizeOptions.map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Mostrar {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
