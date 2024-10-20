import { useState, type FC } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { Ratings } from "../ui/ratings";
import Image from "next/image";
import { AiFillEdit } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { ReviewForm } from "./review-form";
import { useUser } from "~/hooks/use-user";
import toast from "react-hot-toast";

type Review = NonNullable<
  RouterOutputs["room"]["getOne"]["room"]
>["reviews"][0];

interface Props {
  review: Review;
}

const ReviewCard: FC<Props> = ({ review }) => {
  const { user } = useUser();
  const [showEditForm, setShowEditForm] = useState(false);

  const apiUtils = api.useContext();

  const { mutate: updateReview, isLoading: updateReviewLoading } =
    api.room.addReview.useMutation({
      onSuccess() {
        void apiUtils.room.getOne.invalidate({ roomId: review.roomId! });
        setShowEditForm(false);
        toast.success("You have updated the review");
      },
    });

  return (
    <div
      className="min-h-10 w-[60%] rounded border-2 border-gray-200 px-3 py-2"
      key={review.id}
    >
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
        <div className="flex items-center space-x-2">
          <Image
            className="rounded-full"
            height={30}
            width={30}
            alt={review.user.name!}
            src={review.user.image!}
          />
          <h3 className="font-semibold">{review.user.name}</h3>
          <Ratings start={0} end={5} value={review.rating} />
        </div>

        {review.userId === user?.id && (
          <button
            onClick={() => setShowEditForm((prev) => !prev)}
            className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-900 hover:text-white"
          >
            {showEditForm ? <FaTimes size={20} /> : <AiFillEdit size={20} />}
          </button>
        )}
      </div>
      {!showEditForm && <div className="pt-1">{review.reviewComment}</div>}

      {showEditForm && (
        <div className="mt-4">
          <ReviewForm
            busy={updateReviewLoading}
            onSubmit={({ reviewText, rating }) =>
              updateReview({
                bookingId: review.bookingId!,
                roomId: review.roomId!,
                review: { comment: reviewText, rating },
              })
            }
            title="Update Review"
            name="updateReview"
            initialValue={{
              reviewText: review.reviewComment,
              rating: review.rating,
            }}
          />
        </div>
      )}
    </div>
  );
};

export { ReviewCard };
