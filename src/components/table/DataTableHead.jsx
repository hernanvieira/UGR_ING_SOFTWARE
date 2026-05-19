import React from "react";
import { IconArrowsSort, IconSortAscending, IconSortDescending, IconFolders } from "@tabler/icons-react";
import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";

export default function DataTableHead({ table }) {
    const renderHeaderContent = (header) => {
        return header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext());
    };

    const renderSortIndicator = (header) => {
        const sorted = header.column.getIsSorted();
        const iconClass = clsx("text-slate-400 transition-colors group-hover:text-slate-600", {
            "text-indigo-600": sorted
        });

        if (sorted === "asc") {
            return <IconSortAscending size={14} className={iconClass} />;
        }
        if (sorted === "desc") {
            return <IconSortDescending size={14} className={iconClass} />;
        }
        return <IconArrowsSort size={14} className={iconClass} />;
    };

    const renderHeaderActions = (header) => {
        const canSort = header.column.getCanSort();
        const canGroup = header.column.getCanGroup();
        const isGrouped = header.column.getIsGrouped();

        return (
            <div className="flex items-center gap-1.5 ml-2">
                {canSort && (
                    <div
                        className="cursor-pointer p-1 hover:bg-slate-100 rounded transition-colors group"
                        onClick={header.column.getToggleSortingHandler()}
                        title="Ordenar por esta columna"
                    >
                        {renderSortIndicator(header)}
                    </div>
                )}
                {canGroup && (
                    <button
                        type="button"
                        className={clsx(
                            "p-1 rounded transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-100",
                            {
                                "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700": isGrouped
                            }
                        )}
                        onClick={() => header.column.toggleGrouping()}
                        title={isGrouped ? "Desagrupar" : "Agrupar por esta columna"}
                    >
                        <IconFolders size={14} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <thead className="bg-[#f8fafc] border-b border-slate-100" style={{ borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-500 align-middle text-left"
                            style={{ width: header.column.columnDef.width }}
                        >
                            <div className="flex items-center justify-between gap-1">
                                <span className="flex-1 select-none">
                                    {renderHeaderContent(header)}
                                </span>
                                {renderHeaderActions(header)}
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
}
