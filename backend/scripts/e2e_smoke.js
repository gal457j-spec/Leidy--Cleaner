const axios = require('axios');

function rand() {
  return `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
}

const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function run() {
  try {
    const email = `e2e_${rand()}@vammos.com`;
    const password = 'E2ePass123!';

    console.log('1) Registering user', email);
    const reg = await axios.post(`${BASE}/api/v1/auth/register`, { email, password, name: 'E2E User', phone: '11900000000' });
    console.log(' -> Register status', reg.status);

    console.log('2) Logging in');
    const login = await axios.post(`${BASE}/api/v1/auth/login`, { email, password });
    const token = login.data?.data?.tokens?.accessToken;
    if (!token) throw new Error('No access token from login');
    console.log(' -> Login ok');

    console.log('3) Listing services');
    const services = await axios.get(`${BASE}/api/v1/services`);
    const sid = services.data.data.services[0]?.id;
    if (!sid) throw new Error('No service available');
    console.log(' -> Using service', sid);

    console.log('4) Creating booking');
    const book = await axios.post(`${BASE}/api/v1/bookings`, { serviceId: sid, bookingDate: new Date().toISOString(), address: 'Rua E2E' }, { headers: { Authorization: `Bearer ${token}` } });
    const bid = book.data.data.booking.id;
    if (!bid) throw new Error('Booking creation failed');
    console.log(' -> Booking created', bid);

    console.log('5) Paying booking (legacy)');
    const pay = await axios.post(`${BASE}/api/v1/payments`, { bookingId: bid }, { headers: { Authorization: `Bearer ${token}` } });
    console.log(' -> Pay status', pay.status);
    console.log('Result booking status:', pay.data.data.booking.status);

    console.log('\nE2E smoke completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('\nE2E smoke failed:');
    console.error(err.response ? err.response.data || err.response.status : err.message);
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = { run };
