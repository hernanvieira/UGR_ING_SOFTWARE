import { type Table, flexRender } from "@tanstack/react-table";

interface DataTableBodyProps<T> {
    table: Table<T>;
}

export default function DataTableBody<T>(props: DataTableBodyProps<T>) {
    return (
        <tbody>
            {props.table.getRowModel().rows.map((row, index) => (
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}