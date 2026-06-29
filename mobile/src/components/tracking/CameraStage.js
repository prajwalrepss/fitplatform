import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Line, Rect } from 'react-native-svg';
import { Colors, Spacing, Typography } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CameraStage({ active = true }) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const gridLines = [];
  for (let x = 0; x <= SCREEN_WIDTH; x += 40) {
    gridLines.push(
      <Line key={`v-${x}`} x1={x} y1={0} x2={x} y2={SCREEN_HEIGHT} stroke={Colors.primary} strokeWidth={0.5} strokeOpacity={0.035} />
    );
  }
  for (let y = 0; y <= SCREEN_HEIGHT; y += 40) {
    gridLines.push(
      <Line key={`h-${y}`} x1={0} y1={y} x2={SCREEN_WIDTH} y2={y} stroke={Colors.primary} strokeWidth={0.5} strokeOpacity={0.035} />
    );
  }

  const cameraReady = permission?.granted;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {cameraReady ? (
        <ExpoCameraView style={StyleSheet.absoluteFillObject} facing="front" mirror active={active} />
      ) : (
        <View style={styles.cameraFallback} />
      )}

      <View style={styles.cameraScrim} />

      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
        {gridLines}
        <Rect
          x={SCREEN_WIDTH * 0.08}
          y={SCREEN_HEIGHT * 0.14}
          width={SCREEN_WIDTH * 0.84}
          height={SCREEN_HEIGHT * 0.52}
          rx={22}
          ry={22}
          stroke={Colors.primary}
          strokeWidth={1}
          strokeDasharray="8 8"
          strokeOpacity={0.24}
          fill="none"
        />
      </Svg>

      {!cameraReady && (
        <View style={styles.permissionOverlay}>
          <Text style={styles.permissionTitle}>
            {permission === null ? 'CAMERA INITIALIZING' : 'CAMERA ACCESS NEEDED'}
          </Text>
          <Text style={styles.permissionText}>
            {permission?.canAskAgain === false
              ? 'Enable camera access in system settings to use live tracking.'
              : 'Vitalis needs camera access for the live session preview.'}
          </Text>
        </View>
      )}

      {cameraReady && (
        <View style={styles.reticleLabel}>
          <Text style={styles.reticleText}>{active ? 'TRACKING ACTIVE' : 'TRACKING PAUSED'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  cameraScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 15, 31, 0.34)',
  },
  permissionOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: 'rgba(5, 20, 36, 0.72)',
  },
  permissionTitle: {
    ...Typography.labelCaps,
    color: Colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  permissionText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  reticleLabel: {
    position: 'absolute',
    top: '34%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  reticleText: {
    ...Typography.labelCaps,
    color: Colors.primary,
    opacity: 0.48,
    letterSpacing: 2,
  },
});
