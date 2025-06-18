import { submitReview } from "../integrations/api";
import { useUser } from "@supabase/auth-helpers-react"; // If using Supabase

function ReviewForm({ productId }) {
  const user = useUser();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    const res = await submitReview({
      product_id: productId,
      user_id: user.id, // From Supabase
      rating,
      review,
    });

    console.log(res);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* inputs for rating, review */}
    </form>
  );
}
