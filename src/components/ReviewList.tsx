import React from 'react';
import { Twitter, Instagram, Globe, Mail, Star, StarHalf } from 'lucide-react';
import type { Review, ReviewSource } from '../types';

const sourceIcons: Record<ReviewSource, React.ReactNode> = {
  X: <Twitter className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />
};

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800'
};

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span>{sourceIcons[review.source]}</span>
              <span className="font-medium">{review.customerName}</span>
            </div>
            <div className="flex items-center space-x-1">
              {Array.from({ length: review.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              {review.stars % 1 !== 0 && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
            </div>
          </div>
          <p className="text-gray-600 mb-2">{review.text}</p>
          <div className="flex items-center justify-between">
            <div className="group relative">
              <span className={`px-2 py-1 rounded-full text-sm ${sentimentColors[review.sentiment]}`}>
                {review.sentiment}
              </span>
              {review.sentimentScore !== undefined && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Score: {review.sentimentScore.toFixed(3)}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{review.productName}</span>
              <span>•</span>
              <span>{new Date(review.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}