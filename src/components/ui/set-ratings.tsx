import { useState, type FC } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
  start?: number;
  end?: number;
}

const SetRatings: FC<Props> = ({
  value = 0,
  onChange,
  size = 24,
  start = 0,
  end = 5,
}) => {
  const [mouseOverStar, setMouseOverStar] = useState(-1);

  const handleOnClick = (rating: number) => {
    onChange && onChange(rating);
  };

  return (
    <div
      id="set-ratings-container"
      className="flex h-10 items-center justify-center space-x-1 bg-gray-200 px-3 py-1 transition"
      onMouseLeave={() => setMouseOverStar(-1)}
    >
      {new Array(end - start)
        .fill(0)
        .map((_, i) =>
          i + 1 <= (mouseOverStar !== -1 ? mouseOverStar : value) ? (
            <AiFillStar
              className="cursor-pointer text-[#b4690e] transition"
              size={size ?? 20}
              key={"ratings" + i}
              onMouseEnter={() => setMouseOverStar(i + 1)}
              onClick={() => handleOnClick(i + 1)}
            />
          ) : (
            <AiOutlineStar
              className="cursor-pointer text-[#b4690e] transition"
              size={size ?? 20}
              key={"ratings" + i}
              onMouseEnter={() => setMouseOverStar(i + 1)}
              onClick={() => handleOnClick(i + 1)}
            />
          ),
        )}
    </div>
  );
};

export { SetRatings };
