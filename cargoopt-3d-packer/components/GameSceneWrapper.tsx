'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LuggageBlockData } from './LuggageBlock';

const GameScene = dynamic(() => import('./GameScene').then((mod) => ({ default: mod.GameScene })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-300 font-semibold">Loading cargo hold...</p>
      </div>
    </div>
  ),
});

interface GameSceneWrapperProps {
  luggage: LuggageBlockData[];
  totalSpace: number;
  occupiedSpace: number;
  freeSpace: number;
  flightNumber: string;
  onGameComplete: (placedCount: number) => void;
}

export function GameSceneWrapper({
  luggage,
  totalSpace,
  occupiedSpace,
  freeSpace,
  flightNumber,
  onGameComplete,
}: GameSceneWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300 font-semibold">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <GameScene
      luggage={luggage}
      totalSpace={totalSpace}
      occupiedSpace={occupiedSpace}
      freeSpace={freeSpace}
      flightNumber={flightNumber}
      onGameComplete={onGameComplete}
    />
  );
}

export default GameSceneWrapper;
