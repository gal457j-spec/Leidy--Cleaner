import express from 'express';
import { query } from '../utils/database';

const router = express.Router();

// Only expose this endpoint in test environment.  It's used by the
// Playwright fixtures to clear everything between runs so records from one
// test don't leak into the next.  The handler runs simple DELETEs; you can
// expand it if new tables are added.
router.post('/reset', async (_req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(404).json({ error: 'Not available' });
  }

  try {
    // order matters because of foreign keys
    await query('DELETE FROM bookings');
    await query("DELETE FROM users WHERE role <> 'admin'");
    await query('DELETE FROM services');
    await query('DELETE FROM reviews');
    await query('DELETE FROM company_info');
    // keep migrations table intact so subsequent runs don't reapply them

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
