/**
 * Main API Routes
 * Rotas principais da API
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// garantir pasta uploads
const uploadDir = path.join(__dirname, '..', '..', 'backend', 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Controllers
const BookingController = require('../controllers/BookingController');
const PaymentController = require('../controllers/PaymentController');
const ReviewController = require('../controllers/ReviewController');

// Middleware
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateBookingData, validatePaymentData, validateReviewData } = require('../middleware/validation');

// ===== BOOKINGS =====
router.post('/bookings', authenticateToken, validateBookingData, (req, res) => {
  BookingController.createBooking(req, res);
});

// Upload de arquivos (fotos)
router.post('/uploads', authenticateToken, upload.array('photos', 8), (req, res) => {
  const files = req.files || [];
  const urls = files.map(f => ({ filename: f.filename, url: `${process.env.BASE_URL || ''}/uploads/${f.filename}` }));
  res.json({ success: true, files: urls });
});

router.get('/bookings/:userId', authenticateToken, (req, res) => {
  BookingController.getUserBookings(req, res);
});

router.put('/bookings/:bookingId', authenticateToken, (req, res) => {
  BookingController.updateBooking(req, res);
});

router.delete('/bookings/:bookingId', authenticateToken, (req, res) => {
  BookingController.cancelBooking(req, res);
});

// ===== PAYMENTS =====
router.post('/payments', authenticateToken, validatePaymentData, (req, res) => {
  PaymentController.processPayment(req, res);
});

router.get('/payments/:userId', authenticateToken, (req, res) => {
  PaymentController.getPaymentHistory(req, res);
});

router.post('/refunds', authenticateToken, authorizeRole(['admin']), (req, res) => {
  PaymentController.processRefund(req, res);
});

// ===== REVIEWS =====
router.post('/reviews', authenticateToken, validateReviewData, (req, res) => {
  ReviewController.createReview(req, res);
});

router.get('/reviews', (req, res) => {
  ReviewController.getPublicReviews(req, res);
});

router.get('/reviews/stats', (req, res) => {
  ReviewController.getRatingStats(req, res);
});

router.post('/reviews/:reviewId/response', authenticateToken, authorizeRole(['admin']), (req, res) => {
  ReviewController.respondToReview(req, res);
});

module.exports = router;
