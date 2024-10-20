import Image from "next/image";
import {
  useState,
  type ChangeEventHandler,
  type FC,
  useEffect,
  useRef,
} from "react";

interface Props {
  multiple?: boolean;
  name?: string;
  value?: string[];
  onChange?: (images: string[]) => void;
}

const ImageSelector: FC<Props> = ({
  name,
  multiple = false,
  onChange,
  value,
}) => {
  const [loadedImages, setLoadedImages] = useState([] as string[]);
  const onChangeCached = useRef(onChange).current;

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const rawImages = Array.from(e.target.files!);

    rawImages.map((image) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setLoadedImages((prev) => [...prev, reader.result as string]);
        }
      };

      reader.readAsDataURL(image);
    });

    // remove all the images from
    e.target.value = "";
  };

  useEffect(() => {
    if (loadedImages.length) {
      onChangeCached && onChangeCached(loadedImages);
    }
  }, [loadedImages, onChangeCached]);

  return (
    <div>
      <label className="relative cursor-pointer" htmlFor={name}>
        <div className="flex h-12 w-full items-center rounded border-2 border-gray-200 px-3 py-2">
          <p className="h-full font-semibold">Select Images</p>
        </div>
        <div className="absolute right-0 top-0 flex h-full w-24 items-center justify-center rounded-r bg-gray-700">
          <p className="font-semibold text-white">Browse</p>
        </div>
      </label>
      <input
        onChange={handleImageChange}
        multiple={multiple}
        accept="image/*"
        type="file"
        name={name}
        id={name}
        hidden
      />
      <div className="mt-4 flex items-start justify-end space-x-2">
        {!!value &&
          value.map((img, i) => (
            <div key={img + i} className="w-20">
              <Image
                className="h-auto w-full rounded"
                src={img}
                alt={`Room Image #${i + 1}`}
                height={50}
                width={70}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export { ImageSelector };
