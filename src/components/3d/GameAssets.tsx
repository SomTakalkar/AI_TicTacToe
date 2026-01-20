import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const Cross = ({ position }: { position: [number, number, number] }) => {
    const groupRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle floating animation
            groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
        }
    });

    return (
        <group position={position} ref={groupRef as any}>
            {/* Metallic Base with Red Neon Core */}
            <mesh rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 1.2, 0.2]} />
                <meshStandardMaterial
                    color="#444"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#ff003c"
                    emissiveIntensity={2}
                />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 1.2, 0.2]} />
                <meshStandardMaterial
                    color="#444"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#ff003c"
                    emissiveIntensity={2}
                />
            </mesh>
            {/* Inner light glow simulation board */}
            <pointLight position={[0, 0, 0]} intensity={2} distance={3} color="#ff003c" />
        </group>
    );
};

export const Circle = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2 + 1) * 0.05;
            meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.getElapsedTime()) * 0.1;
        }
    });

    return (
        <group position={position}>
            <mesh rotation={[Math.PI / 2, 0, 0]} ref={meshRef} castShadow receiveShadow>
                <torusGeometry args={[0.4, 0.08, 16, 32]} />
                <meshStandardMaterial
                    color="#444"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#00f3ff"
                    emissiveIntensity={2}
                />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={2} distance={3} color="#00f3ff" />
        </group>
    );
};

export const GridLines = ({ gridSize }: { gridSize: '3x3' | '5x5' }) => {
    const size = gridSize === '3x3' ? 1.5 : 2.5;
    const lines = [];
    // Neon Blue
    const color = "#00f3ff";
    const thickness = 0.03; // Slightly thicker for better visibility

    // Vertical Lines (Running along Z-axis at different X positions)
    for (let i = 1; i < (gridSize === '3x3' ? 3 : 5); i++) {
        const x = -size + i * (size * 2 / (gridSize === '3x3' ? 3 : 5));
        lines.push(
            <mesh key={`v-${i}`} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
                <cylinderGeometry args={[thickness, thickness, size * 2, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={5}
                    toneMapped={false}
                />
            </mesh>
        );
    }

    // Horizontal Lines (Running along X-axis at different Z positions)
    for (let i = 1; i < (gridSize === '3x3' ? 3 : 5); i++) {
        const z = -size + i * (size * 2 / (gridSize === '3x3' ? 3 : 5));
        lines.push(
            <mesh key={`h-${i}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]} receiveShadow>
                <cylinderGeometry args={[thickness, thickness, size * 2, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={5}
                    toneMapped={false}
                />
            </mesh>
        );
    }

    // Outer Frame
    const frameThickness = 0.05;
    // Top (at Z = -size, along X)
    lines.push(<mesh key="t" position={[0, 0, -size]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[frameThickness, frameThickness, size * 2, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} /></mesh>);
    // Bottom (at Z = size, along X)
    lines.push(<mesh key="b" position={[0, 0, size]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[frameThickness, frameThickness, size * 2, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} /></mesh>);
    // Left (at X = -size, along Z)
    lines.push(<mesh key="l" position={[-size, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[frameThickness, frameThickness, size * 2, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} /></mesh>);
    // Right (at X = size, along Z)
    lines.push(<mesh key="r" position={[size, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[frameThickness, frameThickness, size * 2, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} /></mesh>);


    return <group>{lines}</group>;
};
