import { StarRating } from './StarRating';

interface ReviewCardProps {
  title: string;
  body: string;
  score: number;
  userName: string;
  createdAt: string;
}

export const ReviewCard = ({ title, body, score, userName, createdAt }: ReviewCardProps) => {
  const date = new Date(createdAt).toLocaleDateString();

  return (
    <div className="border rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-md">{title}</h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <StarRating value={score} size="sm" />
      <p className="text-gray-600 text-sm mt-2">{body}</p>
      <p className="text-xs text-gray-400 mt-2">— {userName}</p>
    </div>
  );
};
