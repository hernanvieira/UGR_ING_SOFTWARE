import { type Table } from "@tanstack/react-table";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight
} from "@tabler/icons-react";

interface DataTablePaginationProps<T> {
    table: Table<T>;
    pageSizeOptions: number[];
}

export default function DataTablePagination<T>({ table, pageSizeOptions }: DataTablePaginationProps<T>) {
    const pageCount = table.getPageCount();
    const isMultiPage = pageCount > 1;

    return (
        <div>
            <div>
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <IconChevronsLeft size={20} />
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <IconChevronLeft size={20} />
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <IconChevronRight size={20} />
                </button>
                <button
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <IconChevronsRight size={20} />
                </button>
            </div>

            <div>
                <span>
                    Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong>{pageCount}</strong>
                </span>

                {isMultiPage && (
                    <>
                        <span>
                            | Ir a la página:
                            <input
                                type="number"
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                            />
                        </span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value));
                            }}
                        >
                            {pageSizeOptions.map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Mostrar {pageSize}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
        </div>
    );
}
