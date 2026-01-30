import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CalendarPicker from '../components/Scheduling/CalendarPicker';
import ServiceSelector from '../components/Scheduling/ServiceSelector';
import PriceCalculator from '../components/Scheduling/PriceCalculator';

export default function Agendar() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const booking = {
      date: selectedDate,
      services: selectedServices,
      address,
      cep,
      photos,
      location,
      notes,
      totalPrice: calculateTotal(),
    };
    console.log('Booking:', booking);
    // Enviar para backend
    alert('Agendamento realizado com sucesso!');
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Agendar Serviço de Limpeza</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 mx-1 rounded transition ${
                  num <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-gray-600 font-semibold">
            Passo {step} de 4
          </p>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {step === 1 && (
            <CalendarPicker onDateSelected={setSelectedDate} />
          )}

          {step === 2 && (
            <ServiceSelector onServiceSelected={setSelectedServices} />
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Localização e Detalhes</h3>
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Endereço Completo</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento, bairro, cidade"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Fotos (no momento do agendamento)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Localização em tempo real</label>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={async () => {
                        if (!navigator.geolocation) return alert('Geolocalização não suportada');
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                          setLocation(coords);
                        }, (err) => {
                          alert('Não foi possível obter localização: ' + err.message);
                        }, { enableHighAccuracy: true });
                      }}
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Capturar localização atual
                    </button>
                    <span className="text-sm text-gray-600">{location ? `Lat ${location.lat.toFixed(5)}, Lng ${location.lng.toFixed(5)}` : 'Nenhuma localização capturada'}</span>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Observações Especiais</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Apartamento com vidros especiais, animais de estimação..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Resumo do Agendamento</h3>
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-600">Data</p>
                  <p className="text-lg font-bold">{selectedDate?.toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-600">Serviços</p>
                  {selectedServices.map((service) => (
                    <p key={service.id} className="text-lg">✓ {service.name}</p>
                  ))}
                </div>
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-600">Endereço</p>
                  <p className="text-lg">{address}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-600">Observações</p>
                  <p className="text-lg">{notes || 'Nenhuma'}</p>
                </div>
                <div className="pt-4">
                  <PriceCalculator services={selectedServices} date={selectedDate} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
          >
            ← Anterior
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-lg"
            >
              ✓ Confirmar Agendamento
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
