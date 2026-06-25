import { useState } from 'react';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  onSubmit: (data: { title: string; body: string; score: number }) => Promise<void>;
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!body.trim()) {
      setError('Review body is required');
      return;
    }
    if (!score) {
      setError('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), body: body.trim(), score });
      setSuccess('Review submitted for moderation!');
      setTitle('');
      setBody('');
      setScore(0);
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-3">Write a Review</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
          {success}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <StarRating
          value={score}
          interactive
          size="md"
          onChange={(s) => setScore(s)}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          className="w-full border rounded p-2 text-sm"
          placeholder="Summary of your review"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Review</label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full border rounded p-2 text-sm"
          placeholder="Share your experience with this product"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
