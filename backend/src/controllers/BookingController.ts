import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import { query } from '../utils/database';
import BookingService from '../services/BookingService';
import { calculateServicePrice } from '../utils/priceCalculator';
import { camelize } from '../utils/transformers';
import { ReminderService } from '../services/ReminderService';

export class BookingController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    // validate input with Joi schema
    const { bookingSchema } = require('../utils/schemas');
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const { serviceId, bookingDate, address, notes, staffId } = value;

    // if staffId provided validate role
    if (staffId) {
      const existing = await query('SELECT role FROM users WHERE id = $1', [staffId]);
      if (existing.length === 0 || existing[0].role !== 'staff') {
        throw ApiError('Invalid staff member', 400);
      }
    }

    // compute price using service data
    const { ServiceService } = require('../services/ServiceService');
    const service = await ServiceService.getById(serviceId);
    if (!service) {
      throw ApiError('Service not found', 404);
    }

    // service.duration_minutes from DB (snake_case) or service.durationMinutes (camelized)
    const durationMinutes = Number(service.durationMinutes || service.duration_minutes || 60);
    const totalPrice = calculateServicePrice(durationMinutes, false); // false = duration in minutes

    const booking = await BookingService.createBooking(
      req.user.id,
      serviceId,
      bookingDate,
      totalPrice,
      address,
      notes,
      staffId
    );

    // fire off notifications asynchronously (don't block response)
    setImmediate(async () => {
      try {
        // Chamar método estático de notificação que dispara os eventos de teste
        await require('../services/NotificationService').default.notifyBookingCreated({
          id: booking.id,
          user_id: req.user?.id,
          service_name: (await query('SELECT name FROM services WHERE id = $1', [serviceId]))[0]?.name,
          scheduled_date: bookingDate,
          total_price: totalPrice,
          address: address,
          notes: notes,
          staff_id: staffId
        });

        // Agendar lembretes automáticos
        const bookingData = {
          id: booking.id,
          bookingId: booking.id,
          customerName: (await query('SELECT name FROM users WHERE id = $1', [req.user?.id]))[0]?.name,
          customerEmail: (await query('SELECT email FROM users WHERE id = $1', [req.user?.id]))[0]?.email,
          serviceName: (await query('SELECT name FROM services WHERE id = $1', [serviceId]))[0]?.name,
          scheduledDate: bookingDate,
          totalPrice: totalPrice,
          address: address,
          notes: notes
        };
        ReminderService.scheduleReminders(bookingData);
      } catch (error) {
        console.error('Erro ao enviar notificações de agendamento:', error);
      }
    });

    res.status(201).json({ message: 'Booking created', data: { booking: camelize(booking) } });
  });

  static listByUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const bookings = await BookingService.getBookingsByUser(req.user.id);
    res.status(200).json({ message: 'Bookings retrieved', data: { bookings: camelize(bookings) } });
  });

  static getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const booking = await BookingService.getById(id);

    if (!booking) throw ApiError('Booking not found', 404);

    // Only owner or admin can view
    if (!req.user) throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    const respBooking = camelize(booking);
    res.status(200).json({ message: 'Booking retrieved', data: { booking: respBooking } });
  });

  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    if (!req.user) throw ApiError('Not authenticated', 401);
    if (req.user.role !== 'admin') throw ApiError('Only admins can update bookings', 403);

    const booking = await BookingService.updateStatus(id, status);
    if (!booking) throw ApiError('Booking not found', 404);

    res.status(200).json({ message: 'Booking status updated', data: { booking: camelize(booking) } });
  });

  static remove = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };

    if (!req.user) throw ApiError('Not authenticated', 401);
    // allow owner or admin to delete
    const booking = await BookingService.getById(id);
    if (!booking) throw ApiError('Booking not found', 404);
    if (req.user.role !== 'admin' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    await BookingService.delete(id);
    res.status(200).json({ message: 'Booking deleted' });
  });

  // admin endpoint: retrieve all bookings
  static listAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') {
      throw ApiError('Only admins can view all bookings', 403);
    }

    const bookings = await BookingService.getAllBookings();
    res.status(200).json({ message: 'Bookings retrieved', data: { bookings: camelize(bookings) } });
  });

  // staff endpoints
  static assignStaff = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') {
      throw ApiError('Only admins can assign staff', 403);
    }
    const { assignStaffSchema } = require('../utils/schemas');
    const { error, value } = assignStaffSchema.validate(req.body);
    if (error) throw ApiError(error.details[0].message, 400);

    const { bookingId, staffId } = value;
    const updated = await BookingService.assignStaff(bookingId, staffId);
    if (!updated) {
      throw ApiError('Booking not found', 404);
    }
    res.status(200).json({ message: 'Staff assigned', data: { booking: camelize(updated) } });
  });

  static listByStaff = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);
    // staff or admin can use this
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
      throw ApiError('Only staff can view their bookings', 403);
    }
    const staffId = req.user.id;
    const bookings = await BookingService.getBookingsByStaff(staffId);
    res.status(200).json({ message: 'Bookings retrieved', data: { bookings: camelize(bookings) } });
  });
}

export default BookingController;
