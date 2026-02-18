import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import BookingService from '../services/BookingService';

export class BookingController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const { serviceId, bookingDate, notes, totalPrice } = req.body;

    if (!serviceId || !bookingDate || !totalPrice) {
      throw ApiError('Missing required booking fields', 400);
    }

    const booking = await BookingService.createBooking(
      req.user.id,
      serviceId,
      bookingDate,
      totalPrice,
      notes
    );

    res.status(201).json({ message: 'Booking created', data: { booking } });
  });

  static listByUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const bookings = await BookingService.getBookingsByUser(req.user.id);
    res.status(200).json({ message: 'Bookings retrieved', data: { bookings } });
  });

  static getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const booking = await BookingService.getById(id);

    if (!booking) throw ApiError('Booking not found', 404);

    // Only owner or admin can view
    if (!req.user) throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    res.status(200).json({ message: 'Booking retrieved', data: { booking } });
  });

  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    if (!req.user) throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin') throw ApiError('Only admins can update bookings', 403);

    const booking = await BookingService.updateStatus(id, status);
    if (!booking) throw ApiError('Booking not found', 404);

    res.status(200).json({ message: 'Booking status updated', data: { booking } });
  });

  static remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    if (!req.user) throw ApiError('Not authenticated', 401);
    // allow owner or admin to delete
    const booking = await BookingService.getById(id);
    if (!booking) throw ApiError('Booking not found', 404);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    await BookingService.delete(id);
    res.status(200).json({ message: 'Booking deleted' });
  });
}

export default BookingController;
