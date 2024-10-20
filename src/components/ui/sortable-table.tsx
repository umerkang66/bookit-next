import { GoArrowUp, GoArrowDown } from "react-icons/go";
import { Table, type TableProps } from "./table";
import { useSorting } from "~/hooks/use-sorting";

export interface SortableTableProps<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
> extends TableProps<T, U> {
  // updating the type of config, adding sortValueByProperty
  config: (TableProps<T, U>["config"][0] & {
    /**
     * Which values the sort functions should consider during sorting.
     *
     * The result of this function should either be STRING | NUMBER.
     *
     * If the item passed into this function is Primitive, we can just return that,
     * other wise we can return some value of object (that should be a primitive)
     */
    sortValueBy?: (item: T) => T[keyof T] | T;
  })[];
}

// this component will use the default table component, and will provide the updated header in config, and update (sorted) data
export function SortableTable<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
>(props: SortableTableProps<T, U>) {
  const { config, rowData } = props;

  const {
    sortOrder,
    // key of the data, that we can use to sort the data, returned value from sortValueBy
    sortBy,
    sortedData,
    // by which column we want to sort
    setSortColumn,
  } = useSorting<T, U>({
    config,
    rowData,
  });

  const updatedConfig = config.map((curColumn) => {
    // there should be properties that we don't want to sort
    if (!curColumn.sortValueBy) {
      return curColumn;
    }

    return {
      ...curColumn,
      header: () => (
        <div
          className="-translate-x-2 cursor-pointer rounded px-2 py-1 transition hover:bg-gray-200"
          onClick={() => setSortColumn(curColumn.label!)}
        >
          <div className="flex items-center space-x-2">
            <span className="inline-block">{curColumn.label}</span>
            {getIcons(curColumn.label!, sortBy!, sortOrder)}
          </div>
        </div>
      ),
    };
  });

  return <Table {...props} config={updatedConfig} rowData={sortedData} />;
}

function getIcons(
  label: string,
  sortBy: string,
  sortOrder: "asc" | "desc" | null,
) {
  if (label !== sortBy) {
    return (
      <div>
        <GoArrowUp size={10} />
        <GoArrowDown size={10} />
      </div>
    );
  }

  if (sortOrder === null) {
    return (
      <div>
        <GoArrowUp size={10} />
        <GoArrowDown size={10} />
      </div>
    );
  } else if (sortOrder === "asc") {
    return (
      <div>
        <GoArrowUp size={10} />
      </div>
    );
  } else if (sortOrder === "desc") {
    return (
      <div>
        <GoArrowDown size={10} />
      </div>
    );
  }
}
