
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import { Product } from "@/hooks/useProducts";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "@/hooks/use-toast";

interface ReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ product, isOpen, onClose }: ReviewModalProps) => {
  const { user } = useAuth();
  const { addReview, fetchReviewsForProduct, hasUserReviewed, getProductReviews } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get fresh data each time modal opens
  useEffect(() => {
    if (isOpen && product?.id) {
      console.log('Modal opened, fetching reviews for product:', product.id);
      fetchReviewsForProduct(product.id);
    }
  }, [isOpen, product?.id]);

  const hasReviewed = user ? hasUserReviewed(product.id, user.id) : false;
  const productReviews = getProductReviews(product.id);

  console.log('Modal state:', {
    hasReviewed,
    productReviews: productReviews.length,
    userId: user?.id,
    productId: product.id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting review:', { rating, comment, productId: product.id });
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (hasReviewed) {
      toast({
        title: "Already Reviewed",
        description: "You have already reviewed this product",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Validation Error",
        description: "Please write a review comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await addReview(product.id, rating, comment.trim());
      
      if (!error) {
        setRating(0);
        setComment("");
        onClose();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review: {product.name}</DialogTitle>
        </DialogHeader>
        
        {!user ? (
          <div className="text-center py-6">
            <p className="text-gray-600">Please log in to write a review.</p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : hasReviewed ? (
          <div className="text-center py-6">
            <p className="text-gray-600">You have already reviewed this product.</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Your Review:</h4>
              {productReviews
                .filter(review => review.user_id === user.id)
                .map(review => (
                  <div key={review.id}>
                    <StarRating rating={review.rating} readonly size="sm" />
                    <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
            </div>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={isSubmitting || rating === 0}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
