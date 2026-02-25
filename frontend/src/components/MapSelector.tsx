"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { MapPin, Loader2 } from 'lucide-react';

interface MapSelectorProps {
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKeyForDev';

export default function MapSelector({
  onLocationSelect,
  initialLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  className = "w-full h-96"
}: MapSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState<string>('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };

    setSelectedLocation(newLocation);

    // Reverse geocoding para obter endereço
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: newLocation });

      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
        onLocationSelect?.({
          ...newLocation,
          address: response.results[0].formatted_address
        });
      }
    } catch (error) {
      console.error('Erro no geocoding:', error);
      onLocationSelect?.(newLocation);
    }
  }, [onLocationSelect]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };
          setSelectedLocation(currentLocation);
          onLocationSelect?.(currentLocation);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">Erro ao carregar mapa</p>
          <p className="text-sm text-gray-400">Configure a chave da API do Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando mapa...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
        center={selectedLocation}
        zoom={15}
        onClick={onMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker position={selectedLocation} />
      </GoogleMap>

      {/* Controles */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={getCurrentLocation}
          className="bg-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Minha localização</span>
        </button>
      </div>

      {/* Endereço selecionado */}
      {address && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Local selecionado:</p>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white px-3 py-2 rounded-lg shadow-md">
          <p className="text-xs text-gray-600">Clique no mapa para selecionar o local</p>
        </div>
      </div>
    </div>
  );
}