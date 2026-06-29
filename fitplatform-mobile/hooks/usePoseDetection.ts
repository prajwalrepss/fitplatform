import { useState, useEffect, useRef } from 'react';
import { Point2D } from '../utils/angles';

interface PoseDetectionOptions {
  active: boolean;
  exerciseId: string;
}

export function usePoseDetection({ active, exerciseId }: PoseDetectionOptions) {
  const [landmarks, setLandmarks] = useState<Point2D[]>([]);
  const frameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const loop = () => {
      timeRef.current += 0.04; // Incremental time step (approx 25 fps)
      const t = timeRef.current;

      const dummyLandmarks: Point2D[] = Array(33).fill(null).map(() => ({ x: 0.5, y: 0.5, visibility: 0.8 }));

      // Set baseline static joints (head, neck, shoulders, hips)
      dummyLandmarks[0] = { x: 0.5, y: 0.1 }; // Head
      dummyLandmarks[11] = { x: 0.4, y: 0.25, visibility: 0.9 }; // Left Shoulder
      dummyLandmarks[12] = { x: 0.6, y: 0.25, visibility: 0.9 }; // Right Shoulder
      dummyLandmarks[23] = { x: 0.42, y: 0.55, visibility: 0.9 }; // Left Hip
      dummyLandmarks[24] = { x: 0.58, y: 0.55, visibility: 0.9 }; // Right Hip

      if (exerciseId === 'bicep-curls') {
        // Bicep Curls: Oscillate elbows/wrists
        // Angle oscillates between 30 and 160 degrees
        const minAngleRad = (30 * Math.PI) / 180;
        const maxAngleRad = (160 * Math.PI) / 180;
        // Oscillation cycle
        const cycle = (Math.sin(t) + 1) / 2; // 0 to 1
        const currentAngle = minAngleRad + cycle * (maxAngleRad - minAngleRad);

        // Keep elbows tucked (unless we trigger elbow flare)
        const isElbowFlareRep = Math.floor(t / (Math.PI * 2)) % 3 === 0; // Trigger flare every 3rd rep
        const elbowXOffset = isElbowFlareRep && cycle < 0.5 ? 0.16 : 0.08;

        // Left Arm
        dummyLandmarks[13] = { x: 0.4 - elbowXOffset, y: 0.38, visibility: 0.9 }; // Left Elbow
        dummyLandmarks[15] = {
          x: dummyLandmarks[13].x + 0.14 * Math.sin(currentAngle),
          y: dummyLandmarks[13].y - 0.14 * Math.cos(currentAngle),
          visibility: 0.9,
        }; // Left Wrist

        // Right Arm
        dummyLandmarks[14] = { x: 0.6 + elbowXOffset, y: 0.38, visibility: 0.9 }; // Right Elbow
        dummyLandmarks[16] = {
          x: dummyLandmarks[14].x - 0.14 * Math.sin(currentAngle),
          y: dummyLandmarks[14].y - 0.14 * Math.cos(currentAngle),
          visibility: 0.9,
        }; // Right Wrist

      } else if (exerciseId === 'squats') {
        // Squats: Move hips/knees down and up
        const cycle = (Math.sin(t) + 1) / 2; // 0 to 1
        const squatDepth = cycle * 0.18; // squat depth movement

        // Move hips down
        dummyLandmarks[23] = { x: 0.42, y: 0.55 + squatDepth, visibility: 0.9 }; // Left Hip
        dummyLandmarks[24] = { x: 0.58, y: 0.55 + squatDepth, visibility: 0.9 }; // Right Hip

        // Knees move down and slightly out (cave in if knee cave triggers)
        const isKneeCaveRep = Math.floor(t / (Math.PI * 2)) % 4 === 0; // Trigger cave every 4th rep
        const kneeSpread = isKneeCaveRep ? 0.03 : 0.07;

        dummyLandmarks[25] = { x: 0.42 - kneeSpread, y: 0.72 + squatDepth * 0.5, visibility: 0.9 }; // Left Knee
        dummyLandmarks[26] = { x: 0.58 + kneeSpread, y: 0.72 + squatDepth * 0.5, visibility: 0.9 }; // Right Knee

        // Ankles stay static
        dummyLandmarks[27] = { x: 0.42, y: 0.9, visibility: 0.9 }; // Left Ankle
        dummyLandmarks[28] = { x: 0.58, y: 0.9, visibility: 0.9 }; // Right Ankle

      } else if (exerciseId === 'shoulder-press') {
        // Shoulder Press: Raise wrists above head
        const cycle = (Math.sin(t) + 1) / 2; // 0 to 1 (0 = down, 1 = up)
        const pressHeight = cycle * 0.22; // press range

        // Shoulder joints
        dummyLandmarks[11] = { x: 0.38, y: 0.28, visibility: 0.9 }; // Left Shoulder
        dummyLandmarks[12] = { x: 0.62, y: 0.28, visibility: 0.9 }; // Right Shoulder

        // Elbows move out/up
        dummyLandmarks[13] = { x: 0.32, y: 0.34 - pressHeight * 0.3, visibility: 0.9 };
        dummyLandmarks[14] = { x: 0.68, y: 0.34 - pressHeight * 0.3, visibility: 0.9 };

        // Wrists raise overhead
        dummyLandmarks[15] = { x: 0.34, y: 0.32 - pressHeight, visibility: 0.9 };
        dummyLandmarks[16] = { x: 0.66, y: 0.32 - pressHeight, visibility: 0.9 };

      } else {
        // Fallback: Default slight bicep curl oscillation
        const cycle = (Math.sin(t) + 1) / 2;
        const currentAngle = (90 * Math.PI) / 180 + cycle * ((150 * Math.PI) / 180);
        dummyLandmarks[13] = { x: 0.32, y: 0.36, visibility: 0.9 };
        dummyLandmarks[15] = {
          x: dummyLandmarks[13].x + 0.12 * Math.sin(currentAngle),
          y: dummyLandmarks[13].y - 0.12 * Math.cos(currentAngle),
          visibility: 0.9,
        };
      }

      setLandmarks(dummyLandmarks);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [active, exerciseId]);

  return landmarks;
}
