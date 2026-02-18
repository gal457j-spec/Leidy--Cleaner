var _a;
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import BookingService from '../services/BookingService';
export class BookingController {
}
_a = BookingController;
BookingController.create = asyncHandler(async (req, res) => {
    if (!req.user)
        throw ApiError('Not authenticated', 401);
    const { serviceId, bookingDate, notes, totalPrice } = req.body;
    if (!serviceId || !bookingDate || !totalPrice) {
        throw ApiError('Missing required booking fields', 400);
    }
    const booking = await BookingService.createBooking(req.user.id, serviceId, bookingDate, totalPrice, notes);
    res.status(201).json({ message: 'Booking created', data: { booking } });
});
BookingController.listByUser = asyncHandler(async (req, res) => {
    if (!req.user)
        throw ApiError('Not authenticated', 401);
    const bookings = await BookingService.getBookingsByUser(req.user.id);
    res.status(200).json({ message: 'Bookings retrieved', data: { bookings } });
});
BookingController.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booking = await BookingService.getById(id);
    if (!booking)
        throw ApiError('Booking not found', 404);
    // Only owner or admin can view
    if (!req.user)
        throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
        throw ApiError('Insufficient permissions', 403);
    }
    res.status(200).json({ message: 'Booking retrieved', data: { booking } });
});
BookingController.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!req.user)
        throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin')
        throw ApiError('Only admins can update bookings', 403);
    const booking = await BookingService.updateStatus(id, status);
    if (!booking)
        throw ApiError('Booking not found', 404);
    res.status(200).json({ message: 'Booking status updated', data: { booking } });
});
BookingController.remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!req.user)
        throw ApiError('Not authenticated', 401);
    // allow owner or admin to delete
    const booking = await BookingService.getById(id);
    if (!booking)
        throw ApiError('Booking not found', 404);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
        throw ApiError('Insufficient permissions', 403);
    }
    await BookingService.delete(id);
    res.status(200).json({ message: 'Booking deleted' });
});
export default BookingController;
//# sourceMappingURL=BookingController.js.map