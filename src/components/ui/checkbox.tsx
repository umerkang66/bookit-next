import classNames from "classnames";
import { type FC } from "react";
import { capitalize } from "~/utils/common";

interface Props {
  name: string;
  value?: boolean;
  onSelect?: (result: { name: string; value: boolean }) => void;
}

const CheckBox: FC<Props> = ({ name, value, onSelect }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        className="h-4 w-4 rounded"
        type={"checkbox"}
        name={name}
        id={name}
        checked={value}
        onChange={(e) =>
          onSelect && onSelect({ name, value: e.target.checked })
        }
      />
      <label
        className={classNames("cursor-pointer text-lg font-semibold")}
        htmlFor={name}
      >
        {capitalize(name).slice(0, -1)}
      </label>
    </div>
  );
};

export { CheckBox };
