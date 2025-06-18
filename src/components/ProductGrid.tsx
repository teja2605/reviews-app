
import { useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useReviews } from "@/hooks/useReviews";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const { products, loading } = useProducts();
  const { fetchReviewsForProduct, reviews, getAverageRating, getProductReviews } = useReviews();

  useEffect(() => {
    // Fetch reviews for all products
    products.forEach(product => {
      fetchReviewsForProduct(product.id);
    });
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded mb-4"></div>
            <div className="bg-gray-300 h-6 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available. Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const productReviews = getProductReviews(product.id);
        const averageRating = getAverageRating(product.id);
        
        return (
          <ProductCard 
            key={product.id} 
            product={product} 
            reviews={productReviews}
            averageRating={averageRating}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
