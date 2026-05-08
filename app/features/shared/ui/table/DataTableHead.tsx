import { IconArrowsSort, IconSortAscending, IconSortDescending, IconFolders } from "@tabler/icons-react";
import { flexRender, type Header, type Table } from "@tanstack/react-table";
import clsx from "clsx";

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
        const sorted = header.column.getIsSorted();
        const iconClass = clsx("sort-indicator", {
            "sort-indicator-active": sorted
        });

        if (sorted === "asc") {
            return <IconSortAscending size={16} className={iconClass} />;
        }
        if (sorted === "desc") {
            return <IconSortDescending size={16} className={iconClass} />;
        }
        return <IconArrowsSort size={16} className={iconClass} />;
    }

    const renderHeaderActions = (header: Header<T, unknown>) => {
        const canSort = header.column.getCanSort();
        const canGroup = header.column.getCanGroup();
        const isGrouped = header.column.getIsGrouped();

        return (
            <div className="flex items-center gap-2">
                {canSort && (
                    <div
                        className="sort-indicator cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                    >
                        {renderSortIndicator(header)}
                    </div>
                )}
                {canGroup && (
                    <button
                        className={clsx("btn-group-toggle", {
                            "btn-group-toggle-active": isGrouped
                        })}
                        onClick={() => header.column.toggleGrouping()}
                        title={isGrouped ? "Desagrupar" : "Agrupar por esta columna"}
                    >
                        <IconFolders size={16} />
                    </button>
                )}
            </div>
        );
    }

    return (
        <thead>
            {props.table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} colSpan={header.colSpan}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex-1">{renderHeaderContent(header)}</span>
                                {renderHeaderActions(header)}
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
};

export default DataTableHead;