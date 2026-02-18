export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default Booking;
