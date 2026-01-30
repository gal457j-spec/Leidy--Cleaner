import React, { useState } from 'react';

export const CalendarPicker = ({ onDateSelected, unavailableDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(
      (d) => new Date(d).toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateUnavailable(date) && date >= new Date()) {
      setSelectedDate(date);
      onDateSelected(date);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const unavailable = isDateUnavailable(date);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={unavailable || isPast}
          className={`p-2 rounded text-center font-semibold ${
            isSelected
              ? 'bg-blue-600 text-white'
              : unavailable || isPast
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 hover:bg-blue-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Selecione a Data</h3>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <span className="font-bold">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm font-semibold text-blue-800">
            Data selecionada: {selectedDate.toLocaleDateString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
