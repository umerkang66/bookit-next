import classNames from "classnames";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCheck } from "react-icons/ai";
import { FaBed, FaTimes } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { DatePicker, type Dates } from "~/components/common/date-picker";
import { AddReview } from "~/components/review/add-review";
import { ReviewCard } from "~/components/review/review-card";

import { ImageSlider } from "~/components/room/image-slider";
import { Button } from "~/components/ui/button";
import { Ratings } from "~/components/ui/ratings";
import { Spinner } from "~/components/ui/spinner";
import { useUser } from "~/hooks/use-user";
import { api } from "~/utils/api";
import { apiSSR } from "~/utils/api-ssr";
import { getDaysArray } from "~/utils/common";
import { getStripe } from "~/utils/stripe-for-client";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const RoomPage: NextPage<Props> = ({ id }) => {
  const { user } = useUser();
  const [warningTexts, setWarningTexts] = useState<
    { content: string; type: "success" | "error" }[]
  >([]);
  const [dates, setDates] = useState<Dates>({
    checkInDate: null,
    checkOutDate: null,
  });
  const [datesForBooking, setDatesForBooking] = useState<Dates>({
    checkInDate: null,
    checkOutDate: null,
  });
  const [isAvailableForBooking, setIsAvailableForBooking] = useState(false);

  const { data } = api.room.getOne.useQuery({ roomId: id });
  const room = data?.room;
  const roomBooleanFeatures = [
    { name: "airConditioned", content: room?.airConditioned },
    { name: "breakfast", content: room?.breakfast },
    { name: "internet", content: room?.internet },
    { name: "petsAllowed", content: room?.petsAllowed },
  ];

  const { isInitialLoading: availableLoading } =
    api.room.isRoomAvailableForBooking.useQuery(
      {
        roomId: id,
        checkInDate: dates.checkInDate!,
        checkOutDate: dates.checkOutDate!,
      },
      {
        // trick to immediately delete the cache data, so we always get the new one
        cacheTime: 0,
        enabled: !!dates.checkInDate && !!dates.checkOutDate,
        onSettled() {
          setDates({ checkInDate: null, checkOutDate: null });
        },
        onError() {
          setIsAvailableForBooking(false);
        },
        onSuccess(data) {
          const available = data.isRoomAvailableForBooking;

          if (available !== undefined) {
            if (!available) {
              setIsAvailableForBooking(false);

              setWarningTexts((prev) => [
                ...prev,
                {
                  content: "Room is not available for booking in these dates",
                  type: "error",
                },
              ]);
            } else {
              setIsAvailableForBooking(true);

              setWarningTexts((prev) => [
                ...prev,
                {
                  content: "Room available for booking",
                  type: "success",
                },
              ]);
            }
          }

          // technically disabling the query
          setDates({ checkInDate: null, checkOutDate: null });
        },
      },
    );

  const alreadyBookedDatesQuery = api.room.alreadyBookedDates.useQuery(
    { roomId: id },
    {
      select(data) {
        return {
          bookedDates: data.bookedDates.map((dateRange) =>
            getDaysArray(dateRange),
          ),
        };
      },
    },
  );

  const { mutateAsync: createCheckoutSession, isLoading: sessionLoading } =
    api.payment.createCheckoutSession.useMutation();

  const onBookingClick = async () => {
    const { session } = await createCheckoutSession({
      roomId: id,
      checkInDate: datesForBooking.checkInDate!,
      checkOutDate: datesForBooking.checkOutDate!,
    });

    toast.success("🚀🚀🚀 You will be redirected to stripe page");

    const stripe = await getStripe();
    void stripe?.redirectToCheckout({ sessionId: session.id });
  };

  const currentBooking = room?.bookings.find(
    (booking) =>
      booking.userId === user?.id &&
      booking.roomId === room?.id &&
      !booking.reviewAdded,
  );

  if (!room) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">
        <span className="font-bold">Hotel Name: </span>
        {room.name}
      </h1>

      <p className="text-2xl">
        <span className="font-bold">Address: </span>
        {room.address}
      </p>

      <div className="flex items-center space-x-2">
        <Ratings start={0} end={5} value={room.ratings} size={30} />
        <span className="text-xl font-semibold">
          ({room.reviews.length} reviews)
        </span>
      </div>

      <ImageSlider roomImages={room.images} />

      <div className="flex items-start justify-between space-x-10 pt-16">
        <div className="w-[55%] space-y-4">
          <div>
            <h3 className="mb-2 text-2xl font-bold">Description</h3>
            <p className="text-xl">{room.description}</p>
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-bold">Features</h3>

            <div className="space-y-2 text-gray-900">
              <div className="flex items-center space-x-2">
                <FaPeopleGroup size={30} />{" "}
                <span>{room.guestCapacity} Guests</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaBed size={30} /> <span>{room.numOfBeds} Beds</span>
              </div>

              {roomBooleanFeatures.map((feature, i) => (
                <div
                  key={"features" + i}
                  className="flex items-center space-x-2"
                >
                  {feature.content ? (
                    <AiOutlineCheck className="text-green-600" size={30} />
                  ) : (
                    <FaTimes className="text-red-600" size={30} />
                  )}
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="min-h-[500px] w-[30%] rounded-2xl border-2 border-gray-400 p-8 shadow-2xl shadow-gray-300">
          <h3 className="border-b-2 border-gray-200 pb-3 text-2xl">
            <span className="font-bold">${room.price}</span> / night
          </h3>

          <p className="my-10 text-lg">Pick Check In and Check Out Date</p>

          <DatePicker
            onChange={(dates) => {
              setIsAvailableForBooking(false);
              setWarningTexts([]);
              setDates(dates);
              setDatesForBooking(dates);
            }}
            excludedDates={alreadyBookedDatesQuery.data?.bookedDates.flat()}
          />

          <div className="mt-3 space-y-2">
            {availableLoading && (
              <div className="flex w-full items-center justify-center">
                <Spinner />
              </div>
            )}

            {warningTexts.map(({ content, type }, i) => (
              <div
                className={classNames("w-full rounded px-4 py-2 text-white", {
                  "bg-green-600": type === "success",
                  "bg-red-600": type === "error",
                })}
                key={content + i}
              >
                {content}
              </div>
            ))}

            {isAvailableForBooking === true && (
              <div className="w-full pt-2">
                <Button
                  busy={sessionLoading}
                  onClick={() => void onBookingClick()}
                  className="h-10 w-full"
                  primary
                >
                  Book Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-4">
        <h3 className="mb-2 text-2xl font-bold">Reviews</h3>

        {!room.reviews.length && (
          <div className="inline-block rounded bg-gray-900 px-2 py-1 text-lg text-white">
            😕 There are no reviews to this Hotel Room
          </div>
        )}

        {!!currentBooking && (
          // if user has created the bookings user will be able to create review
          <AddReview bookingId={currentBooking.id} roomId={room.id} />
        )}

        {room.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params?.id as string;
  const api = await apiSSR(ctx);

  await api.room.getOne.prefetch({ roomId: id });

  return { props: { trpcState: api.dehydrate(), id } };
};

export default RoomPage;
