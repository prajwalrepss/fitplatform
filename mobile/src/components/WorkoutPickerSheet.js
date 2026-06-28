import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_BG = '#111B2E';
const BORDER = 'rgba(255,255,255,0.06)';
const PRIMARY = '#6C63FF';
const TEXT_WHITE = '#FFFFFF';
const TEXT_SEC = '#B8C0D9';

export default function WorkoutPickerSheet({
  visible,
  onClose,
  weeklySchedule = [],
  currentWorkoutTarget,
  onSelectWorkout,
}) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Extract and deduplicate workout targets
  const uniqueWorkouts = React.useMemo(() => {
    const targets = new Set();
    const result = [];
    
    // Always ensure Rest is available as a selection option
    targets.add('rest');
    result.push('Rest');

    weeklySchedule.forEach((item) => {
      if (item && item.target) {
        const targetClean = item.target.trim();
        const targetLower = targetClean.toLowerCase();
        if (targetLower && !targets.has(targetLower)) {
          targets.add(targetLower);
          result.push(targetClean);
        }
      }
    });

    return result;
  }, [weeklySchedule]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop Tap to Close */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </Pressable>

        {/* Sliding Panel */}
        <Animated.View
          style={[
            styles.sheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Handlebar */}
          <View style={styles.handleBar} />

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Change Workout Session</Text>
            <Text style={styles.headerSubtitle}>
              Select a session to override today's plan without mutating your schedule.
            </Text>
          </View>

          {/* List of Workout Options */}
          <ScrollView
            style={styles.optionsList}
            contentContainerStyle={styles.optionsListContent}
            showsVerticalScrollIndicator={false}
          >
            {uniqueWorkouts.map((targetName) => {
              const isSelected =
                currentWorkoutTarget?.toLowerCase() === targetName.toLowerCase();
              const isRest = targetName.toLowerCase() === 'rest';

              return (
                <Pressable
                  key={targetName}
                  style={[
                    styles.optionItem,
                    isSelected && styles.optionItemActive,
                  ]}
                  onPress={() => {
                    onSelectWorkout(targetName);
                    onClose();
                  }}
                >
                  <View style={styles.optionLeft}>
                    <MaterialIcons
                      name={isRest ? 'bedtime' : 'fitness-center'}
                      size={20}
                      color={isSelected ? PRIMARY : TEXT_SEC}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {targetName}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color={PRIMARY} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Cancel button */}
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>CANCEL</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  sheetContainer: {
    backgroundColor: '#081220',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: BORDER,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    maxHeight: SCREEN_HEIGHT * 0.65,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 20,
    color: TEXT_WHITE,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: TEXT_SEC,
    lineHeight: 18,
    opacity: 0.8,
  },
  optionsList: {
    marginBottom: 16,
  },
  optionsListContent: {
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionItemActive: {
    borderColor: 'rgba(108, 99, 255, 0.3)',
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionText: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 15,
    color: TEXT_SEC,
  },
  optionTextActive: {
    color: TEXT_WHITE,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 13,
    letterSpacing: 2,
    color: TEXT_WHITE,
  },
});
