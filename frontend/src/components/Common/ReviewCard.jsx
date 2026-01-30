import React from 'react';

export const ReviewCard = ({ author, rating, text, date, service }) => {
  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-lg">{author}</h4>
          <p className="text-sm text-gray-600">{service}</p>
        </div>
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <span className="text-lg">{renderStars(rating)}</span>
        <span className="text-gray-600 ml-2">{rating.toFixed(1)}/5</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed">
        "{text}"
      </p>

      {/* Verified Badge */}
      <div className="mt-4 text-xs text-green-600 font-semibold">
        ✓ Compra verificada
      </div>
    </div>
  );
};

export default ReviewCard;
