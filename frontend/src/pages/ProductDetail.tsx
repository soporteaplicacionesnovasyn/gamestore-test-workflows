import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import { ReviewList } from '../components/ReviewList';
import { ReviewForm } from '../components/ReviewForm';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  averageRating?: number;
  totalRatings?: number;
}

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadReviews();
  }, [id, reviewPage]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.products.getById(parseInt(id!));
      if (response.error) {
        setError(response.error);
        setProduct(null);
      } else {
        setProduct(response);
      }
    } catch {
      setError('Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await api.reviews.getProductReviews(parseInt(id!), reviewPage);
      if (response.success) {
        setReviews(response.data.reviews);
        setReviewTotalPages(response.data.totalPages);
        if (product) {
          setProduct(prev => prev ? {
            ...prev,
            averageRating: response.data.averageRating,
            totalRatings: response.data.totalRatings,
          } : prev);
        }
      }
    } catch {
      console.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    if (!product) return;
    await addItem(product.id);
    alert('Added to cart!');
  };

  const handleSubmitReview = async (data: { title: string; body: string; score: number }) => {
    const response = await api.reviews.create(parseInt(id!), data);
    if (!response.success) {
      throw new Error(response.error);
    }
    loadReviews();
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      <Link to="/products" className="text-blue-600 hover:underline">Back to Products</Link>
    </div>
  );
  if (!product) return null;

  return (
    <div className="container mx-auto p-4">
      <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Products</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-2">{product.category}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</p>
          <div className="mb-4">
            <StarRating
              value={product.averageRating ?? 0}
              totalRatings={product.totalRatings}
              size="md"
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {user && (
          <ReviewForm onSubmit={handleSubmitReview} />
        )}

        {!user && (
          <p className="text-gray-500 mb-4">
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to write a review
          </p>
        )}

        <ReviewList
          reviews={reviews}
          page={reviewPage}
          totalPages={reviewTotalPages}
          onPageChange={setReviewPage}
          loading={reviewsLoading}
        />
      </div>
    </div>
  );
};
