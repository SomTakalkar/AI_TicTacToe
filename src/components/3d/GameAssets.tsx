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
            <mesh rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 1.2, 0.2]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 1.2, 0.2]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
            </mesh>
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
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]} ref={meshRef} castShadow receiveShadow>
            <torusGeometry args={[0.4, 0.1, 16, 32]} />
            <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.2} />
        </mesh>
    );
};

export const GridLines = ({ gridSize }: { gridSize: '3x3' | '5x5' }) => {
    const size = gridSize === '3x3' ? 1.5 : 2.5;
    const lines = [];
    const color = "#9ca3af";
    const thickness = 0.05;

    // Vertical Lines
    for (let i = 1; i < (gridSize === '3x3' ? 3 : 5); i++) {
        const x = -size + i * (size * 2 / (gridSize === '3x3' ? 3 : 5));
        lines.push(
            <mesh key={`v-${i}`} position={[x, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[thickness, 0.1, size * 2]} />
                <meshStandardMaterial color={color} />
            </mesh>
        );
    }

    // Horizontal Lines
    for (let i = 1; i < (gridSize === '3x3' ? 3 : 5); i++) {
        const z = -size + i * (size * 2 / (gridSize === '3x3' ? 3 : 5));
        lines.push(
            <mesh key={`h-${i}`} position={[0, 0, z]} castShadow receiveShadow>
                <boxGeometry args={[size * 2, 0.1, thickness]} />
                <meshStandardMaterial color={color} />
            </mesh>
        );
    }

    return <group>{lines}</group>;
};
