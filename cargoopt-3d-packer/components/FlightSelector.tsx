/**
 * FlightSelector Component
 * Screen 1: Flight selection interface
 * 
 * Features:
 * - Dropdown to select flight number from FLIGHT_AI.csv
 * - Displays flight details (origin, destination, aircraft type)
 * - Shows container dimensions and space allocation
 * - "Start Loading" button to launch the 3D game
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Plane } from 'lucide-react';
import { FlightData, parseFlightData, getUniqueFlightNumbers, getFlightByNumber, getFlightNumber } from '@/lib/csvParser';

interface FlightSelectorProps {
  onFlightSelected: (flight: FlightData) => void;
}

/**
 * FlightSelector Component
 * Manages flight selection and displays flight information
 */
export function FlightSelector({ onFlightSelected }: FlightSelectorProps) {
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [selectedFlightNumber, setSelectedFlightNumber] = useState<string>('');
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load flight data on component mount
  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        const flightData = await parseFlightData();
        
        if (!flightData || flightData.length === 0) {
          setError('No flight data found in CSV file.');
          return;
        }
        
        setFlights(flightData);

        // Auto-select first flight if available
        if (flightData.length > 0) {
          const firstFlightNumber = flightData[0]['Flight Number'];
          setSelectedFlightNumber(firstFlightNumber);
          setSelectedFlight(flightData[0]);
        }
      } catch (err) {
        console.error('Error loading flights:', err);
        setError('Failed to load flight data. Please check the CSV files.');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  // Handle flight selection change
  const handleFlightChange = (flightNumber: string) => {
    setSelectedFlightNumber(flightNumber);
    const flight = getFlightByNumber(flights, flightNumber);
    setSelectedFlight(flight || null);
  };

  // Handle start loading button click
  const handleStartLoading = () => {
    if (selectedFlight) {
      onFlightSelected(selectedFlight);
    }
  };

  // Get unique flight numbers for dropdown
  const uniqueFlights = getUniqueFlightNumbers(flights);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-300 text-center">Loading flight data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md w-full">
          <Alert className="bg-red-900/20 border-red-700 mb-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
          <p className="text-slate-400 text-sm">
            Please ensure FLIGHT_AI.csv and USER_AI.csv are in the public folder.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="bg-slate-800 border-slate-700 p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-slate-100">CargoOpt 3D Packer</h1>
          </div>
          <p className="text-slate-400">Select a flight and become the Load Master</p>
        </div>

        {/* Flight selection section */}
        <div className="space-y-6">
          {/* Flight dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Select Flight</label>
            <Select value={selectedFlightNumber} onValueChange={handleFlightChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue placeholder="Choose a flight..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {uniqueFlights.map((flightNumber) => (
                  <SelectItem key={flightNumber} value={flightNumber} className="text-slate-100">
                    {flightNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Flight details */}
          {selectedFlight && (
            <div className="bg-slate-700/50 rounded-lg p-6 space-y-4 border border-slate-600">
              <div className="grid grid-cols-2 gap-4">
                {/* Route */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Route</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {selectedFlight['Origin']} → {selectedFlight['Destination']}
                  </p>
                </div>

                {/* Aircraft */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Aircraft</p>
                  <p className="text-lg font-semibold text-slate-100">{selectedFlight['Aircraft Type']}</p>
                </div>

                {/* Passengers */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Passengers</p>
                  <p className="text-lg font-semibold text-slate-100">{selectedFlight['Passengers']}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Date</p>
                  <p className="text-lg font-semibold text-slate-100">{selectedFlight['Date']}</p>
                </div>
              </div>

              {/* Container dimensions */}
              <div className="border-t border-slate-600 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Cargo Hold Dimensions</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Total space */}
                  <div className="bg-slate-600/50 rounded p-3">
                    <p className="text-xs text-slate-400">Total Space</p>
                    <p className="text-xl font-bold text-slate-100">
                      {getFlightNumber(selectedFlight, 'Total_space(m³)').toFixed(2)} m³
                    </p>
                  </div>

                  {/* Red zone (occupied/passenger luggage) */}
                  <div className="bg-red-900/30 rounded p-3 border border-red-700/50">
                    <p className="text-xs text-red-300">Red Zone (Passenger)</p>
                    <p className="text-xl font-bold text-red-200">
                      {getFlightNumber(selectedFlight, 'Occupied_space(m³)').toFixed(2)} m³
                    </p>
                  </div>

                  {/* Green zone (free/commercial) */}
                  <div className="bg-green-900/30 rounded p-3 border border-green-700/50">
                    <p className="text-xs text-green-300">Green Zone (Commercial)</p>
                    <p className="text-xl font-bold text-green-200">
                      {getFlightNumber(selectedFlight, 'Free_space(m³)').toFixed(2)} m³
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded p-4">
                <p className="text-sm text-blue-200">
                  <span className="font-semibold">Your Mission:</span> Load all passenger luggage into the Red Zone
                  without exceeding its boundaries or causing collisions. The Green Zone is reserved for commercial
                  cargo and cannot be used.
                </p>
              </div>
            </div>
          )}

          {/* Start button */}
          <Button
            onClick={handleStartLoading}
            disabled={!selectedFlight}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
          >
            Start Loading →
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default FlightSelector;
