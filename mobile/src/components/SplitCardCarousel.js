import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import SplitCard, { CARD_WIDTH, CARD_HEIGHT } from './SplitCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 16;
const SNAP_OFFSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

/**
 * SplitCardCarousel — Snapping horizontal swipeable pass selector.
 * Preeks previous and next cards from the sides with animated scale and opacity.
 *
 * Props:
 *   splits        - array of split data objects
 *   activeSplitId - string (currently selected split id)
 *   onSplitChange - fn(split) (called when swipe settles on a new card)
 *   onSelectSplit - fn(split) (called when SELECT button inside the card is pressed)
 */
export default function SplitCardCarousel({
  splits,
  activeSplitId,
  onSplitChange,
  onSelectSplit,
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync scroll position if activeSplitId changes externally
  useEffect(() => {
    if (!splits || splits.length === 0) return;
    const targetIdx = splits.findIndex(s => s.id === activeSplitId);
    if (targetIdx !== -1 && targetIdx !== activeIndex) {
      setActiveIndex(targetIdx);
      scrollViewRef.current?.scrollTo({
        x: targetIdx * (CARD_WIDTH + CARD_GAP),
        animated: true
      });
    }
  }, [activeSplitId, splits]);

  const handleScroll = useCallback((event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    const clampedIndex = Math.max(0, Math.min(index, splits.length - 1));
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
      if (onSplitChange && splits[clampedIndex]) {
        onSplitChange(splits[clampedIndex]);
      }
    }
  }, [splits, activeIndex, onSplitChange]);

  if (!splits || splits.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="center"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: SNAP_OFFSET },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {splits.map((split, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_GAP),
            index * (CARD_WIDTH + CARD_GAP),
            (index + 1) * (CARD_WIDTH + CARD_GAP),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={split.id}
              style={[
                styles.cardWrapper,
                {
                  transform: [{ scale }],
                  opacity,
                },
                index < splits.length - 1 && { marginRight: CARD_GAP },
              ]}
            >
              <SplitCard
                split={split}
                isActive={activeIndex === index}
                onSelect={() => onSelectSplit && onSelectSplit(split)}
              />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {splits.map((split, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_GAP),
            index * (CARD_WIDTH + CARD_GAP),
            (index + 1) * (CARD_WIDTH + CARD_GAP),
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 24, 6],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.2, 1, 0.2],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={split.id}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardWrapper: {
    height: CARD_HEIGHT + 24,
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6D5DF6',
  },
});
