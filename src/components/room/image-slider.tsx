import Image from "next/image";
import { type FC, useRef } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface Props {
  roomImages: { url: string; public_id: string }[];
}

let currSlide = 1;

const ImageSlider: FC<Props> = ({ roomImages }) => {
  const imagesRef = useRef<HTMLDivElement[]>([]);

  const moveToSlide = (slide: number) => {
    const translateClassNames = roomImages.map(
      (_, i) => `-translate-x-[${i * 100}%]`,
    );

    // remove the classes
    translateClassNames.forEach((cls) => {
      imagesRef.current.map((img) => {
        if (img?.classList.contains(cls)) {
          img?.classList.remove(cls);
        }
      });
    });

    // then add the classes
    imagesRef.current.forEach((img) => {
      img?.classList.add(translateClassNames[slide - 1]!);
    });
  };

  const nextSlide = () => {
    if (currSlide >= roomImages.length) {
      moveToSlide(1);
      currSlide = 1;
      return;
    }
    moveToSlide(currSlide + 1);
    currSlide += 1;
  };

  const prevSlide = () => {
    if (currSlide <= 1) {
      moveToSlide(roomImages.length);
      currSlide = roomImages.length;
      return;
    }
    moveToSlide(currSlide - 1);
    currSlide -= 1;
  };

  return (
    <div className="relative w-full">
      {!!roomImages.length && (
        <div className="absolute left-[50%] top-0 z-50 -translate-x-[50%] space-x-[2px]">
          <button
            onClick={prevSlide}
            className="rounded border-[1px] border-gray-700 bg-gray-900 bg-opacity-50 p-2 transition hover:opacity-80 active:opacity-100"
          >
            <AiFillCaretLeft className="text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="rounded border-[1px] border-gray-700 bg-gray-900 bg-opacity-50 p-2 transition hover:opacity-80 active:opacity-100"
          >
            <AiFillCaretRight className="text-white" />
          </button>
        </div>
      )}

      <div className="overflow-hidden">
        <div className="flex w-[300%] items-center">
          {roomImages.map((img, i) => (
            <div
              // used a little hack in the classnames
              key={img.public_id}
              // eslint-disable-next-line
              className="h-[500px] w-full -translate-x-[0%] -translate-x-[100%] -translate-x-[200%] overflow-hidden rounded-lg transition"
              ref={(el) => (imagesRef.current[i] = el!)}
            >
              <Image
                src={img.url}
                alt={"room" + " image " + (i + 1)}
                width={1100}
                height={900}
                className="h-auto w-full rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ImageSlider };
