'use client';

import React, { useState, useEffect } from 'react';
import { FlightInput } from '@/components/FlightInput';
import { AirplaneCargoScene } from '@/components/AirplaneCargoScene';
import { ReportGenerator } from '@/components/ReportGenerator';
import { parseLuggageData, getLuggageByFlight, parseFlightData, FlightData, LuggageData } from '@/lib/csvParser';
import { LuggageBlockData } from '@/components/LuggageBlock';

interface PlacedBlock {
  id: string;
  position: [number, number, number];
  size: number;
}

type GameState = 'flight-input' | 'loading' | 'report';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('flight-input');
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [luggageData, setLuggageData] = useState<LuggageBlockData[]>([]);
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFlightSelected = async (flight: FlightData) => {
    try {
      setIsLoading(true);

      // Get all luggage data
      const allLuggage = await parseLuggageData();

      // Filter luggage for this flight
      const flightLuggage = getLuggageByFlight(allLuggage, flight['Flight Number']);

      // Convert to LuggageBlockData format
      const luggage: LuggageBlockData[] = flightLuggage.map((item) => ({
        id: item.booking_id,
        passengerName: item.passenger_name,
        bookingId: item.booking_id,
        volume: parseFloat(item['Luggage_volume (m³)']),
      }));

      setFlightData(flight);
      setLuggageData(luggage);
      setPlacedBlocks([]);
      setGameState('loading');
    } catch (error) {
      console.error('Error loading flight:', error);
      alert('Error loading flight data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadingComplete = (placed: PlacedBlock[]) => {
    setPlacedBlocks(placed);
    setGameState('report');
  };

  const handleReset = () => {
    setGameState('flight-input');
    setFlightData(null);
    setLuggageData([]);
    setPlacedBlocks([]);
  };

  return (
    <main className="w-full h-screen overflow-hidden">
      {gameState === 'flight-input' && (
        <FlightInput onFlightSelected={handleFlightSelected} isLoading={isLoading} />
      )}

      {gameState === 'loading' && flightData && (
        <AirplaneCargoScene
          luggage={luggageData}
          flightInfo={{
            flightNumber: flightData['Flight Number'],
            origin: flightData.Origin,
            destination: flightData.Destination,
            aircraftType: flightData['Aircraft Type'],
            totalSpace: parseFloat(flightData['Total_space(m³)']),
            occupiedSpace: parseFloat(flightData['Occupied_space(m³)']),
          }}
          onComplete={handleLoadingComplete}
        />
      )}

      {gameState === 'report' && flightData && (
        <ReportGenerator
          flightInfo={{
            flightNumber: flightData['Flight Number'],
            origin: flightData.Origin,
            destination: flightData.Destination,
            aircraftType: flightData['Aircraft Type'],
            totalSpace: parseFloat(flightData['Total_space(m³)']),
            occupiedSpace: parseFloat(flightData['Occupied_space(m³)']),
          }}
          placedBlocks={placedBlocks}
          totalLuggage={luggageData.length}
          onReset={handleReset}
        />
      )}
    </main>
  );
}
