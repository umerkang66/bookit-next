import classNames from "classnames";
import {
  useRef,
  type FC,
  type ChangeEventHandler,
  type HTMLInputTypeAttribute,
  useEffect,
} from "react";
import { capitalize, moveLabelUP } from "~/utils/common";

interface Props {
  name: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Input: FC<Props> = ({ name, value, onChange, type }) => {
  const labelRef = useRef<HTMLLabelElement>(null);

  const moveLabel = () => moveLabelUP(labelRef);

  useEffect(() => {
    if (value) moveLabel();
  }, [value]);

  return (
    <div className="relative">
      <label
        ref={labelRef}
        className={classNames(
          "absolute left-3 top-[50%] cursor-text bg-white px-1 text-lg font-semibold transition",
          "-translate-y-[50%]",
        )}
        htmlFor={name}
      >
        {capitalize(name)}
      </label>
      <input
        className={classNames(
          "h-12 w-[100%] rounded border-2 border-gray-200 px-3 py-1 outline-none transition focus:border-4 focus:border-gray-300",
        )}
        type={type ?? "text"}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        onFocus={moveLabel}
      />
    </div>
  );
};

export { Input };
