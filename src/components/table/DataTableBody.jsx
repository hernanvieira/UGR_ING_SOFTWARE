import React from "react";
import { IconAlertCircle, IconDatabaseOff, IconLoader2, IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import { flexRender } from "@tanstack/react-table";

export default function DataTableBody({ table, isLoading, error, emptyMessage }) {
    const columnsCount = table.getVisibleLeafColumns().length;
    const rows = table.getRowModel().rows;

    const renderLoadingMessage = () => {
        if (!isLoading) return null;
        return (
            <tr>
                <td colSpan={columnsCount} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                        <IconLoader2 size={20} className="animate-spin text-indigo-500" />
                        <span>Cargando datos...</span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderErrorMessage = () => {
        if (!error || isLoading) return null;
        return (
            <tr>
                <td colSpan={columnsCount} className="px-4 py-8 text-center text-rose-500">
                    <div className="flex items-center justify-center gap-2">
                        <IconAlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderEmptyMessage = () => {
        if (isLoading || error || rows.length > 0) return null;
        return (
            <tr>
                <td colSpan={columnsCount} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                        <IconDatabaseOff size={20} />
                        <span>{emptyMessage}</span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderGroupedRow = (row) => {
        const groupedCell = row.getVisibleCells().find(cell => cell.getIsGrouped());
        const columnHeader = groupedCell?.column.columnDef.header;

        return (
            <tr key={row.id} className="bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer border-b border-slate-100 transition-colors" onClick={row.getToggleExpandedHandler()}>
                <td colSpan={columnsCount} className="px-4 py-3 font-medium text-slate-700">
                    <div className="flex items-center gap-2" style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
                        {row.getCanExpand() && (
                            <span className="text-slate-400">
                                {row.getIsExpanded() ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                            </span>
                        )}
                        <span className="text-xs text-slate-400 uppercase font-semibold">
                            {columnHeader}:
                        </span>
                        <span className="text-sm text-slate-800">
                            {groupedCell
                                ? flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())
                                : "Grupo"}
                        </span>
                        <span className="bg-slate-200/80 text-slate-600 text-xs px-2 py-0.5 rounded-full font-normal">
                            {row.subRows.length}
                        </span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderDataRow = (row) => (
        <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0">
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 align-middle text-sm text-slate-500">
                    {cell.getIsGrouped() || cell.getIsPlaceholder() ? null : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </td>
            ))}
        </tr>
    );

    const renderRows = () => {
        if (isLoading || error || rows.length === 0) return null;
        return rows.map((row) =>
            row.getIsGrouped() ? renderGroupedRow(row) : renderDataRow(row)
        );
    };

    return (
        <tbody className="divide-y divide-slate-100">
            {renderLoadingMessage()}
            {renderErrorMessage()}
            {renderEmptyMessage()}
            {renderRows()}
        </tbody>
    );
}
