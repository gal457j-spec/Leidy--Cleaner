"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, MapPin, FileText, User, Loader2 } from 'lucide-react';
import { apiClient } from '@/services/api';
import CalendarPlaceholder from './CalendarPlaceholder';
import { validateBooking } from '@/utils/validators';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import useToast from './useToast';

export default function BookingForm({
  serviceId,
  initialDate = '',
  initialAddress = '',
  initialNotes = '',
  onSuccess,
}: {
  serviceId: string;
  initialDate?: string;
  initialAddress?: string;
  initialNotes?: string;
  onSuccess: (booking: any) => void;
}) {
  const { success, error } = useToast();
  const [date, setDate] = useState(initialDate);
  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState(initialNotes);
  const [service, setService] = useState<any | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<{ basePrice: number; fee: number; total: number } | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  // if parent updates initial values we should keep in sync
  useEffect(() => {
    if (initialDate !== undefined) setDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    if (initialAddress !== undefined) setAddress(initialAddress);
  }, [initialAddress]);
  useEffect(() => {
    if (initialNotes !== undefined) setNotes(initialNotes);
  }, [initialNotes]);

  // id used for accessibility linking
  const dateInputId = 'booking-date';

  useEffect(() => {
    if (serviceId) {
      apiClient
        .getServiceById(serviceId)
        .then((s) => {
          setService(s);
          // fetch price breakdown for display
          apiClient.getPriceEstimate(s.durationMinutes || 60).then((p) => {
            setPriceBreakdown({ basePrice: p.basePrice, fee: p.fee, total: p.total });
          }).catch(() => {});
        })
        .catch(() => {});
    }
    // fetch staff list for optional assignment
    apiClient.getStaffList().then(setStaffList).catch(() => {});
  }, [serviceId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessState(false);

    const err = validateBooking({ bookingDate: date, address, notes });
    if (err) {
      error(err, 'Erro na validação');
      return;
    }

    setLoading(true);
    try {
      const booking = await apiClient.createBooking({
        serviceId,
        bookingDate: date,
        address,
        notes,
        staffId: selectedStaff || undefined,
      });
      setSuccessState(true);
      success('Agendamento criado com sucesso!', 'Sucesso');
      setTimeout(() => onSuccess(booking), 1500);
    } catch (err: any) {
      error(err.message || 'Erro ao criar agendamento', 'Erro');
    } finally {
      setLoading(false);
    }
  };

  if (successState) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-success mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Agendamento Criado!
              </h3>
              <p className="text-gray-600">
                Seu agendamento foi criado com sucesso. Redirecionando...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Novo Agendamento
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {service && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">{service.category}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {service.durationMinutes} min
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                    R$ {priceBreakdown ? priceBreakdown.total.toFixed(2) : (service.basePrice || 0).toFixed(2)}
                  </div>
                  {priceBreakdown && (
                    <div className="text-xs text-gray-500">Base R$ {priceBreakdown.basePrice.toFixed(2)} + taxa R$ {priceBreakdown.fee.toFixed(2)}</div>
                  )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor={dateInputId} className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data e Horário
            </label>
            <CalendarPlaceholder id={dateInputId} value={date} onChange={setDate} />
          </div>

          <div className="space-y-2">
            <label htmlFor="booking-address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço
            </label>
            <Input
              id="booking-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Digite o endereço completo"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="booking-notes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Observações (opcional)
            </label>
            <textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Instruções especiais, preferências, etc."
            />
          </div>

          {staffList.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profissional (opcional)
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedStaff}
                onChange={e => setSelectedStaff(e.target.value)}
              >
                <option value="">Escolher automaticamente</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.rating != null ? ` (${s.rating.toFixed(1)}⭐)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Criando Agendamento...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
