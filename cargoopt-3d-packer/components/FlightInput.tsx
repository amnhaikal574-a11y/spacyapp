'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, AlertCircle } from 'lucide-react';
import { parseLuggageData, getLuggageByFlight, FlightData, getFlightNumber } from '@/lib/csvParser';
import { parseFlightData } from '@/lib/csvParser';

interface FlightInputProps {
  onFlightSelected: (flight: FlightData) => void;
  isLoading?: boolean;
}

export function FlightInput({ onFlightSelected, isLoading = false }: FlightInputProps) {
  const [flightNumber, setFlightNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    try {
      setSearching(true);
      setError(null);

      // Parse flight data
      const flights = await parseFlightData();
      const flight = flights.find(
        (f) => f['Flight Number'].toUpperCase() === flightNumber.toUpperCase().trim()
      );

      if (!flight) {
        setError(`Flight ${flightNumber.toUpperCase()} not found. Please check the flight number.`);
        setSearching(false);
        return;
      }

      // Verify luggage data exists for this flight
      const allLuggage = await parseLuggageData();
      const flightLuggage = getLuggageByFlight(allLuggage, flight['Flight Number']);

      if (flightLuggage.length === 0) {
        setError(`No luggage data found for flight ${flightNumber.toUpperCase()}`);
        setSearching(false);
        return;
      }

      onFlightSelected(flight);
    } catch (err) {
      console.error('Error searching flight:', err);
      setError('Error loading flight data. Please try again.');
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-12 h-12 text-blue-600 animate-bounce" />
            <h1 className="text-4xl font-bold text-gray-900">CargoOpt</h1>
          </div>
          <p className="text-lg text-gray-600">3D Cargo Loading Manager</p>
          <p className="text-sm text-gray-500 mt-2">Optimize your aircraft cargo space</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-2xl border-0 p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Load Flight Cargo</h2>
              <p className="text-gray-600">Enter your flight number to begin loading</p>
            </div>

            {/* Input Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Flight Number</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., AB201, MH370"
                  value={flightNumber}
                  onChange={(e) => {
                    setFlightNumber(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={searching || isLoading}
                  className="flex-1 text-lg font-semibold border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3"
                />
                <Button
                  onClick={handleSearch}
                  disabled={searching || isLoading || !flightNumber.trim()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-lg transition-all"
                >
                  {searching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">💡 Tip:</span> Enter the flight number from your flight manifest to load passenger luggage into the aircraft cargo hold.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl mb-1">📦</div>
                <p className="text-xs font-semibold text-gray-700">Smart Packing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✈️</div>
                <p className="text-xs font-semibold text-gray-700">3D View</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📊</div>
                <p className="text-xs font-semibold text-gray-700">Analytics</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Optimize cargo space • Reduce costs • Improve efficiency
        </p>
      </div>
    </div>
  );
}

export default FlightInput;
