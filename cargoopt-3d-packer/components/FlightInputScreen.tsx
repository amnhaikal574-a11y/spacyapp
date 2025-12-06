'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plane, AlertCircle } from 'lucide-react';

interface FlightInputScreenProps {
  onFlightInput: (flightNumber: string) => void;
  error?: string | null;
}

export function FlightInputScreen({ onFlightInput, error }: FlightInputScreenProps) {
  const [flightNumber, setFlightNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber.trim()) return;
    
    setIsLoading(true);
    await onFlightInput(flightNumber.toUpperCase());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl relative z-10">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full">
                <Plane className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              CargoOpt 3D Packer
            </h1>
            <p className="text-gray-600 text-sm">Airline Cargo Loading Management System</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold text-sm">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Flight Number
              </label>
              <Input
                type="text"
                placeholder="e.g., AB201, SQ123, MH370"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold uppercase"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the flight number from your database
              </p>
            </div>

            <Button
              type="submit"
              disabled={!flightNumber.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading Flight Data...' : 'Start Loading Cargo'}
            </Button>
          </form>

          {/* Info section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              💡 <span className="font-semibold">Tip:</span> Enter a valid flight number to load passenger luggage data and begin the cargo loading simulation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FlightInputScreen;
