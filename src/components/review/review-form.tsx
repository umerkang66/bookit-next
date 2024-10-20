import { useState, type FC } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SetRatings } from "../ui/set-ratings";

interface Props {
  onSubmit?: (result: { reviewText: string; rating: number }) => void;
  busy?: boolean;
  title?: string;
  name?: string;
  initialValue?: { reviewText: string; rating: number };
}

const ReviewForm: FC<Props> = ({
  onSubmit,
  busy = false,
  title = "Add Review",
  name = "addReview",
  initialValue,
}) => {
  const [rating, setRating] = useState(initialValue ? initialValue.rating : 0);

  const [reviewText, setReviewText] = useState(
    initialValue ? initialValue.reviewText : "",
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit({ reviewText, rating });
      }}
      className="relative flex w-full flex-col"
    >
      <div className="absolute right-0 z-50">
        <SetRatings value={rating} onChange={(rating) => setRating(rating)} />
      </div>
      <Textarea
        name={name ?? "addReview"}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <Button
        className="mt-2 min-h-[40px] min-w-[112px] self-end"
        busy={busy}
        primary
        type="submit"
      >
        {title ?? "Add Review"}
      </Button>
    </form>
  );
};

export { ReviewForm };
