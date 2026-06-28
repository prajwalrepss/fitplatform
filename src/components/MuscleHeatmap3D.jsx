import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, useGLTF } from '@react-three/drei';

// -------------------------------
// Color mapping
// -------------------------------
const getColorFromLoad = (load) => {
    if (load === 0) return '#6b7280';
    if (load === 1) return '#facc15';
    if (load === 2) return '#22c55e';
    return '#ef4444';
};

// -------------------------------
// Safe Human Model Loader
// -------------------------------
function HumanBody({ muscleStatus }) {
    const gltf = useGLTF('/models/human.glb');

    const muscleColors = useMemo(() => {
        const colors = {};
        Object.keys(muscleStatus || {}).forEach((muscleId) => {
            colors[muscleId] = getColorFromLoad(
                muscleStatus[muscleId]?.load || 0
            );
        });
        return colors;
    }, [muscleStatus]);

    useMemo(() => {
        if (!gltf?.scene) return;

        gltf.scene.traverse((node) => {
            if (node.isMesh && node.material) {
                const name = node.name.toLowerCase();
                const color =
                    muscleColors[name] ||
                    muscleColors[name.replace('_', '')] ||
                    '#6b7280';

                if (node.material.color) {
                    node.material.color.set(color);
                }
            }
        });
    }, [gltf, muscleColors]);

    return <primitive object={gltf.scene} />;
}

// -------------------------------
// Fallback Model (if GLB missing)
// -------------------------------
function FallbackModel() {
    return (
        <group>
            <mesh>
                <boxGeometry args={[1, 2, 0.5]} />
                <meshStandardMaterial color="#334155" />
            </mesh>
            <Text position={[0, 1.5, 0]} fontSize={0.2} color="white">
                3D Model Not Found
            </Text>
        </group>
    );
}

// -------------------------------
// Main Component
// -------------------------------
export default function MuscleHeatmap3D({ muscleStatus }) {
    return (
        <div className="w-full h-[500px] bg-slate-900 rounded-2xl border border-slate-800">
            <Canvas camera={{ position: [3, 1, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Suspense fallback={<FallbackModel />}>
                    <HumanBody muscleStatus={muscleStatus} />
                </Suspense>

                <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={8} />
            </Canvas>
        </div>
    );
}