/**
 * Validation Middleware
 * Valida dados das requisições
 */

const validateBookingData = (req, res, next) => {
  const { date, services, address } = req.body;

  const errors = [];

  if (!date) errors.push('Data é obrigatória');
  if (!services || services.length === 0) errors.push('Pelo menos um serviço é obrigatório');
  if (!address) errors.push('Endereço é obrigatório');

  if (date && new Date(date) <= new Date()) {
    errors.push('Data deve ser no futuro');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validatePaymentData = (req, res, next) => {
  const { bookingId, amount, paymentMethod } = req.body;

  const errors = [];

  if (!bookingId) errors.push('bookingId é obrigatório');
  if (!amount || amount <= 0) errors.push('Valor deve ser maior que 0');
  if (!paymentMethod) errors.push('Método de pagamento é obrigatório');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateReviewData = (req, res, next) => {
  const { bookingId, rating, comment } = req.body;

  const errors = [];

  if (!bookingId) errors.push('bookingId é obrigatório');
  if (!rating || rating < 1 || rating > 5) errors.push('Rating deve ser entre 1 e 5');
  if (!comment || comment.trim().length === 0) errors.push('Comentário é obrigatório');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = {
  validateBookingData,
  validatePaymentData,
  validateReviewData,
};
