import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../../constants/theme';
import { mockMessages } from '../../../data/exercises';

interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      style={[
        styles.bubble,
        message.sent ? styles.sentBubble : styles.receivedBubble,
      ]}
    >
      <Text style={[styles.bubbleText, message.sent ? styles.sentText : styles.receivedText]}>
        {message.text}
      </Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{message.time}</Text>
        {message.sent && (
          <Ionicons name="checkmark-done" size={14} color={colors.onSurfaceVariant} style={{ marginLeft: 4 }} />
        )}
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: String(messages.length + 1),
      text: message.trim(),
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
            </Pressable>
            <View style={styles.headerCenter}>
              <View style={styles.headerAvatar}>
                <Ionicons name="person" size={18} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.headerName}>Ayesha</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>ONLINE</Text>
                </View>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Pressable style={styles.headerIconBtn}>
                <Ionicons name="videocam-outline" size={22} color={colors.onSurfaceVariant} />
              </Pressable>
              <Pressable style={styles.headerIconBtn}>
                <Ionicons name="information-circle-outline" size={22} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={[
            styles.messagesList,
            { paddingTop: insets.top + 80, paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.timestampChip}>
              <Text style={styles.timestampText}>TODAY</Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={[styles.inputWrap, { paddingBottom: insets.bottom || spacing.lg }]}>
          <BlurView intensity={80} tint="dark" style={styles.inputBlur}>
            <View style={styles.inputRow}>
              <Pressable style={styles.inputIcon}>
                <Ionicons name="add-circle-outline" size={24} color={colors.onSurfaceVariant} />
              </Pressable>
              <View style={styles.inputFieldWrap}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Message Ayesha..."
                  placeholderTextColor={colors.onSurfaceVariant + '80'}
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={sendMessage}
                />
                <Pressable style={styles.emojiBtn}>
                  <Ionicons name="happy-outline" size={20} color={colors.onSurfaceVariant} />
                </Pressable>
              </View>
              <Pressable onPress={sendMessage} style={styles.sendBtn}>
                <Ionicons name="send" size={18} color={colors.onPrimary} />
              </Pressable>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  headerBlur: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(14,14,14,0.8)',
    gap: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    ...typography.headlineSM,
    color: colors.onSurface,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  onlineText: {
    ...typography.labelSM,
    color: colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  timestampChip: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  timestampText: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginVertical: spacing.xs,
  },
  sentBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.surfaceContainerHigh,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  bubbleText: {
    ...typography.bodyMD,
    lineHeight: 20,
  },
  sentText: {
    color: colors.onPrimary,
  },
  receivedText: {
    color: colors.onSurface,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    opacity: 0.7,
  },
  inputWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  inputBlur: {
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(14,14,14,0.9)',
    gap: spacing.sm,
  },
  inputIcon: {
    padding: spacing.xs,
  },
  inputFieldWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
  },
  inputField: {
    flex: 1,
    ...typography.bodyMD,
    color: colors.onSurface,
    paddingVertical: spacing.md,
  },
  emojiBtn: {
    padding: spacing.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
