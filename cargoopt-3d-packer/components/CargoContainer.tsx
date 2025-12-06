/**
 * CargoContainer Component
 * Renders the 3D aircraft cargo hold with Red Zone (passenger luggage area)
 * and Green Zone (commercial cargo area) using React Three Fiber
 * 
 * Visual Logic:
 * - Red Zone: Semi-transparent red area where passenger bags can be placed
 * - Green Zone: Semi-transparent green area (locked, commercial revenue)
 * - Wireframe box: Transparent outline showing total container dimensions
 */

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import * as THREE from 'three';

interface CargoContainerProps {
  totalSpace: number; // Total volume in m³
  occupiedSpace: number; // Red Zone volume in m³
  freeSpace: number; // Green Zone volume in m³
  onContainerReady?: (container: THREE.Group) => void;
}

/**
 * Calculates dimensions for a cube given volume
 * Formula: side = cbrt(volume)
 * @param volume Volume in cubic meters
 * @returns Object with width, height, depth
 */
function calculateCubeDimensions(volume: number) {
  const side = Math.cbrt(volume);
  return { width: side, height: side, depth: side };
}

/**
 * RedZone Component - Passenger luggage area
 * Semi-transparent red box where bags can be placed
 */
function RedZone({ volume }: { volume: number }) {
  const dims = calculateCubeDimensions(volume);
  
  return (
    <Box
      args={[dims.width, dims.height, dims.depth]}
      position={[0, dims.height / 2, 0]}
    >
      <meshStandardMaterial
        color="#ef4444"
        transparent
        opacity={0.3}
        wireframe={false}
      />
    </Box>
  );
}

/**
 * GreenZone Component - Commercial cargo area (locked)
 * Semi-transparent green box representing revenue cargo space
 */
function GreenZone({ volume, redZoneHeight }: { volume: number; redZoneHeight: number }) {
  const dims = calculateCubeDimensions(volume);
  
  return (
    <Box
      args={[dims.width, dims.height, dims.depth]}
      position={[0, redZoneHeight + dims.height / 2, 0]}
    >
      <meshStandardMaterial
        color="#22c55e"
        transparent
        opacity={0.2}
        wireframe={false}
      />
    </Box>
  );
}

/**
 * ContainerWireframe Component - Outer boundary of the container
 * Transparent wireframe showing total container dimensions
 */
function ContainerWireframe({ volume }: { volume: number }) {
  const dims = calculateCubeDimensions(volume);
  
  return (
    <Box
      args={[dims.width, dims.height, dims.depth]}
      position={[0, dims.height / 2, 0]}
    >
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        wireframe={true}
      />
    </Box>
  );
}

/**
 * CameraController Component
 * Manages isometric camera view with mouse controls
 * - Scroll: Zoom in/out
 * - Right-click drag: Rotate camera
 * - Middle-click drag: Pan camera
 */
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Set initial isometric camera position
    // Isometric view: 45 degrees from top, positioned at distance
    const distance = 15;
    camera.position.set(distance, distance * 0.8, distance);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, document.querySelector('canvas') || undefined]}
      enableDamping
      dampingFactor={0.05}
      autoRotate={false}
      minDistance={5}
      maxDistance={50}
    />
  );
}

/**
 * CargoContainer Main Component
 * Renders the complete 3D cargo hold environment
 */
export function CargoContainer({
  totalSpace,
  occupiedSpace,
  freeSpace,
  onContainerReady,
}: CargoContainerProps) {
  const containerRef = useRef<THREE.Group>(null);
  const redZoneDims = calculateCubeDimensions(occupiedSpace);

  useEffect(() => {
    if (containerRef.current && onContainerReady) {
      onContainerReady(containerRef.current);
    }
  }, [onContainerReady]);

  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas
        camera={{
          position: [15, 12, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        {/* Lighting setup for better 3D visualization */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.4} />

        {/* Main container group */}
        <group ref={containerRef}>
          {/* Wireframe outer boundary */}
          <ContainerWireframe volume={totalSpace} />

          {/* Red Zone - Passenger luggage area */}
          <RedZone volume={occupiedSpace} />

          {/* Green Zone - Commercial cargo area */}
          <GreenZone volume={freeSpace} redZoneHeight={redZoneDims.height} />

          {/* Floor reference plane */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#1e293b" transparent opacity={0.3} />
          </mesh>
        </group>

        {/* Camera controller for isometric view and interactions */}
        <CameraController />
      </Canvas>
    </div>
  );
}

export default CargoContainer;
