import { useState } from "react";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";
import DataTablePagination from "./DataTablePagination";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    type ColumnDef,
    type SortingState,
    type PaginationState,
    type GroupingState,
    type ExpandedState
} from "@tanstack/react-table";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    title?: string;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
}

export default function DataTable<T extends object>({
    columns,
    data,
    title,
    pageSizeOptions = [10, 20, 30, 40, 50],
    defaultPageSize = 10,
    isLoading,
    error,
    emptyMessage = "No se encontraron datos.",
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            grouping,
            expanded,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGroupingChange: setGrouping,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    const isDataLoaded = !isLoading && !error && table.getRowModel().rows.length > 0;

    return (
        <div className="data-table-wrapper">
            {title && <h2 className="data-table-title">{title}</h2>}

            <div className="data-table-container">
                <table className="data-table">
                    <DataTableHead table={table} />
                    <DataTableBody
                        table={table}
                        isLoading={isLoading}
                        error={error}
                        emptyMessage={emptyMessage}
                    />
                </table>
            </div>

            {isDataLoaded && (
                <DataTablePagination
                    table={table}
                    pageSizeOptions={pageSizeOptions}
                />
            )}
        </div>
    );
}