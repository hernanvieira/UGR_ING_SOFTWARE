import { IconArrowsSort, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { flexRender, type Header, type Table } from "@tanstack/react-table";

interface DataTableHeadProps<T> {
    table: Table<T>;
}


const DataTableHead = <T extends object>(props: DataTableHeadProps<T>) => {

    const renderHeaderContent = (header: Header<T, unknown>) => {
        return header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext());
    }

    const renderSortIndicator = (header: Header<T, unknown>) => {
        if (header.column.getIsSorted() === "asc") {
            return <IconSortAscending />;
        }
        if (header.column.getIsSorted() === "desc") {
            return <IconSortDescending />;
        }
        return <IconArrowsSort />;
    }

    const renderSortButton = (content: React.ReactNode, header: Header<T, unknown>) => {
        if (header.column.getCanSort()) {
            return (
                <div
                    onClick={header.column.getToggleSortingHandler()}
                >
                    <span>{content}</span>
                    <span>{renderSortIndicator(header)}</span>
                </div>
            );
        }
        return content;
    }

    return (
        <thead>
            {props.table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} colSpan={header.colSpan}>
                            {renderSortButton(renderHeaderContent(header), header)}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
};

export default DataTableHead;