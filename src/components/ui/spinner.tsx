import { type FC } from "react";
import { ImSpinner8 } from "react-icons/im";

interface Props {
  size?: number;
  className?: string;
}

const Spinner: FC<Props> = ({ size, className }) => {
  return <ImSpinner8 size={size} className={`animate-spin ${className}`} />;
};

export { Spinner };
