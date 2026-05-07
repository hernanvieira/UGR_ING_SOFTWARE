import { type Table } from "@tanstack/react-table";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight
} from "@tabler/icons-react";

interface DataTablePaginationProps<T> {
    table: Table<T>;
}

export default function DataTablePagination<T>({ table }: DataTablePaginationProps<T>) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    style={{ cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed' }}
                >
                    <IconChevronsLeft size={20} />
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    style={{ cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed' }}
                >
                    <IconChevronLeft size={20} />
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    style={{ cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed' }}
                >
                    <IconChevronRight size={20} />
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    style={{ cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed' }}
                >
                    <IconChevronsRight size={20} />
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>
                    Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{' '}
                    <strong>{table.getPageCount()}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    | Ir a la página:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '50px', padding: '2px 4px' }}
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Mostrar {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
