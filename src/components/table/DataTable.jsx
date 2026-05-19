import React, { useState } from "react";
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
} from "@tanstack/react-table";

export default function DataTable({
    columns,
    data,
    title,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
    defaultPageSize = 5,
    isLoading,
    error,
    emptyMessage = "No se encontraron datos.",
}) {
    const [sorting, setSorting] = useState([]);
    const [grouping, setGrouping] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [pagination, setPagination] = useState({
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
        <div className="w-full">
            {title && <h2 className="text-lg font-semibold text-slate-800 mb-3">{title}</h2>}

            <div className="w-full bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
                <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-left text-sm">
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
        </div>
    );
}
