import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import { type RouterOutputs } from "~/utils/api";
import { trimText } from "~/utils/common";
import { Ratings } from "../ui/ratings";
import { Button } from "../ui/button";

interface Props {
  room: RouterOutputs["room"]["getAll"]["rooms"][0];
}

const RoomItem: FC<Props> = ({ room }) => {
  return (
    <div className="w-64 overflow-hidden rounded-lg border-2 border-gray-200">
      <div className="h-36 w-full overflow-hidden">
        <Image
          width={250}
          height={200}
          src={room.images[0]!.url}
          alt={room.name}
          className="h-auto w-full"
        />
      </div>

      <div className="p-4">
        <Link
          className="text-lg font-semibold transition hover:underline"
          href={`/${room.id}`}
        >
          {trimText(room.name, 40)}
        </Link>

        <p className="my-2">
          <span className="font-semibold">${room.price}</span>/night
        </p>

        <div className="flex items-center space-x-2">
          <Ratings start={0} end={5} value={room.ratings} />
          <p>({room.reviews.length} Reviews)</p>
        </div>

        <Link className="inline-block w-full py-2" href={`/${room.id}`}>
          <Button className="w-full" primary>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { RoomItem };
