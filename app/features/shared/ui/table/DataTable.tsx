import { useState } from "react";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";
import DataTablePagination from "./DataTablePagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef, type SortingState, type PaginationState } from "@tanstack/react-table";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
}

export default function DataTable<T extends object>(props: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: props.data,
        columns: props.columns,
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

    return (
        <div>
            <table>
                <DataTableHead table={table} />
                <DataTableBody table={table} />
            </table>
            <DataTablePagination table={table} />
        </div>
    );
}