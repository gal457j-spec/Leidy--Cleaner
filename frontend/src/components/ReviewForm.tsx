import React, { useState } from 'react';
import { apiClient, Review } from '../services/api';

export default function ReviewForm({
  bookingId,
  onSubmitted,
}: {
  bookingId: string;
  onSubmitted?: (review: Review) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const review = await apiClient.createReview({ bookingId, rating, comment });
      if (files && files.length > 0) {
        const form = new FormData();
        for (let i = 0; i < files.length; i++) {
          form.append('images', files[i]);
        }
        await apiClient.client.post(`/reviews/${review.id}/images`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (onSubmitted) onSubmitted(review);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="rating" className="block font-medium">Nota</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comment" className="block font-medium">Comentário</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-1 rounded"
        />
      </div>
      <div>
        <label htmlFor="photos" className="block font-medium">Fotos (opcional)</label>
        <input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </form>
  );
}
