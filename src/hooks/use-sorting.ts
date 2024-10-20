import { useState } from "react";

interface Props<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
> {
  // this would be the header of the table i.e. first row
  config: {
    label?: string;
    /**
     * Which values the sort functions should consider during sorting.
     *
     * The result of this function should either be STRING | NUMBER.
     *
     * If the item passed into this function is Primitive, we can just return that,
     * other wise we can return some value of object (that should be a primitive)
     */
    sortValueBy?: (item: T) => T[keyof T] | T;
  }[];
  /**
   * Actual data that will be rendered in each row, 1 element of array will be 1 row in the table
   */
  rowData: T[];
}

export function useSorting<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
>(props: Props<T, U>) {
  const { config, rowData } = props;

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [sortBy, setSortBy] = useState<
    (keyof T extends string ? keyof T : string) | null
  >(null);

  const setSortColumn = (label: string) => {
    if (sortBy && label !== sortBy) {
      // we were previously sorting by some other label, but now started with some other label
      setSortOrder("asc");
      setSortBy(label);
      return;
    }

    if (sortOrder === null) {
      setSortOrder("asc");
      setSortBy(label);
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
      setSortBy(label);
    } else if (sortOrder === "desc") {
      setSortOrder(null);
      setSortBy(null);
    }
  };

  let sortedData = rowData;
  if (sortOrder && sortBy) {
    const sortValueBy = config.find((curCol) => curCol.label === sortBy)
      ?.sortValueBy;

    if (sortValueBy) {
      sortedData = [...rowData].sort((a, b) => {
        // by which value we have to sort (we are not getting value from label, because label might be some other value, and data might have some other values)
        const valueA = sortValueBy(a);
        const valueB = sortValueBy(b);

        const isReverseOrder = sortOrder === "asc" ? 1 : -1;

        if (typeof valueA === "string" && typeof valueB === "string") {
          return valueA.localeCompare(valueB) * isReverseOrder;
        } else if (typeof valueA === "number" && typeof valueB === "number") {
          // it is a number
          return (valueA - valueB) * isReverseOrder;
        } else {
          // if the property is neither number nor string, just return the exact order
          return 1 * isReverseOrder;
        }
      });
    }
  }

  return { sortOrder, sortBy, sortedData, setSortColumn };
}
