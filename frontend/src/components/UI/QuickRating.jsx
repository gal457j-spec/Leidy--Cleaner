import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const QuickRating = ({ serviceId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (rating > 0) {
      onRatingSubmit?.({
        serviceId,
        rating,
        feedback,
        timestamp: new Date()
      });
      setSubmitted(true);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setRating(0);
        setFeedback('');
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center"
      >
        <div className="text-2xl mb-2">✅</div>
        <p className="text-green-800 dark:text-green-200 font-semibold">
          Obrigado pela avaliação!
        </p>
        <p className="text-green-600 dark:text-green-300 text-sm">
          Sua opinião nos ajuda a melhorar
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Como foi o serviço?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Sua avaliação nos ajuda a melhorar
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <StarIcon
              className={`w-8 h-8 ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-slate-600'
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      {/* Rating Labels */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {rating === 1 && '😞 Muito ruim'}
            {rating === 2 && '😐 Ruim'}
            {rating === 3 && '😐 Regular'}
            {rating === 4 && '😊 Bom'}
            {rating === 5 && '😍 Excelente'}
          </p>
        </motion.div>
      )}

      {/* Feedback Textarea */}
      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Conte-nos mais sobre sua experiência (opcional)..."
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white resize-none"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {feedback.length}/200 caracteres
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      {rating > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleRatingSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
        >
          Enviar Avaliação
        </motion.button>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
        >
          Agora não
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="flex-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
        >
          Lembrar depois
        </button>
      </div>
    </div>
  );
};

// Hook para gerenciar avaliações
export const useQuickRating = () => {
  const [ratings, setRatings] = useState([]);

  const submitRating = (ratingData) => {
    setRatings(prev => [...prev, ratingData]);

    // Salvar no localStorage (em produção seria API)
    const saved = localStorage.getItem('leidy-ratings') || '[]';
    const existing = JSON.parse(saved);
    localStorage.setItem('leidy-ratings', JSON.stringify([...existing, ratingData]));

    // Log para analytics
  };

  return { ratings, submitRating };
};

export default QuickRating;