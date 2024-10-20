import { useRef, type FC, type ChangeEventHandler, useEffect } from "react";
import { capitalize, moveLabelUP } from "~/utils/common";

interface Props {
  name: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

const Textarea: FC<Props> = ({ name, value, onChange }) => {
  const labelRef = useRef<HTMLLabelElement>(null);

  const moveLabel = () => moveLabelUP(labelRef);

  useEffect(() => {
    if (value) moveLabel();
  }, [value]);

  return (
    <div className="relative">
      <label
        ref={labelRef}
        className="absolute left-3 top-[15%] -translate-y-[50%] cursor-text bg-white px-1 text-lg font-semibold transition"
        htmlFor={name}
      >
        {capitalize(name)}
      </label>
      <textarea
        className="min-h-[150px] w-full resize-none rounded border-2 border-gray-200 px-3 py-1 outline-none transition focus:border-4 focus:border-gray-300"
        name={name}
        value={value}
        onChange={onChange}
        id={name}
        onFocus={moveLabel}
      />
    </div>
  );
};

export { Textarea };
