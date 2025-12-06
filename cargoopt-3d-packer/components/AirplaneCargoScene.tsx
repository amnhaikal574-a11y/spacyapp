/**
 * AirplaneCargoScene Component - Realistic Airplane Cargo Hold
 * 
 * Features:
 * - Airplane cargo hold environment (horizontal loading)
 * - Loading from back to front
 * - Vibrant colors and lighting
 * - Realistic airplane interior
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LuggageBlockData } from './LuggageBlock';
import { Trash2, Download, CheckCircle } from 'lucide-react';

interface AirplaneCargoSceneProps {
  luggage: LuggageBlockData[];
  flightInfo: {
    flightNumber: string;
    origin: string;
    destination: string;
    aircraftType: string;
    totalSpace: number;
    occupiedSpace: number;
  };
  onComplete: (placedBlocks: PlacedBlock[]) => void;
}

interface PlacedBlock {
  id: string;
  position: [number, number, number];
  size: number;
}

/**
 * CameraController Component
 */
function CameraController() {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);
  return <OrbitControls />;
}

/**
 * Airplane Cargo Hold Environment
 */
function CargoHoldEnvironment({ cargoLength, cargoWidth, cargoHeight }: { cargoLength: number; cargoWidth: number; cargoHeight: number }) {
  return (
    <group>
      {/* Floor - metallic with grid pattern */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cargoWidth, cargoLength]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floor grid lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={Math.floor(cargoLength / 0.5) * 2 + Math.floor(cargoWidth / 0.5) * 2}
            array={new Float32Array(
              Array.from({ length: Math.floor(cargoLength / 0.5) }, (_, i) => [
                -cargoWidth / 2,
                0.01,
                -cargoLength / 2 + i * 0.5,
                cargoWidth / 2,
                0.01,
                -cargoLength / 2 + i * 0.5,
              ]).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#999999" linewidth={1} />
      </lineSegments>

      {/* Left wall - aluminum */}
      <mesh position={[-cargoWidth / 2, cargoHeight / 2, 0]}>
        <planeGeometry args={[cargoLength, cargoHeight]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Right wall - aluminum */}
      <mesh position={[cargoWidth / 2, cargoHeight / 2, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cargoLength, cargoHeight]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Back wall - darker (rear of plane) */}
      <mesh position={[0, cargoHeight / 2, -cargoLength / 2]} rotation={[0, 0, 0]}>
        <planeGeometry args={[cargoWidth, cargoHeight]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Front wall - lighter (front of plane) */}
      <mesh position={[0, cargoHeight / 2, cargoLength / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cargoWidth, cargoHeight]} />
        <meshStandardMaterial color="#b8b8b8" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ceiling - curved like airplane */}
      <mesh position={[0, cargoHeight, 0]}>
        <planeGeometry args={[cargoWidth, cargoLength]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Loading direction indicator - arrow pointing forward */}
      <group position={[0, 0.5, -cargoLength / 2 + 1]}>
        <mesh>
          <coneGeometry args={[0.3, 0.5, 8]} />
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.5]} />
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Loading direction text indicator */}
      <group position={[0, cargoHeight - 0.5, -cargoLength / 2 + 0.5]}>
        <mesh>
          <boxGeometry args={[2, 0.3, 0.1]} />
          <meshStandardMaterial color="#4ecdc4" emissive="#4ecdc4" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Luggage Block Mesh
 */
function LuggageBlockMesh({
  position,
  size,
  color,
  passengerName,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  passengerName: string;
}) {
  return (
    <group position={position}>
      <Box args={[size, size, size]}>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </Box>
      {/* Highlight edges */}
      <Box args={[size + 0.02, size + 0.02, size + 0.02]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </Box>
    </group>
  );
}

/**
 * 3D Scene Content
 */
function SceneContent({
  cargoLength,
  cargoWidth,
  cargoHeight,
  placedBlocks,
  luggage,
}: {
  cargoLength: number;
  cargoWidth: number;
  cargoHeight: number;
  placedBlocks: PlacedBlock[];
  luggage: LuggageBlockData[];
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow color="#ffffff" />
      <directionalLight position={[-10, 10, -10]} intensity={0.8} color="#87ceeb" />
      <pointLight position={[0, cargoHeight - 0.5, 0]} intensity={1} color="#ffffff" />

      {/* Cargo Hold Environment */}
      <CargoHoldEnvironment cargoLength={cargoLength} cargoWidth={cargoWidth} cargoHeight={cargoHeight} />

      {/* Placed Luggage Blocks */}
      {placedBlocks.map((block) => {
        const lugItem = luggage.find((l) => l.id === block.id);
        return (
          <LuggageBlockMesh
            key={block.id}
            position={block.position}
            size={block.size}
            color="#4f46e5"
            passengerName={lugItem?.passengerName || 'Unknown'}
          />
        );
      })}

      <CameraController />
    </>
  );
}

/**
 * Main AirplaneCargoScene Component
 */
export function AirplaneCargoScene({
  luggage,
  flightInfo,
  onComplete,
}: AirplaneCargoSceneProps) {
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [stagingBlocks, setStagingBlocks] = useState<LuggageBlockData[]>(luggage);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Cargo hold dimensions (in meters)
  const cargoLength = 20; // Front to back
  const cargoWidth = 6; // Left to right
  const cargoHeight = 2.5; // Floor to ceiling

  const getBlockSize = (volume: number) => Math.cbrt(volume);

  // Improved collision detection
  const checkCollision = (
    newPos: [number, number, number],
    newSize: number,
    existingBlocks: PlacedBlock[]
  ): boolean => {
    const tolerance = 0.01;

    return existingBlocks.some((block) => {
      const dx = Math.abs(newPos[0] - block.position[0]);
      const dy = Math.abs(newPos[1] - block.position[1]);
      const dz = Math.abs(newPos[2] - block.position[2]);

      const minDistX = (newSize + block.size) / 2 - tolerance;
      const minDistY = (newSize + block.size) / 2 - tolerance;
      const minDistZ = (newSize + block.size) / 2 - tolerance;

      return dx < minDistX && dy < minDistY && dz < minDistZ;
    });
  };

  // Check if position is within cargo hold bounds
  const isWithinBounds = (
    pos: [number, number, number],
    size: number
  ): boolean => {
    const tolerance = 0.01;
    return (
      Math.abs(pos[0]) + size / 2 <= cargoWidth / 2 + tolerance &&
      pos[1] - size / 2 >= -tolerance &&
      pos[1] + size / 2 <= cargoHeight + tolerance &&
      Math.abs(pos[2]) + size / 2 <= cargoLength / 2 + tolerance
    );
  };

  // Place block with improved algorithm - load from back to front
  const handlePlaceBlock = useCallback(
    (blockId: string) => {
      const block = stagingBlocks.find((b) => b.id === blockId);
      if (!block) return;

      const size = getBlockSize(block.volume);
      let position: [number, number, number] | null = null;

      // Load from back to front (negative Z to positive Z)
      const step = Math.max(size * 0.5, 0.05);

      outerLoop: for (let z = -cargoLength / 2 + size / 2; z < cargoLength / 2; z += step) {
        for (let y = size / 2; y < cargoHeight - size / 2; y += step) {
          for (let x = -cargoWidth / 2 + size / 2; x < cargoWidth / 2; x += step) {
            const testPos: [number, number, number] = [x, y, z];

            if (isWithinBounds(testPos, size) && !checkCollision(testPos, size, placedBlocks)) {
              position = testPos;
              break outerLoop;
            }
          }
        }
      }

      // Try with smaller step if needed
      if (!position) {
        const smallStep = size * 0.25;
        outerLoop2: for (let z = -cargoLength / 2 + size / 2; z < cargoLength / 2; z += smallStep) {
          for (let y = size / 2; y < cargoHeight - size / 2; y += smallStep) {
            for (let x = -cargoWidth / 2 + size / 2; x < cargoWidth / 2; x += smallStep) {
              const testPos: [number, number, number] = [x, y, z];

              if (isWithinBounds(testPos, size) && !checkCollision(testPos, size, placedBlocks)) {
                position = testPos;
                break outerLoop2;
              }
            }
          }
        }
      }

      if (position) {
        const newPlaced = [...placedBlocks, { id: blockId, position, size }];
        setPlacedBlocks(newPlaced);
        setStagingBlocks((prev) => prev.filter((b) => b.id !== blockId));

        // Check if all luggage is placed
        if (newPlaced.length === luggage.length) {
          setShowCompletionPopup(true);
        }
      }
    },
    [stagingBlocks, placedBlocks, luggage]
  );

  // Remove block
  const handleRemoveBlock = useCallback((blockId: string) => {
    setPlacedBlocks((prev) => prev.filter((b) => b.id !== blockId));
    const block = luggage.find((b) => b.id === blockId);
    if (block) {
      setStagingBlocks((prev) => [...prev, block]);
    }
  }, [luggage]);

  const handleConfirmCompletion = () => {
    setShowCompletionPopup(false);
    onComplete(placedBlocks);
  };

  const isComplete = placedBlocks.length === luggage.length && luggage.length > 0;
  const usedSpace = placedBlocks.reduce((sum, block) => sum + block.size ** 3, 0);
  const totalSpace = cargoLength * cargoWidth * cargoHeight;
  const usedPercentage = ((usedSpace / totalSpace) * 100).toFixed(1);
  const freePercentage = (100 - parseFloat(usedPercentage)).toFixed(1);

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100">
      {/* 3D Canvas */}
      <div className="flex-1 relative bg-gradient-to-b from-sky-300 to-sky-100">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent
            cargoLength={cargoLength}
            cargoWidth={cargoWidth}
            cargoHeight={cargoHeight}
            placedBlocks={placedBlocks}
            luggage={luggage}
          />
        </Canvas>

        {/* Progress HUD */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <Card className="bg-white/95 border-2 border-blue-300 p-4 shadow-lg backdrop-blur-sm">
            <div className="text-sm font-bold text-gray-800">
              Bags Loaded: <span className={isComplete ? 'text-green-600' : 'text-blue-600'}>{placedBlocks.length}</span> /{' '}
              {luggage.length}
            </div>
            <div className="mt-2 w-48 h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <div
                className={`h-full transition-all duration-300 ${isComplete ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-cyan-500'}`}
                style={{ width: `${(placedBlocks.length / luggage.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Space: {usedPercentage}% used • {freePercentage}% free
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <Card className="bg-white/95 border-2 border-blue-300 p-4 shadow-lg backdrop-blur-sm max-w-xs">
            <div className="text-xs text-gray-700 space-y-1 font-medium">
              <p>
                <span className="font-bold text-blue-600">📦 Click bags</span> to place them
              </p>
              <p>
                <span className="font-bold text-blue-600">🔄 Scroll</span> to zoom
              </p>
              <p>
                <span className="font-bold text-blue-600">🖱️ Right-click drag</span> to rotate
              </p>
              <p className="text-red-600 font-bold mt-2">← Load from back to front</p>
            </div>
          </Card>
        </div>

        {/* Completion Popup with Confirmation Button */}
        {showCompletionPopup && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/40">
            <Card className="bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-600 p-8 shadow-2xl text-center max-w-md">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">🎉 All Bags Loaded!</h2>
              <p className="text-white text-lg font-semibold mb-4">
                Successfully loaded all {luggage.length} passenger bags
              </p>
              <div className="bg-white/20 rounded-lg p-3 mb-6">
                <p className="text-white font-bold">Space Utilization: {usedPercentage}%</p>
              </div>
              <Button
                onClick={handleConfirmCompletion}
                className="w-full bg-white text-green-700 hover:bg-gray-100 font-bold py-3 rounded-lg text-lg"
              >
                Continue to Report
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Luggage List Sidebar */}
      <div className="w-96 bg-white border-l-4 border-blue-400 flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-b-4 border-blue-600">
          <h3 className="text-xl font-bold">✈️ Luggage Queue</h3>
          <p className="text-sm text-blue-100 mt-1">Click to place bags in cargo hold</p>
        </div>

        {/* Flight Info */}
        <div className="p-3 bg-blue-50 border-b-2 border-blue-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-600 font-semibold">Flight</p>
              <p className="text-blue-700 font-bold text-lg">{flightInfo.flightNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Route</p>
              <p className="text-blue-700 font-bold">{flightInfo.origin} → {flightInfo.destination}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 font-semibold">Aircraft</p>
              <p className="text-blue-700 font-bold text-sm">{flightInfo.aircraftType}</p>
            </div>
          </div>
        </div>

        {/* Staging blocks list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {stagingBlocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm font-semibold">All bags loaded!</p>
            </div>
          ) : (
            stagingBlocks.map((block) => (
              <Card
                key={block.id}
                className={`p-3 cursor-pointer transition-all border-2 ${
                  selectedBlockId === block.id
                    ? 'bg-blue-100 border-blue-500 shadow-md'
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedBlockId(block.id);
                  handlePlaceBlock(block.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{block.passengerName}</p>
                    <p className="text-xs text-gray-600 mt-1">Booking: {block.bookingId}</p>
                    <p className="text-xs text-gray-500 mt-1">Volume: {block.volume.toFixed(3)} m³</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">Ready</Badge>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Placed blocks list */}
        {placedBlocks.length > 0 && (
          <div className="border-t-4 border-blue-300 p-3 bg-blue-50">
            <h4 className="text-sm font-bold text-gray-800 mb-2">✓ Placed ({placedBlocks.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {placedBlocks.map((block) => {
                const lugItem = luggage.find((l) => l.id === block.id);
                return (
                  <Card key={block.id} className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-green-800 truncate">{lugItem?.passengerName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6 px-2 text-gray-600 hover:text-red-600 hover:bg-red-100"
                      onClick={() => handleRemoveBlock(block.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AirplaneCargoScene;
