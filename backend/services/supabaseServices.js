import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export const signUpUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
};
export const signInUser = async (email, password) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  return { user, error };
};
export const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  return { data, error };
};
export const fetchReviewsByProductId = async (productId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId);
  return { data, error };
};
export const addReview = async (productId, userId, rating, reviewText) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        product_id: productId,
        user_id: userId,
        rating,
        review_text: reviewText,
      },
    ]);
  return { data, error };
};
export const checkUserReview = async (productId, userId) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("user_id", userId);
  return { data, error };
};