import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';

interface PromptBlockProps {
  question: string;
  answer: string;
}

export default function PromptBlock({ question, answer }: PromptBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  question: {
    ...typography.labelMD,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  answer: {
    ...typography.bodyLG,
    color: colors.onSurface,
  },
});
