import { useState } from 'react';

interface StarRatingProps {
  value: number;
  totalRatings?: number;
  onChange?: (score: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const StarRating = ({ value, totalRatings, onChange, size = 'sm', interactive = false }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0);
  const [pending, setPending] = useState(false);

  const handleClick = async (score: number) => {
    if (!interactive || !onChange || pending) return;
    setPending(true);
    try {
      await onChange(score);
    } finally {
      setPending(false);
    }
  };

  const starSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const displayScore = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const fill = star <= displayScore ? 'text-yellow-400' : 'text-gray-300';
        const cursor = interactive ? 'cursor-pointer' : '';
        return (
          <svg
            key={star}
            className={`${starSize} ${fill} ${cursor} ${pending ? 'opacity-50' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => handleClick(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      {totalRatings !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({totalRatings})</span>
      )}
    </div>
  );
};
