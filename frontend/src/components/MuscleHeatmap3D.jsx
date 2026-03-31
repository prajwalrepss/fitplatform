import React, { useMemo, Suspense, useState, useEffect } from 'react';
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
// Safe Human Model Loader with Error Handling
// -------------------------------
function HumanBody({ muscleStatus }) {
    const [hasError, setHasError] = useState(false);

    // Wrap useGLTF with error handling
    let gltf;
    try {
        gltf = useGLTF('/models/human.glb', true);
    } catch (error) {
        console.warn('3D model not found:', error);
        return <FallbackModel />;
    }

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

    if (hasError || !gltf?.scene) {
        return <FallbackModel />;
    }

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
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <Text position={[0, 1.5, 0]} fontSize={0.15} color="#d4af35">
                3D Model Not Available
            </Text>
            <Text position={[0, 1.2, 0]} fontSize={0.1} color="#a0a0a0">
                Add human.glb to /public/models/
            </Text>
        </group>
    );
}

// -------------------------------
// Error Boundary Wrapper
// -------------------------------
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn('3D Model Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <FallbackModel />;
        }
        return this.props.children;
    }
}

// -------------------------------
// Main Component
// -------------------------------
export default function MuscleHeatmap3D({ muscleStatus }) {
    return (
        <div className="w-full h-[500px] bg-card-dark rounded-2xl border border-border-dark">
            <Canvas camera={{ position: [3, 1, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Suspense fallback={<FallbackModel />}>
                    <ErrorBoundary>
                        <HumanBody muscleStatus={muscleStatus} />
                    </ErrorBoundary>
                </Suspense>

                <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={8} />
            </Canvas>
        </div>
    );
}

// Preload the model (will fail silently if not found)
useGLTF.preload('/models/human.glb');