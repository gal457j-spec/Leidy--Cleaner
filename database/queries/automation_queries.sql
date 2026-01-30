-- Consultas para automações do sistema

-- Agendamentos próximos que precisam de lembrete (24h antes)
SELECT b.*, u.email, u.phone, u.name
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.booking_date >= NOW()
  AND b.booking_date <= NOW() + INTERVAL '24 hours'
  AND b.status = 'confirmed'
  AND b.id NOT IN (SELECT booking_id FROM automation_logs WHERE automation_type = 'reminder_sent')
ORDER BY b.booking_date;

-- Agendamentos não atribuídos
SELECT b.*
FROM bookings b
WHERE b.team_member_id IS NULL
  AND b.status = 'confirmed'
  AND b.booking_date > NOW()
ORDER BY b.booking_date
LIMIT 10;

-- Agendamentos para follow-up (1-7 dias após conclusão)
SELECT b.*, u.email, u.phone, u.name
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.status = 'completed'
  AND b.completed_at >= NOW() - INTERVAL '7 days'
  AND b.completed_at < NOW() - INTERVAL '1 day'
  AND b.id NOT IN (SELECT booking_id FROM reviews)
ORDER BY b.completed_at DESC;

-- Agendamentos com problemas (sem resposta do cliente)
SELECT b.*
FROM bookings b
WHERE b.status = 'no_show'
  OR (b.status = 'assigned' AND b.booking_date < NOW());

-- Clientes inativos (sem agendamento há 30 dias)
SELECT DISTINCT u.*
FROM users u
JOIN bookings b ON u.id = b.user_id
WHERE u.role = 'customer'
  AND MAX(b.created_at) < NOW() - INTERVAL '30 days'
GROUP BY u.id;

-- Agendamentos recorrentes para renovar
SELECT b.*
FROM bookings b
WHERE b.frequency IN ('weekly', 'biweekly', 'monthly')
  AND b.status IN ('completed', 'cancelled')
  AND b.next_scheduled_date IS NULL
ORDER BY b.booking_date DESC;
