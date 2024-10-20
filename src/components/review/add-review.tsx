import { type FC } from "react";
import { api } from "~/utils/api";
import { ReviewForm } from "./review-form";
import toast from "react-hot-toast";

interface Props {
  roomId: string;
  bookingId: string;
}

const AddReview: FC<Props> = ({ roomId, bookingId }) => {
  const apiUtils = api.useContext();

  const { mutateAsync: setIsReviewAdded, isLoading: setIsReviewAddedLoading } =
    api.booking.setIsReviewAdded.useMutation();

  const { mutate: addReview, isLoading: addReviewLoading } =
    api.room.addReview.useMutation({
      async onSuccess() {
        await setIsReviewAdded({ bookingId });
        void apiUtils.room.getOne.invalidate({ roomId });
        toast.success("You have created the review");
      },
    });

  return (
    <div className="my-5 w-[60%]">
      <ReviewForm
        busy={setIsReviewAddedLoading || addReviewLoading}
        onSubmit={({ reviewText, rating }) => {
          addReview({
            bookingId,
            roomId,
            review: {
              comment: reviewText,
              rating,
            },
          });
        }}
      />
    </div>
  );
};

export { AddReview };
