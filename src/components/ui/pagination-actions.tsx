import { type FC } from "react";
import { Button } from "./button";
import classNames from "classnames";
import { Spinner } from "./spinner";

interface Props {
  currentPage: number;
  paginationBusy?: boolean;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  disablePrevPage?: boolean;
  disableNextPage?: boolean;
}

const paginationBtnClasses = "w-20 text-lg hover:opacity-90 transition";

const PaginationActions: FC<Props> = ({
  currentPage = 1,
  paginationBusy = false,
  disablePrevPage = false,
  disableNextPage = false,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <div className="my-8 flex items-center space-x-2">
      <Button
        onClick={onPrevPage}
        disabled={disablePrevPage}
        className={paginationBtnClasses}
        secondary
      >
        Prev
      </Button>
      <div
        className={classNames("rounded bg-gray-200", {
          "px-4 py-1.5": !paginationBusy,
          "px-3 py-2.5": paginationBusy,
        })}
      >
        {paginationBusy ? <Spinner /> : currentPage}
      </div>
      <Button
        onClick={onNextPage}
        disabled={disableNextPage}
        className={paginationBtnClasses}
        secondary
      >
        Next
      </Button>
    </div>
  );
};

export { PaginationActions };
