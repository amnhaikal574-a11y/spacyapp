/**
 * LuggageBlock Component
 * Represents a single piece of passenger luggage as a 3D cube
 * 
 * Features:
 * - Calculated dimensions based on volume (perfect cube)
 * - Color-coded by status (staging, placed, invalid)
 * - Collision detection with other blocks
 * - Boundary checking within Red Zone
 * - Drag and drop interaction
 */

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface LuggageBlockData {
  id: string;
  volume: number; // in m³
  passengerName: string;
  bookingId: string;
}

interface LuggageBlockProps {
  data: LuggageBlockData;
  position: [number, number, number];
  isDragging: boolean;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onStatusChange: (id: string, status: 'staging' | 'placed' | 'invalid') => void;
  redZoneBounds: {
    width: number;
    height: number;
    depth: number;
  };
  otherBlocks: Array<{
    id: string;
    position: [number, number, number];
    size: number;
  }>;
}

/**
 * Calculates cube dimensions from volume
 * Formula: side = cbrt(volume)
 * @param volume Volume in cubic meters
 * @returns Side length of the cube
 */
function calculateBlockSize(volume: number): number {
  return Math.cbrt(volume);
}

/**
 * Checks if two boxes collide (AABB collision detection)
 * @param pos1 Position of first box
 * @param size1 Size of first box
 * @param pos2 Position of second box
 * @param size2 Size of second box
 * @returns true if boxes collide
 */
function checkCollision(
  pos1: [number, number, number],
  size1: number,
  pos2: [number, number, number],
  size2: number
): boolean {
  const half1 = size1 / 2;
  const half2 = size2 / 2;

  return (
    Math.abs(pos1[0] - pos2[0]) < half1 + half2 &&
    Math.abs(pos1[1] - pos2[1]) < half1 + half2 &&
    Math.abs(pos1[2] - pos2[2]) < half1 + half2
  );
}

/**
 * Checks if a block is within the Red Zone boundaries
 * @param position Block position
 * @param blockSize Block size
 * @param bounds Red Zone dimensions
 * @returns true if block is fully within bounds
 */
function isWithinBounds(
  position: [number, number, number],
  blockSize: number,
  bounds: { width: number; height: number; depth: number }
): boolean {
  const half = blockSize / 2;
  const redZoneHeight = bounds.height;

  // Check X bounds
  if (position[0] - half < -bounds.width / 2 || position[0] + half > bounds.width / 2) {
    return false;
  }

  // Check Y bounds (must be within Red Zone height)
  if (position[1] - half < 0 || position[1] + half > redZoneHeight) {
    return false;
  }

  // Check Z bounds
  if (position[2] - half < -bounds.depth / 2 || position[2] + half > bounds.depth / 2) {
    return false;
  }

  return true;
}

/**
 * LuggageBlock Component
 * Renders a single luggage block with collision and boundary detection
 */
export function LuggageBlock({
  data,
  position,
  isDragging,
  onPositionChange,
  onStatusChange,
  redZoneBounds,
  otherBlocks,
}: LuggageBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(position);
  const [status, setStatus] = useState<'staging' | 'placed' | 'invalid'>('staging');
  const blockSize = calculateBlockSize(data.volume);

  // Update position when prop changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // Determine block color based on status
  const getBlockColor = (): string => {
    switch (status) {
      case 'placed':
        return '#3b82f6'; // Blue - successfully placed
      case 'invalid':
        return '#ef4444'; // Red - collision or out of bounds
      case 'staging':
      default:
        return '#8b5cf6'; // Purple - in staging area
    }
  };

  // Check collision with other blocks
  const hasCollision = otherBlocks.some(
    (block) =>
      block.id !== data.id &&
      checkCollision(currentPosition, blockSize, block.position, block.size)
  );

  // Check if within bounds
  const withinBounds = isWithinBounds(currentPosition, blockSize, redZoneBounds);

  // Update status based on collision and bounds
  useEffect(() => {
    let newStatus: 'staging' | 'placed' | 'invalid' = 'staging';

    // If block is in Red Zone area (y > 0) and has no collision and within bounds
    if (currentPosition[1] > 0 && !hasCollision && withinBounds) {
      newStatus = 'placed';
    } else if (currentPosition[1] > 0 && (hasCollision || !withinBounds)) {
      newStatus = 'invalid';
    }

    setStatus(newStatus);
    onStatusChange(data.id, newStatus);
  }, [currentPosition, hasCollision, withinBounds, data.id, onStatusChange]);

  // Notify parent of position changes
  useEffect(() => {
    onPositionChange(data.id, currentPosition);
  }, [currentPosition, data.id, onPositionChange]);

  return (
    <mesh
      ref={meshRef}
      position={currentPosition}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <boxGeometry args={[blockSize, blockSize, blockSize]} />
      <meshStandardMaterial
        color={getBlockColor()}
        transparent
        opacity={isDragging ? 0.8 : 0.9}
        emissive={status === 'invalid' ? '#7f1d1d' : '#000000'}
        emissiveIntensity={status === 'invalid' ? 0.3 : 0}
      />

      {/* Outline for better visibility */}
      <lineSegments>
        <edgeGeometry attach="geometry" args={[new THREE.BoxGeometry(blockSize, blockSize, blockSize)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} transparent opacity={0.5} />
      </lineSegments>
    </mesh>
  );
}

export default LuggageBlock;
