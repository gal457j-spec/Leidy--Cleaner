"use client";

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CalendarPlaceholder({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string; }) {
  // react-datepicker works with Date objects
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="space-y-2">
      <DatePicker
        id={id}
        selected={selectedDate}
        onChange={(d: Date | null) => onChange(d ? d.toISOString() : '')}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="Pp"
        className="w-full p-2 border rounded"
      />
      {value && (
        <div className="text-sm text-gray-600">Selecionado: {new Date(value).toLocaleString()}</div>
      )}
    </div>
  );
}
