
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviewsForProduct = async (productId: string) => {
    setLoading(true);
    console.log('Fetching reviews for product:', productId);
    
    // First get the reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      setLoading(false);
      return;
    }

    // Then get user profiles for each review
    if (reviewsData && reviewsData.length > 0) {
      const userIds = reviewsData.map(review => review.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine reviews with profile data
      const reviewsWithProfiles = reviewsData.map(review => ({
        ...review,
        user_email: profilesData?.find(p => p.id === review.user_id)?.email || '',
        user_name: profilesData?.find(p => p.id === review.user_id)?.name || ''
      }));

      console.log('Reviews with profiles:', reviewsWithProfiles);
      setReviews(prevReviews => {
        // Update reviews for this specific product
        const otherProductReviews = prevReviews.filter(r => r.product_id !== productId);
        return [...otherProductReviews, ...reviewsWithProfiles];
      });
    } else {
      // No reviews for this product, remove any existing ones from state
      setReviews(prevReviews => prevReviews.filter(r => r.product_id !== productId));
    }
    
    setLoading(false);
  };

  const addReview = async (productId: string, rating: number, comment: string) => {
    console.log('Adding review:', { productId, rating, comment });
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      toast({
        title: "Error",
        description: "You must be logged in to submit a review",
        variant: "destructive"
      });
      return { data: null, error: userError };
    }

    // Check if user has already reviewed this product
    const existingReview = reviews.find(r => r.product_id === productId && r.user_id === userData.user.id);
    if (existingReview) {
      toast({
        title: "Already Reviewed",
        description: "You have already reviewed this product",
        variant: "destructive"
      });
      return { data: null, error: { message: "Already reviewed" } };
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: productId,
        user_id: userData.user.id,
        rating,
        comment: comment.trim()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }

    console.log('Review added successfully:', data);
    toast({
      title: "Success",
      description: "Review added successfully"
    });
    
    // Refresh reviews for this product to get the updated list
    await fetchReviewsForProduct(productId);
    
    return { data, error: null };
  };

  const getAverageRating = (productId: string) => {
    const productReviews = reviews.filter(review => review.product_id === productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
  };

  const hasUserReviewed = (productId: string, userId: string | undefined) => {
    if (!userId) return false;
    return reviews.some(review => review.product_id === productId && review.user_id === userId);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(review => review.product_id === productId);
  };

  return {
    reviews,
    loading,
    fetchReviewsForProduct,
    addReview,
    getAverageRating,
    hasUserReviewed,
    getProductReviews
  };
};
