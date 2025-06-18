const API_URL = "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function submitReview({ product_id, user_id, rating, review }) {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, user_id, rating, review }),
  });

  return res.json();
}
