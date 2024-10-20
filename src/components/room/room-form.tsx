import classNames from "classnames";
import { type NextPage } from "next";
import {
  type FC,
  useState,
  useRef,
  useEffect,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";
import { toast } from "react-hot-toast";
import { AiFillCaretDown } from "react-icons/ai";
import { Button } from "~/components/ui/button";
import { CheckBox } from "~/components/ui/checkbox";
import { ImageSelector } from "~/components/ui/image-selector";
import { Input } from "~/components/ui/input";
import { Selector } from "~/components/ui/selector";
import { Textarea } from "~/components/ui/textarea";
import { type RouterInputs } from "~/utils/api";
import { capitalize, moveLabelUP } from "~/utils/common";

// during creating all the props will be provided but during updating only some props will be provided
type Room = Partial<
  RouterInputs["room"]["create"] | RouterInputs["room"]["update"]["data"]
>;

interface Props {
  initialData?: Room;
  busy?: boolean;
  btnText?: string;
  onSubmit?: (room: Room) => void;
}

export const RoomForm: NextPage<Props> = ({
  initialData,
  onSubmit,
  busy,
  btnText,
}) => {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showGuestCapacitySelector, setShowGuestCapacitySelector] =
    useState(false);

  const [showNumOfBedsSelector, setShowNumOfBedsSelector] = useState(false);

  const [room, setRoom] = useState<Partial<Room>>(
    initialData
      ? initialData
      : {
          internet: false,
          breakfast: false,
          airConditioned: false,
          petsAllowed: false,
          roomCleaning: false,
          images: [],
        },
  );

  const onChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    if (e.target.name === "price") {
      return setRoom((prev) => ({ ...prev, price: parseInt(e.target.value) }));
    }

    setRoom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSelectHandler = <T,>(result: { name: string; value: T }) => {
    if (result.name === "numOfBeds" || result.name === "guestCapacity") {
      return setRoom((prev) => ({
        ...prev,
        [result.name]: parseInt(result.value as string),
      }));
    }

    setRoom((prev) => ({ ...prev, [result.name]: result.value }));
  };

  const onCheckedHandler = (result: { name: string; value: boolean }) => {
    setRoom((prev) => ({ ...prev, [result.name]: result.value }));
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(room as Room);
  };

  return (
    <div className="mx-auto w-[90%] rounded-lg border-2 border-gray-200 p-5 md:w-[70%]">
      <h1 className="mb-10 text-4xl font-bold text-gray-900">
        {btnText ?? "Create"} {btnText === "Update" ? "" : "new"} Room
      </h1>

      <form onSubmit={submitHandler} className="space-y-8">
        <Input value={room.name} name="name" onChange={onChangeHandler} />
        <Input
          value={room.price?.toString()}
          name="price"
          type="number"
          onChange={onChangeHandler}
        />
        <Textarea
          value={room.description}
          name="description"
          onChange={onChangeHandler}
        />
        <Input value={room.address} name="address" onChange={onChangeHandler} />

        <Selector
          className="h-12"
          head={
            <SelectorHead
              onClick={() => setShowCategorySelector((prev) => !prev)}
              value={room.category ?? ""}
              name="category"
            />
          }
          name="category"
          options={
            [{ title: "KING" }, { title: "SINGLE" }, { title: "TWINS" }] as {
              title: NonNullable<Room["category"]>;
            }[]
          }
          showOptions={showCategorySelector}
          onSelect={(result) => onSelectHandler(result)}
          onClose={() => setShowCategorySelector(false)}
        />

        <Selector
          className="h-12"
          head={
            <SelectorHead
              onClick={() => setShowGuestCapacitySelector((prev) => !prev)}
              value={room.guestCapacity?.toString() ?? ""}
              name="guestCapacity"
            />
          }
          name="guestCapacity"
          options={new Array(6)
            .fill(0)
            .map((_, i) => ({ title: (i + 1).toString() }))}
          showOptions={showGuestCapacitySelector}
          onSelect={(result) => onSelectHandler(result)}
          onClose={() => setShowGuestCapacitySelector(false)}
        />

        <Selector
          className="h-12"
          head={
            <SelectorHead
              onClick={() => setShowNumOfBedsSelector((prev) => !prev)}
              value={room.numOfBeds?.toString() ?? ""}
              name="numOfBeds"
            />
          }
          options={new Array(3)
            .fill(0)
            .map((_, i) => ({ title: (i + 1).toString() }))}
          name="numOfBeds"
          showOptions={showNumOfBedsSelector}
          onSelect={(result) => onSelectHandler(result)}
          onClose={() => setShowNumOfBedsSelector(false)}
        />

        <div>
          <h3 className="pb-5 text-xl font-bold">Room Features</h3>

          <div className="space-y-1">
            <CheckBox
              value={room.internet}
              onSelect={onCheckedHandler}
              name="internet"
            />
            <CheckBox
              value={room.breakfast}
              onSelect={onCheckedHandler}
              name="breakfast"
            />
            <CheckBox
              value={room.airConditioned}
              onSelect={onCheckedHandler}
              name="airConditioned"
            />
            <CheckBox
              value={room.petsAllowed}
              onSelect={onCheckedHandler}
              name="petsAllowed"
            />
            <CheckBox
              value={room.roomCleaning}
              onSelect={onCheckedHandler}
              name="roomCleaning"
            />
          </div>
        </div>

        <ImageSelector
          name="image-selector"
          multiple
          value={room.images}
          onChange={(images) => {
            if (images.length > 3) {
              toast.error("Only 3 images are allowed");
            }

            if (images.length === 3) {
              setRoom((prev) => ({ ...prev, images }));
            } else {
              // it would be less than three images
              setRoom((prev) => ({
                ...prev,
                images: [...(prev.images ?? []), ...images].filter(
                  (_, i) => i <= 2,
                ),
              }));
            }
          }}
        />

        <div className="flex items-center justify-end">
          <Button busy={busy} className="h-10 w-32" primary type="submit">
            <p className="font-extrabold tracking-wider">
              {btnText ?? "Submit"}
            </p>
          </Button>
        </div>
      </form>
    </div>
  );
};

const SelectorHead: FC<{
  name: string;
  value: string;
  onClick?: () => void;
}> = ({ value, onClick, name }) => {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) moveLabelUP(labelRef);
  }, [value]);

  return (
    <div
      className="relative h-12 w-full cursor-pointer rounded border-2 border-gray-200 p-4"
      onClick={onClick}
    >
      <div
        ref={labelRef}
        className="absolute left-3 top-[50%] -translate-y-[50%] bg-white px-1 text-lg font-semibold transition"
      >
        {capitalize(name)}
      </div>

      <div
        className={classNames("flex w-full items-center justify-between", {
          "-translate-y-1": !!value,
        })}
      >
        <div>{value}</div>
        <AiFillCaretDown />
      </div>
    </div>
  );
};
