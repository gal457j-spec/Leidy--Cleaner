export function validateService(form: any): string | null {
  if (!form) return 'Dados inválidos';
  if (!form.name || String(form.name).trim().length < 3) return 'Nome muito curto';
  if (!form.description || String(form.description).trim().length < 10) return 'Descrição muito curta';
  if (isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0) return 'Preço inválido';
  if (isNaN(Number(form.durationMinutes)) || Number(form.durationMinutes) <= 0) return 'Duração inválida';
  return null;
}
