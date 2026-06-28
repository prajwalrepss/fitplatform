import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisInput from '../components/VitalisInput';
import VitalisButton from '../components/VitalisButton';
import VitalisChip from '../components/VitalisChip';
import { Colors, Typography, Spacing } from '../theme';

const SUGGESTIONS = [
  'Optimize my chest split',
  'What is progressive overload?',
  'Explain muscle recovery',
];

export default function AiCoachScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Welcome back. I am your Vitalis AI Coach. Ask me anything about your training, recovery, or biomechanics.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);
  const typingDotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingDotAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingDotAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingDotAnim.setValue(0);
    }
  }, [isTyping, typingDotAnim]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I've analyzed your stats. To optimize your performance, focus on clean eccentric movement and ensure you have at least 48 hours of recovery between major muscle group sessions.";
      if (text.toLowerCase().includes('chest')) {
        replyText = "For an optimal chest split, combine Flat Bench Press (progressive overload), Incline Dumbbell Flyes (for upper chest fiber alignment), and Cable Crossovers (continuous tension).";
      } else if (text.toLowerCase().includes('overload')) {
        replyText = "Progressive overload is the gradual increase of stress placed upon the body during training. You can achieve this by increasing weight, volume, reps, or decreasing rest times.";
      } else if (text.toLowerCase().includes('recovery')) {
        replyText = "Muscle recovery relies on protein synthesis, parasympathetic nervous system activation, and deep sleep. Consider active recovery like mobility work or light stretching.";
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.avatarCircle}>
              <MaterialIcons name="smart-toy" size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>AI Coach</Text>
              <Text style={styles.subtitle}>Vitalis Intelligence</Text>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isUser ? styles.userWrapper : styles.aiWrapper,
                ]}
              >
                <VitalisCard
                  variant={isUser ? 'solid' : 'gradient'}
                  style={[
                    styles.messageCard,
                    isUser ? styles.userCard : styles.aiCard,
                  ]}
                >
                  <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                    {msg.text}
                  </Text>
                </VitalisCard>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.aiWrapper}>
              <VitalisCard variant="solid" style={[styles.messageCard, styles.typingCard]}>
                <Animated.View style={[styles.typingDot, { opacity: typingDotAnim }]} />
                <Animated.View
                  style={[
                    styles.typingDot,
                    {
                      opacity: typingDotAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 1, 0.3],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.typingDot,
                    {
                      opacity: typingDotAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                      }),
                    },
                  ]}
                />
              </VitalisCard>
            </View>
          )}
        </ScrollView>

        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionRow}
          >
            {SUGGESTIONS.map((s) => (
              <VitalisChip key={s} label={s} onPress={() => handleSend(s)} />
            ))}
          </ScrollView>
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={{ flex: 1 }}>
            <VitalisInput
              placeholder="Ask anything..."
              value={input}
              onChangeText={setInput}
              variant="flat"
            />
          </View>
          <VitalisButton
            icon="send"
            onPress={() => handleSend()}
            variant="primary"
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(128, 131, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.2)',
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  messageWrapper: {
    maxWidth: '85%',
    gap: 4,
  },
  userWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.radiusLg,
  },
  userCard: {
    backgroundColor: Colors.surfaceContainer,
    borderBottomRightRadius: 4,
    borderColor: 'rgba(192, 193, 255, 0.1)',
  },
  aiCard: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...Typography.bodyMd,
    lineHeight: 22,
  },
  userText: {
    color: Colors.onSurface,
  },
  aiText: {
    color: Colors.onSurface,
  },
  messageTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
  },
  typingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceContainer,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  suggestionRow: {
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  sendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
