// Controller placeholder para testes
const db = require('../db');
const EmailService = require('../services/EmailService');

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.includes(' ')) return false;
  if (!email.includes('@')) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function subscribe(req, res) {
  try {
    const { email, name } = req.body;
    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await db.run(
      `INSERT INTO newsletter_subscribers (email, name) VALUES (?, ?)`,
      [email, name]
    );
    
    if (EmailService && typeof EmailService.sendWelcomeEmail === 'function') {
      await EmailService.sendWelcomeEmail(email, name);
    }
    
    return res.status(201).json({ success: true, id: result.lastID });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  isValidEmail,
  subscribe
};
