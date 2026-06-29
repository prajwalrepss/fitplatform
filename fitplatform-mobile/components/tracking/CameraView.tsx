import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraViewProps {
  status: 'initializing' | 'active' | 'error';
  errorMessage?: string | null;
}

export default function CameraView({ status, errorMessage }: CameraViewProps) {
  const gridSpacing = 40;
  const lines = [];

  // Generate a scanning grid
  for (let x = 0; x <= SCREEN_WIDTH; x += gridSpacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        x1={x} y1={0}
        x2={x} y2={SCREEN_HEIGHT}
        stroke={colors.primary}
        strokeWidth={0.5}
        strokeOpacity={0.03}
      />
    );
  }
  for (let y = 0; y <= SCREEN_HEIGHT; y += gridSpacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        x1={0} y1={y}
        x2={SCREEN_WIDTH} y2={y}
        stroke={colors.primary}
        strokeWidth={0.5}
        strokeOpacity={0.03}
      />
    );
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Dark background representation of camera view */}
      <View style={styles.cameraDark} />

      {/* Grid overlay */}
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
        {lines}
        {/* Scanning reticle box */}
        <Rect
          x={SCREEN_WIDTH * 0.1}
          y={SCREEN_HEIGHT * 0.15}
          width={SCREEN_WIDTH * 0.8}
          height={SCREEN_HEIGHT * 0.45}
          rx={radius.xxl}
          ry={radius.xxl}
          stroke={colors.primary}
          strokeWidth={1}
          strokeDasharray="8 8"
          strokeOpacity={0.25}
          fill="none"
        />
      </Svg>

      {/* Status Overlay */}
      {status === 'initializing' && (
        <View style={styles.centerOverlay}>
          <Text style={styles.statusText}>CAMERA INITIALIZING...</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.centerOverlay}>
          <Text style={styles.errorText}>CAMERA ACCESS DENIED</Text>
          <Text style={styles.errorSubText}>{errorMessage || 'Check permissions in settings.'}</Text>
        </View>
      )}

      {status === 'active' && (
        <View style={styles.reticleLabelContainer}>
          <Text style={styles.reticleLabel}>POSITION BODY IN FRAME</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraDark: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 20, 36, 0.85)',
    paddingHorizontal: spacing.xxl,
  },
  statusText: {
    ...typography.labelLG,
    color: colors.primary,
    letterSpacing: 2.5,
  },
  errorText: {
    ...typography.headlineSM,
    color: colors.destructive,
    marginBottom: spacing.xs,
  },
  errorSubText: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  reticleLabelContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  reticleLabel: {
    ...typography.labelMD,
    color: colors.primary,
    opacity: 0.35,
    letterSpacing: 2.0,
  },
});
