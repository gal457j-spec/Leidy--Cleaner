/**
 * chatMessagesRoutes.js
 * Endpoints de histórico de chat
 */

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const DB_PATH = path.join(__dirname, '../../backend_data/database.db');

/**
 * GET /api/chat/history/:bookingId
 * Obter histórico de mensagens
 */
router.get('/history/:bookingId', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  db.all(
    `SELECT * FROM chat_messages 
     WHERE booking_id = ? 
     AND (sender_id = ? OR recipient_id = ?)
     ORDER BY timestamp ASC`,
    [bookingId, userId, userId],
    (err, rows) => {
      db.close();
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, messages: rows });
    }
  );
});

/**
 * POST /api/chat/send
 * Enviar mensagem
 */
router.post('/send', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  const { bookingId, text, recipientId } = req.body;
  const senderId = req.user.id;

  db.run(
    `INSERT INTO chat_messages (booking_id, sender_id, recipient_id, text, timestamp)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [bookingId, senderId, recipientId, text],
    function (err) {
      db.close();
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({
        success: true,
        messageId: this.lastID,
        message: 'Mensagem enviada'
      });
    }
  );
});

/**
 * PATCH /api/chat/messages/:messageId/read
 * Marcar mensagem como lida
 */
router.patch('/messages/:messageId/read', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);

  db.run(
    `UPDATE chat_messages SET read = 1 WHERE id = ?`,
    [req.params.messageId],
    (err) => {
      db.close();
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true });
    }
  );
});

/**
 * GET /api/chat/conversations
 * Listar todas as conversas ativas do usuário
 */
router.get('/conversations', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  const userId = req.user.id;

  db.all(
    `SELECT DISTINCT 
      CASE 
        WHEN sender_id = ? THEN recipient_id 
        ELSE sender_id 
      END as other_user_id,
      booking_id,
      MAX(timestamp) as last_message_time
     FROM chat_messages
     WHERE sender_id = ? OR recipient_id = ?
     GROUP BY other_user_id, booking_id
     ORDER BY last_message_time DESC`,
    [userId, userId, userId],
    (err, rows) => {
      if (err) {
        db.close();
        return res.status(500).json({ success: false, error: err.message });
      }

      // Enriquecer com nome do usuário
      let processed = 0;
      rows.forEach((row, idx) => {
        db.get(
          `SELECT id, name FROM users WHERE id = ?`,
          [row.other_user_id],
          (err, user) => {
            rows[idx].otherUserName = user?.name || 'Desconhecido';
            processed++;
            if (processed === rows.length) {
              db.close();
              res.json({ success: true, conversations: rows });
            }
          }
        );
      });

      if (rows.length === 0) {
        db.close();
        res.json({ success: true, conversations: [] });
      }
    }
  );
});

/**
 * Criar tabela de chat_messages
 */
const createChatTable = () => {
  const db = new sqlite3.Database(DB_PATH);
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id),
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) logger?.error('Failed to create chat_messages table', { error: err });
    db.close();
  });
};

createChatTable();

module.exports = router;
