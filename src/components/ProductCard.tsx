
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import ReviewModal from "./ReviewModal";
import { Product } from "@/hooks/useProducts";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { Review } from "@/hooks/useReviews";

interface ProductCardProps {
  product: Product;
  reviews: Review[];
  averageRating: number;
}

const ProductCard = ({ product, reviews, averageRating }: ProductCardProps) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { deleteProduct } = useProducts();
  const { isAdmin } = useAuth();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(product.id);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <div className="flex items-center space-x-2">
              <StarRating rating={averageRating} readonly />
              <span className="text-sm text-gray-500">({reviews.length})</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            onClick={() => setIsReviewModalOpen(true)}
            className="flex-1"
            variant="outline"
          >
            Write Review
          </Button>
          {isAdmin && (
            <Button 
              onClick={handleDelete}
              variant="destructive"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
