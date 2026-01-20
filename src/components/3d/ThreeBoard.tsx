import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Cross, Circle, GridLines } from './GameAssets';

interface ThreeBoardProps {
    board: (string | null)[];
    onCellClick: (index: number) => void;
    winningLines: number[][];
    gridSize: '3x3' | '5x5';
    rotationEnabled?: boolean;
}

const BoardContent: React.FC<ThreeBoardProps> = ({ board, onCellClick, winningLines, gridSize }) => {
    // 3x3: Cells are -1, 0, 1. Size 3.
    // 5x5: Cells are -2, -1, 0, 1, 2. Size 5.

    // Mapping index to position
    const getPosition = (index: number): [number, number, number] => {
        const cols = gridSize === '3x3' ? 3 : 5;
        const row = Math.floor(index / cols);
        const col = index % cols;

        // Center offset
        const offset = Math.floor(cols / 2);

        // Spacing
        const spacing = 1.0;

        return [(col - offset) * spacing, 0, (row - offset) * spacing];
    };

    return (
        <group>
            <GridLines gridSize={gridSize} />

            {/* Clickable Zones */}
            {board.map((cell, index) => (
                <group key={index} position={getPosition(index)}>
                    {/* Invisible plane for clicking */}
                    <mesh
                        onClick={(e) => {
                            e.stopPropagation();
                            onCellClick(index);
                        }}
                        visible={false} // Make it true to debug hit areas
                    >
                        <boxGeometry args={[0.9, 0.5, 0.9]} />
                        <meshBasicMaterial color="transparent" transparent opacity={0} />
                    </mesh>

                    {cell === 'X' && <Cross position={[0, 0, 0]} />}
                    {cell === 'O' && <Circle position={[0, 0, 0]} />}
                </group>
            ))}

            {/* Winning Lines Visualization could be added here */}
            {winningLines.map((line, i) => {
                // Determine start and end positions of the line
                const startPos = getPosition(line[0]);
                const endPos = getPosition(line[line.length - 1]);
                const center = [
                    (startPos[0] + endPos[0]) / 2,
                    0.2, // slightly elevated
                    (startPos[2] + endPos[2]) / 2
                ];

                // Calculate length and rotation
                const dx = endPos[0] - startPos[0];
                const dz = endPos[2] - startPos[2];
                const length = Math.sqrt(dx * dx + dz * dz) + 0.8; // Extend a bit
                const angle = Math.atan2(dz, dx);

                return (
                    <mesh key={`win-${i}`} position={center as [number, number, number]} rotation={[0, -angle, 0]}>
                        <boxGeometry args={[length, 0.1, 0.1]} />
                        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                    </mesh>
                );
            })}
        </group>
    );
};

const ThreeBoard: React.FC<ThreeBoardProps> = ({ rotationEnabled = true, ...props }) => {
    return (
        <div className="h-[500px] w-full bg-slate-950/50 rounded-xl overflow-hidden shadow-2xl border border-slate-800 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.03),transparent)] pointer-events-none"></div>
            <Canvas shadows gl={{ antialias: true, toneMappingExposure: 1.5 }}>
                {/* Darker, moodier lighting */}
                <PerspectiveCamera makeDefault position={[0, 6, 4]} fov={45} />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.5} minPolarAngle={0} enabled={rotationEnabled} />

                {/* Lighting */}
                <ambientLight intensity={0.2} color="#0000ff" />
                <pointLight position={[10, 10, 10]} intensity={1} color="#bc13fe" />
                <pointLight position={[-10, 10, -10]} intensity={1} color="#00f3ff" />
                <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} castShadow color="#ffffff" />

                {/* Environment - Dark City Feel */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" background={false} />

                {/* Fog for depth */}
                <fog attach="fog" args={['#020617', 5, 20]} />

                <BoardContent {...props} gridSize={props.gridSize} winningLines={props.winningLines} board={props.board} onCellClick={props.onCellClick} />

                {/* Ground reflection plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial
                        color="#020617"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
            </Canvas>
            <div className={`absolute bottom-4 right-4 text-[10px] pointer-events-none font-orbitron tracking-widest transition-colors ${rotationEnabled ? 'text-neon-blue/50' : 'text-nebula-red/50'}`}>
                SYSTEM.VISUAL.3D // ROTATION {rotationEnabled ? 'ENABLED' : 'LOCKED'}
            </div>
        </div>
    );
};

export default ThreeBoard;
