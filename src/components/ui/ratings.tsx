import { type FC } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

interface Props {
  start?: number;
  end?: number;
  value?: number;
  size?: number;
}

const Ratings: FC<Props> = ({ start = 0, end = 5, value = 0, size }) => {
  const rating = Math.round(value);

  const content = new Array(end - start)
    .fill(0)
    .map((_, i) =>
      i + 1 <= rating ? (
        <AiFillStar
          className="text-[#b4690e]"
          size={size ?? 20}
          key={"ratings" + i}
        />
      ) : (
        <AiOutlineStar
          className="text-[#b4690e]"
          size={size ?? 20}
          key={"ratings" + i}
        />
      ),
    );

  return <div className="flex items-center">{content}</div>;
};

export { Ratings };
