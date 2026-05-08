import { IconAlertCircle, IconDatabaseOff, IconLoader2, IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import { type Table, flexRender, type Row } from "@tanstack/react-table";

interface DataTableBodyProps<T> {
    table: Table<T>;
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
}

export default function DataTableBody<T>({ table, isLoading, error, emptyMessage }: DataTableBodyProps<T>) {
    const columnsCount = table.getVisibleLeafColumns().length;
    const rows = table.getRowModel().rows;

    const renderLoadingMessage = () => {
        if (!isLoading) return null;
        return (
            <tr className="data-table-status-row">
                <td colSpan={columnsCount} className="data-table-loading">
                    <div className="data-table-status-container">
                        <IconLoader2 size={20} className="animate-spin-slow" />
                        <span>Cargando datos...</span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderErrorMessage = () => {
        if (!error || isLoading) return null;
        return (
            <tr className="data-table-status-row">
                <td colSpan={columnsCount} className="data-table-error">
                    <div className="data-table-status-container">
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
            <tr className="data-table-status-row">
                <td colSpan={columnsCount} className="data-table-empty">
                    <div className="data-table-status-container">
                        <IconDatabaseOff size={20} />
                        <span>{emptyMessage}</span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderGroupedRow = (row: Row<T>) => {
        const groupedCell = row.getVisibleCells().find(cell => cell.getIsGrouped());
        const columnHeader = groupedCell?.column.columnDef.header as string;

        return (
            <tr key={row.id} className="data-table-group-row" onClick={row.getToggleExpandedHandler()}>
                <td colSpan={columnsCount}>
                    <div className="group-row-content" style={{ paddingLeft: `${row.depth * 2}rem` }}>
                        {row.getCanExpand() && (
                            <span className="group-row-icon">
                                {row.getIsExpanded() ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                            </span>
                        )}
                        <span className="group-row-label">
                            {columnHeader}:
                        </span>
                        <span className="group-row-value">
                            {groupedCell
                                ? flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())
                                : "Grupo"}
                        </span>
                        <span className="group-row-count">
                            {row.subRows.length}
                        </span>
                    </div>
                </td>
            </tr>
        );
    };

    const renderDataRow = (row: Row<T>) => (
        <tr key={row.id} className="data-table-row">
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
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
        <tbody>
            {renderLoadingMessage()}
            {renderErrorMessage()}
            {renderEmptyMessage()}
            {renderRows()}
        </tbody>
    );
}