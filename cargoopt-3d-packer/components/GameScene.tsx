/**
 * GameScene Component - Airplane Cargo Hold 3D Packer
 * 
 * Features:
 * - Realistic airplane cargo hold visualization
 * - Horizontal loading from back to front
 * - Vibrant, modern UI
 * - Real-time progress tracking
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Box } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LuggageBlockData } from './LuggageBlock';
import { Zap, Package } from 'lucide-react';

interface GameSceneProps {
  luggage: LuggageBlockData[];
  totalSpace: number;
  occupiedSpace: number;
  freeSpace: number;
  flightNumber: string;
  onGameComplete: (placedCount: number) => void;
}

interface PlacedBlock {
  id: string;
  position: [number, number, number];
  size: number;
}

/**
 * Airplane Cargo Hold Component
 */
function CargoHold({ bounds }: { bounds: { width: number; height: number; depth: number } }) {
  return (
    <group>
      {/* Main cargo hold body */}
      <Box args={[bounds.width, bounds.height, bounds.depth]} position={[0, bounds.height / 2, 0]}>
        <meshStandardMaterial color="#e0e7ff" transparent opacity={0.15} />
      </Box>

      {/* Floor with grid pattern */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[bounds.width, bounds.depth]} />
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.3} />
      </mesh>

      {/* Grid lines on floor */}
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={`grid-x-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                -bounds.width / 2 + (i * bounds.width) / 10,
                0.01,
                -bounds.depth / 2,
                -bounds.width / 2 + (i * bounds.width) / 10,
                0.01,
                bounds.depth / 2,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#818cf8" transparent opacity={0.4} />
        </line>
      ))}

      {/* Walls with metallic appearance */}
      {/* Left wall */}
      <Box args={[0.1, bounds.height, bounds.depth]} position={[-bounds.width / 2, bounds.height / 2, 0]}>
        <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Right wall */}
      <Box args={[0.1, bounds.height, bounds.depth]} position={[bounds.width / 2, bounds.height / 2, 0]}>
        <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Back wall (rear of plane) */}
      <Box args={[bounds.width, bounds.height, 0.1]} position={[0, bounds.height / 2, -bounds.depth / 2]}>
        <meshStandardMaterial color="#4f46e5" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Front wall (front of plane) */}
      <Box args={[bounds.width, bounds.height, 0.1]} position={[0, bounds.height / 2, bounds.depth / 2]}>
        <meshStandardMaterial color="#4f46e5" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Ceiling */}
      <Box args={[bounds.width, 0.1, bounds.depth]} position={[0, bounds.height, 0]}>
        <meshStandardMaterial color="#818cf8" metalness={0.6} roughness={0.3} />
      </Box>
    </group>
  );
}

/**
 * Luggage Block Mesh Component
 */
function LuggageBlockMesh({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: number;
  color: string;
}) {
  return (
    <Box args={[size, size, size]} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      {/* Highlight edge */}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </Box>
  );
}

/**
 * Camera Controller
 */
function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(20, 12, 20);
    camera.lookAt(0, 3, 0);
  }, [camera]);
  return <OrbitControls />;
}

/**
 * Scene Content
 */
function SceneContent({
  bounds,
  placedBlocks,
}: {
  bounds: { width: number; height: number; depth: number };
  placedBlocks: PlacedBlock[];
}) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[20, 25, 20]} intensity={1.5} castShadow />
      <pointLight position={[-15, 15, -15]} intensity={0.8} color="#60a5fa" />
      <pointLight position={[15, 15, 15]} intensity={0.8} color="#34d399" />

      <group>
        {/* Cargo hold */}
        <CargoHold bounds={bounds} />

        {/* Placed blocks */}
        {placedBlocks.map((block, idx) => (
          <LuggageBlockMesh
            key={block.id}
            position={block.position}
            size={block.size}
            color={`hsl(${200 + (idx * 360) / placedBlocks.length}, 100%, 50%)`}
          />
        ))}
      </group>

      <CameraController />
    </>
  );
}

/**
 * Main GameScene Component
 */
export function GameScene({
  luggage,
  totalSpace,
  occupiedSpace,
  freeSpace,
  flightNumber,
  onGameComplete,
}: GameSceneProps) {
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [stagingBlocks, setStagingBlocks] = useState<LuggageBlockData[]>(luggage);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Calculate container dimensions (horizontal orientation)
  const containerSize = Math.cbrt(totalSpace);
  const bounds = {
    width: containerSize * 1.5, // Wider for horizontal loading
    height: containerSize * 0.8, // Lower height
    depth: containerSize * 1.2, // Deeper for front-to-back loading
  };

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

  // Check if position is within bounds
  const isWithinBounds = (
    pos: [number, number, number],
    size: number,
    bounds: { width: number; height: number; depth: number }
  ): boolean => {
    const tolerance = 0.01;
    return (
      Math.abs(pos[0]) + size / 2 <= bounds.width / 2 + tolerance &&
      pos[1] - size / 2 >= -tolerance &&
      pos[1] + size / 2 <= bounds.height + tolerance &&
      Math.abs(pos[2]) + size / 2 <= bounds.depth / 2 + tolerance
    );
  };

  // Handle placing a block - load from back to front
  const handlePlaceBlock = useCallback(
    (blockId: string) => {
      const block = stagingBlocks.find((b) => b.id === blockId);
      if (!block) return;

      const size = getBlockSize(block.volume);
      let position: [number, number, number] | null = null;

      // Load from back to front (negative Z to positive Z)
      const step = Math.max(size * 0.5, 0.05);

      outerLoop: for (let z = -bounds.depth / 2 + size / 2; z < bounds.depth / 2; z += step) {
        for (let y = size / 2; y < bounds.height - size / 2; y += step) {
          for (let x = -bounds.width / 2 + size / 2; x < bounds.width / 2; x += step) {
            const testPos: [number, number, number] = [x, y, z];

            if (
              isWithinBounds(testPos, size, bounds) &&
              !checkCollision(testPos, size, placedBlocks)
            ) {
              position = testPos;
              break outerLoop;
            }
          }
        }
      }

      // Try with smaller step if needed
      if (!position) {
        const smallStep = size * 0.25;
        outerLoop2: for (let z = -bounds.depth / 2 + size / 2; z < bounds.depth / 2; z += smallStep) {
          for (let y = size / 2; y < bounds.height - size / 2; y += smallStep) {
            for (let x = -bounds.width / 2 + size / 2; x < bounds.width / 2; x += smallStep) {
              const testPos: [number, number, number] = [x, y, z];

              if (
                isWithinBounds(testPos, size, bounds) &&
                !checkCollision(testPos, size, placedBlocks)
              ) {
                position = testPos;
                break outerLoop2;
              }
            }
          }
        }
      }

      if (position) {
        const newPlacedBlocks = [...placedBlocks, { id: blockId, position, size }];
        setPlacedBlocks(newPlacedBlocks);
        setStagingBlocks((prev) => prev.filter((b) => b.id !== blockId));

        // Check if all blocks are placed
        if (newPlacedBlocks.length === luggage.length) {
          setTimeout(() => onGameComplete(newPlacedBlocks.length), 500);
        }
      }
    },
    [stagingBlocks, placedBlocks, bounds, luggage.length, onGameComplete]
  );

  // Handle removing a block
  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      setPlacedBlocks((prev) => prev.filter((b) => b.id !== blockId));
      const block = luggage.find((b) => b.id === blockId);
      if (block) {
        setStagingBlocks((prev) => [...prev, block]);
      }
    },
    [luggage]
  );

  const isComplete = placedBlocks.length === luggage.length && luggage.length > 0;
  const spaceUsedPercentage = ((occupiedSpace + placedBlocks.length * 0.0895) / totalSpace) * 100;

  return (
    <div className="w-full h-full flex bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [20, 12, 20], fov: 50, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneContent bounds={bounds} placedBlocks={placedBlocks} />
        </Canvas>

        {/* Progress HUD - Top Left */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <Card className="bg-gradient-to-br from-blue-600/90 to-indigo-600/90 border-2 border-cyan-400 p-4 backdrop-blur-sm shadow-lg">
            <div className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-cyan-300" />
              Cargo Loading Progress
            </div>
            <div className="text-2xl font-bold text-cyan-300 mb-2">
              {placedBlocks.length} / {luggage.length}
            </div>
            <div className="w-48 h-3 bg-indigo-900 rounded-full overflow-hidden border border-cyan-400">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300"
                style={{ width: `${(placedBlocks.length / luggage.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-cyan-200 mt-2">
              {((placedBlocks.length / luggage.length) * 100).toFixed(0)}% Complete
            </p>
          </Card>
        </div>

        {/* Space Utilization - Top Right */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <Card className="bg-gradient-to-br from-green-600/90 to-emerald-600/90 border-2 border-lime-400 p-4 backdrop-blur-sm shadow-lg">
            <div className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-lime-300" />
              Space Utilization
            </div>
            <div className="text-2xl font-bold text-lime-300">
              {spaceUsedPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-lime-200 mt-1">
              {(occupiedSpace + placedBlocks.length * 0.0895).toFixed(2)} / {totalSpace.toFixed(2)} m³
            </p>
          </Card>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <Card className="bg-gradient-to-br from-purple-600/90 to-pink-600/90 border-2 border-pink-400 p-4 backdrop-blur-sm max-w-xs shadow-lg">
            <div className="text-xs text-white space-y-1">
              <p className="font-bold text-pink-200">📋 How to Load:</p>
              <p>
                <span className="font-semibold text-pink-300">Click bags</span> in the list to place them
              </p>
              <p>
                <span className="font-semibold text-pink-300">Scroll</span> to zoom
              </p>
              <p>
                <span className="font-semibold text-pink-300">Right-click drag</span> to rotate view
              </p>
            </div>
          </Card>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-4 border-yellow-300 p-8 backdrop-blur-sm text-center shadow-2xl animate-bounce">
              <h2 className="text-4xl font-bold text-white mb-2">🎉 All Cargo Loaded!</h2>
              <p className="text-white text-lg font-semibold">
                Successfully loaded all {luggage.length} passenger bags into the cargo hold.
              </p>
              <p className="text-white/90 text-sm mt-2">Generating report...</p>
            </Card>
          </div>
        )}
      </div>

      {/* Luggage List Sidebar */}
      <div className="w-80 bg-gradient-to-b from-indigo-900 to-purple-900 border-l-4 border-cyan-400 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b-2 border-cyan-400 bg-gradient-to-r from-indigo-800 to-purple-800">
          <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Luggage Queue
          </h3>
          <p className="text-xs text-cyan-200 mt-1">Click to place bags in the cargo hold</p>
        </div>

        {/* Staging blocks list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {stagingBlocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cyan-300 text-sm font-semibold">✓ All bags loaded!</p>
            </div>
          ) : (
            stagingBlocks.map((block) => (
              <Card
                key={block.id}
                className={`p-3 cursor-pointer transition-all border-2 ${
                  selectedBlockId === block.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-yellow-400 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-800 to-purple-800 border-indigo-600 hover:border-cyan-400'
                }`}
                onClick={() => {
                  setSelectedBlockId(block.id);
                  handlePlaceBlock(block.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{block.passengerName}</p>
                    <p className="text-xs text-cyan-200 mt-1">Booking: {block.bookingId}</p>
                    <p className="text-xs text-cyan-300 mt-1 font-semibold">
                      Volume: {block.volume.toFixed(3)} m³
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold">
                    Ready
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Placed blocks list */}
        {placedBlocks.length > 0 && (
          <div className="border-t-2 border-cyan-400 p-4 bg-gradient-to-r from-indigo-800 to-purple-800">
            <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {placedBlocks.length}
              </span>
              Placed
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {placedBlocks.map((block) => {
                const lugItem = luggage.find((l) => l.id === block.id);
                return (
                  <Card
                    key={block.id}
                    className="p-2 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-2 border-cyan-500 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-cyan-100 truncate">{lugItem?.passengerName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-6 px-2 text-cyan-300 hover:text-red-400 hover:bg-red-600/20"
                      onClick={() => handleRemoveBlock(block.id)}
                    >
                      ✕
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

export default GameScene;
