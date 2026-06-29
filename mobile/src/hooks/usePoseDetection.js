import { useEffect, useRef, useState } from 'react';

export function usePoseDetection({ active, exerciseId }) {
  const [landmarks, setLandmarks] = useState([]);
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return undefined;
    }

    const loop = () => {
      timeRef.current += 0.04;
      const t = timeRef.current;
      const dummyLandmarks = Array(33)
        .fill(null)
        .map(() => ({ x: 0.5, y: 0.5, visibility: 0.8 }));

      dummyLandmarks[0] = { x: 0.5, y: 0.1, visibility: 0.9 };
      dummyLandmarks[11] = { x: 0.4, y: 0.25, visibility: 0.9 };
      dummyLandmarks[12] = { x: 0.6, y: 0.25, visibility: 0.9 };
      dummyLandmarks[23] = { x: 0.42, y: 0.55, visibility: 0.9 };
      dummyLandmarks[24] = { x: 0.58, y: 0.55, visibility: 0.9 };

      if (exerciseId === 'squats' || exerciseId === 'lunges') {
        const cycle = (Math.sin(t) + 1) / 2;
        const squatDepth = cycle * 0.18;
        const isKneeCaveRep = Math.floor(t / (Math.PI * 2)) % 4 === 0;
        const kneeSpread = isKneeCaveRep ? 0.03 : 0.07;

        dummyLandmarks[23] = { x: 0.42, y: 0.55 + squatDepth, visibility: 0.9 };
        dummyLandmarks[24] = { x: 0.58, y: 0.55 + squatDepth, visibility: 0.9 };
        dummyLandmarks[25] = { x: 0.42 - kneeSpread, y: 0.72 + squatDepth * 0.5, visibility: 0.9 };
        dummyLandmarks[26] = { x: 0.58 + kneeSpread, y: 0.72 + squatDepth * 0.5, visibility: 0.9 };
        dummyLandmarks[27] = { x: 0.42, y: 0.9, visibility: 0.9 };
        dummyLandmarks[28] = { x: 0.58, y: 0.9, visibility: 0.9 };
      } else if (exerciseId === 'shoulder-press') {
        const cycle = (Math.sin(t) + 1) / 2;
        const pressHeight = cycle * 0.22;

        dummyLandmarks[11] = { x: 0.38, y: 0.28, visibility: 0.9 };
        dummyLandmarks[12] = { x: 0.62, y: 0.28, visibility: 0.9 };
        dummyLandmarks[13] = { x: 0.32, y: 0.34 - pressHeight * 0.3, visibility: 0.9 };
        dummyLandmarks[14] = { x: 0.68, y: 0.34 - pressHeight * 0.3, visibility: 0.9 };
        dummyLandmarks[15] = { x: 0.34, y: 0.32 - pressHeight, visibility: 0.9 };
        dummyLandmarks[16] = { x: 0.66, y: 0.32 - pressHeight, visibility: 0.9 };
      } else if (exerciseId === 'lateral-raises') {
        const cycle = (Math.sin(t) + 1) / 2;
        const raiseWidth = cycle * 0.22;
        const raiseHeight = cycle * 0.08;

        dummyLandmarks[13] = { x: 0.34 - raiseWidth * 0.4, y: 0.36 - raiseHeight, visibility: 0.9 };
        dummyLandmarks[14] = { x: 0.66 + raiseWidth * 0.4, y: 0.36 - raiseHeight, visibility: 0.9 };
        dummyLandmarks[15] = { x: 0.32 - raiseWidth, y: 0.48 - raiseHeight * 2, visibility: 0.9 };
        dummyLandmarks[16] = { x: 0.68 + raiseWidth, y: 0.48 - raiseHeight * 2, visibility: 0.9 };
      } else {
        const minAngleRad = (30 * Math.PI) / 180;
        const maxAngleRad = (160 * Math.PI) / 180;
        const cycle = (Math.sin(t) + 1) / 2;
        const currentAngle = minAngleRad + cycle * (maxAngleRad - minAngleRad);
        const isElbowFlareRep = Math.floor(t / (Math.PI * 2)) % 3 === 0;
        const elbowXOffset = isElbowFlareRep && cycle < 0.5 ? 0.16 : 0.08;

        dummyLandmarks[13] = { x: 0.4 - elbowXOffset, y: 0.38, visibility: 0.9 };
        dummyLandmarks[15] = {
          x: dummyLandmarks[13].x + 0.14 * Math.sin(currentAngle),
          y: dummyLandmarks[13].y - 0.14 * Math.cos(currentAngle),
          visibility: 0.9,
        };
        dummyLandmarks[14] = { x: 0.6 + elbowXOffset, y: 0.38, visibility: 0.9 };
        dummyLandmarks[16] = {
          x: dummyLandmarks[14].x - 0.14 * Math.sin(currentAngle),
          y: dummyLandmarks[14].y - 0.14 * Math.cos(currentAngle),
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

export default usePoseDetection;
