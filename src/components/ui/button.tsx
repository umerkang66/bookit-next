import { type PropsWithChildren, type FC } from "react";
import classNames from "classnames";
import { Spinner } from "./spinner";

interface Props {
  primary?: boolean;
  secondary?: boolean;
  // normally its going to be dark
  primaryLight?: boolean;
  secondaryLight?: boolean;
  className?: string;
  onClick?: () => void;
  busy?: boolean;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
}

const Button: FC<PropsWithChildren<Props>> = (props) => {
  const { children, className, onClick, busy, type, disabled = false } = props;
  const cc = classNames(
    className,
    "cursor-pointer rounded transition hover:scale disabled:opacity-70 disabled:cursor-default",
  );

  const variants = {
    primary: classNames(cc, "px-3 py-1 bg-gray-900 text-white"),
    secondary: classNames(cc, "p-1 bg-gray-700 text-white"),
    primaryLight: classNames(cc, "px-3 py-1 bg-white text-gray-900"),
    secondaryLight: classNames(cc, "p-1 bg-white text-gray-900"),
  };

  const selectedKey = Object.keys(props).find(
    (key: string) =>
      Object.keys(variants).includes(key) &&
      props[key as keyof typeof variants] === true,
  ) as keyof typeof variants | undefined;

  return (
    <button
      onClick={onClick}
      disabled={busy ?? disabled}
      type={type ?? "button"}
      className={selectedKey ? variants[selectedKey] : cc}
    >
      {busy ? (
        <div className="flex w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export { Button };
