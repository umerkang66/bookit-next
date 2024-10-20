import { PaginationActions } from "./pagination-actions";

interface Props<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
> {
  /**
   * This would be the header of the table i.e. first row.
   *
   * If header is provided, label will not be used.
   *
   * If header is not provided only then label will be used.
   */
  config: {
    /**
     * This would be displayed in head row if header is not provided.
     */
    label?: string;
    /**
     * This would be displayed in head row if it is provided
     */
    header?: () => JSX.Element;
    /**
     * What property will be rendered in the column of table
     */
    render: (item: T) => T[keyof T];
  }[];
  /**
   * Actual data that will be rendered in each row, 1 element of array will be 1 row in the table
   */
  rowData: T[];
  /**
   * For every row (element of array) this will act as key function in React Array.
   * The returned from this function will be serve as key in react array jsx renders
   */
  keyFn: (item: T) => T[keyof T] extends string ? T[keyof T] : string;
  currentPage: number;
  paginationBusy?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  disablePrevPage?: boolean;
  disableNextPage?: boolean;
  padding?: string;
}

export function Table<
  T extends Record<string, U>,
  U extends string | number | JSX.Element,
>({
  config,
  rowData,
  keyFn,
  currentPage = 1,
  paginationBusy = false,
  disablePrevPage = false,
  disableNextPage = false,
  onNextPage,
  onPrevPage,
  padding,
}: Props<T, U>) {
  const renderedHeaders = config.map((curCol) => {
    if (curCol.header) {
      const header = curCol.header();
      // if custom header is available, add that
      return (
        <th className={padding ?? "px-5 py-3"} key={curCol.label}>
          {header}
        </th>
      );
    }

    return (
      <th className={padding ?? "px-5 py-3"} key={curCol.label}>
        {curCol.label}
      </th>
    );
  });

  const renderedRows = rowData.map((rowItem) => {
    const currentRow = config.map((curCol) => {
      return (
        <td key={curCol.label} className={padding ?? "px-5 py-3"}>
          {curCol.render(rowItem)}
        </td>
      );
    });

    return (
      <tr className="border-b-2 border-gray-300" key={keyFn(rowItem)}>
        {currentRow}
      </tr>
    );
  });

  return (
    <>
      <table className="table-auto border-spacing-2">
        <thead className="border-x-2 border-gray-300 bg-gray-300 text-left text-gray-900">
          <tr>{renderedHeaders}</tr>
        </thead>
        <tbody className="border-x-2 border-gray-300 bg-gray-100 text-left text-gray-800">
          {renderedRows}
        </tbody>
      </table>

      <PaginationActions
        currentPage={currentPage}
        disablePrevPage={disablePrevPage}
        disableNextPage={disableNextPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        paginationBusy={paginationBusy}
      />
    </>
  );
}

export { type Props as TableProps };
