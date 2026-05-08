import { useState } from "react";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";
import DataTablePagination from "./DataTablePagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type PaginationState } from "@tanstack/react-table";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    title?: string;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
    error?: string | null;
    emptyMessage?: string;
}

export default function DataTable<T extends object>({
    columns,
    data,
    title,
    pageSizeOptions = [10, 20, 30, 40, 50],
    defaultPageSize = 10,
    error,
    emptyMessage = "No se encontraron datos.",
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
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
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const renderContent = () => {
        if (error) {
            return <p>{error}</p>;
        }

        if (table.getRowModel().rows.length === 0) {
            return <p>{emptyMessage}</p>;
        }

        return (
            <>
                <table>
                    {title && <caption>{title}</caption>}
                    <DataTableHead table={table} />
                    <DataTableBody table={table} />
                </table>
                <DataTablePagination
                    table={table}
                    pageSizeOptions={pageSizeOptions}
                />
            </>
        );
    }

    return (
        <div>
            {(!error && table.getRowModel().rows.length === 0 && title) && <h2>{title}</h2>}
            {error && title && <h2>{title}</h2>}
            {renderContent()}
        </div>
    );
}