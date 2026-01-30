-- Regras de preço dinâmicas

INSERT INTO pricing_rules (rule_type, value, multiplier, description) VALUES
  ('frequency', 'weekly', 0.80, 'Desconto 20% para frequência semanal'),
  ('frequency', 'biweekly', 0.90, 'Desconto 10% para frequência quinzenal'),
  ('frequency', 'monthly', 0.95, 'Desconto 5% para frequência mensal'),
  ('urgency', 'express', 1.30, 'Taxa 30% para serviço em 24h'),
  ('urgency', 'emergency', 1.50, 'Taxa 50% para serviço na mesma hora'),
  ('quantity', 'multiple_services', 0.90, 'Desconto 10% para múltiplos serviços'),
  ('area', 'per_sqm', 0.50, 'R$ 0.50 por metro quadrado'),
  ('new_customer', 'first_booking', 0.90, 'Desconto 10% para primeiro agendamento'),
  ('advance_booking', '7_days', 0.95, 'Desconto 5% para agendamento com 7 dias antecedência');
