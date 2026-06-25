import { ReviewCard } from './ReviewCard';

interface Review {
  id: number;
  title: string;
  body: string;
  score: number;
  createdAt: string;
  user: { id: number; name: string };
}

interface ReviewListProps {
  reviews: Review[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const ReviewList = ({ reviews, page, totalPages, onPageChange, loading }: ReviewListProps) => {
  if (loading) {
    return <div className="text-gray-500 py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500 py-4">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div>
      <div className="space-y-1">
        {reviews.map(review => (
          <ReviewCard
            key={review.id}
            title={review.title}
            body={review.body}
            score={review.score}
            userName={review.user.name}
            createdAt={review.createdAt}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded text-sm ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
