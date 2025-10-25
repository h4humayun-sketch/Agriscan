
import React, { useState, useRef, useEffect } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import DecorativeStar from "@/components/DecorativeStar";
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI plant care assistant. Ask me anything about plant care, diseases, watering schedules, or gardening tips!",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock AI responses based on keywords
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('water') || lowerMessage.includes('watering')) {
      return "💧 Watering tips:\n\n- Most plants need water when the top inch of soil feels dry\n- Water deeply but less frequently to encourage deep root growth\n- Morning is the best time to water plants\n- Avoid getting water on leaves to prevent fungal diseases\n- Use room temperature water when possible";
    }
    
    if (lowerMessage.includes('yellow') || lowerMessage.includes('yellowing')) {
      return "🍃 Yellow leaves can indicate:\n\n- Overwatering (most common cause)\n- Nitrogen deficiency\n- Natural aging of lower leaves\n- Poor drainage\n- Root problems\n\nCheck soil moisture and adjust watering schedule. Consider adding nitrogen-rich fertilizer if needed.";
    }
    
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('fertilize')) {
      return "🌱 Fertilizing guidelines:\n\n- Use organic compost for slow-release nutrients\n- Apply liquid fertilizer every 2-4 weeks during growing season\n- Reduce fertilizing in winter months\n- Follow package instructions carefully\n- Fish emulsion and seaweed extracts are excellent organic options";
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('bug') || lowerMessage.includes('insect')) {
      return "🐛 Natural pest control:\n\n- Neem oil spray is effective against many pests\n- Introduce beneficial insects like ladybugs\n- Use insecticidal soap for soft-bodied insects\n- Remove affected leaves promptly\n- Maintain plant health to prevent infestations\n- Try companion planting to repel pests naturally";
    }
    
    if (lowerMessage.includes('sunlight') || lowerMessage.includes('light') || lowerMessage.includes('sun')) {
      return "☀️ Light requirements:\n\n- Full sun: 6+ hours of direct sunlight\n- Partial sun: 3-6 hours of direct sunlight\n- Partial shade: 2-4 hours of dappled sunlight\n- Full shade: Less than 2 hours of direct sunlight\n\nRotate plants regularly for even growth. Watch for signs of too much light (scorched leaves) or too little (leggy growth).";
    }
    
    if (lowerMessage.includes('soil') || lowerMessage.includes('potting')) {
      return "🌍 Soil tips:\n\n- Use well-draining potting mix for containers\n- Add perlite or sand to improve drainage\n- Organic matter improves soil structure\n- Check pH levels for specific plants\n- Refresh potting soil annually\n- Add compost to enrich garden soil naturally";
    }
    
    if (lowerMessage.includes('prune') || lowerMessage.includes('pruning') || lowerMessage.includes('trim')) {
      return "✂️ Pruning basics:\n\n- Remove dead, diseased, or damaged growth first\n- Prune in early spring before new growth\n- Use clean, sharp tools to prevent disease\n- Cut at 45-degree angle above a node\n- Don't remove more than 1/3 of plant at once\n- Pinch back herbs to encourage bushier growth";
    }
    
    if (lowerMessage.includes('disease') || lowerMessage.includes('sick') || lowerMessage.includes('problem')) {
      return "🔍 Common plant diseases:\n\n- Powdery mildew: White powder on leaves\n- Root rot: Caused by overwatering\n- Leaf spot: Fungal or bacterial infections\n- Blight: Rapid browning and wilting\n\nPrevent diseases with:\n- Good air circulation\n- Proper watering practices\n- Clean tools and pots\n- Quarantine new plants\n- Remove infected parts promptly";
    }
    
    if (lowerMessage.includes('tomato')) {
      return "🍅 Tomato care:\n\n- Need 6-8 hours of full sun daily\n- Water deeply and consistently\n- Stake or cage for support\n- Pinch off suckers for larger fruits\n- Watch for early blight and hornworms\n- Harvest when fully colored but still firm";
    }
    
    if (lowerMessage.includes('herb') || lowerMessage.includes('basil') || lowerMessage.includes('mint')) {
      return "🌿 Herb garden tips:\n\n- Most herbs love full sun\n- Harvest regularly to encourage growth\n- Pinch off flower buds for better leaf production\n- Basil: Keep warm, water regularly\n- Mint: Grows aggressively, use containers\n- Rosemary: Needs good drainage, less water\n- Parsley: Tolerates partial shade";
    }
    
    if (lowerMessage.includes('indoor') || lowerMessage.includes('houseplant')) {
      return "🏠 Indoor plant care:\n\n- Choose plants suited to your light levels\n- Avoid overwatering (top cause of death)\n- Increase humidity with pebble trays or misting\n- Dust leaves regularly for better photosynthesis\n- Rotate plants for even growth\n- Watch for pests in indoor environments\n- Repot when roots fill the container";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! I'm here to help your plants thrive. Feel free to ask me anything else about plant care! 🌱";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 How can I help you with your plants today? Ask me about watering, diseases, pests, fertilizing, or any other plant care questions!";
    }
    
    // Default response
    return "I'd be happy to help with that! I can provide advice on:\n\n🌱 Plant diseases and treatments\n💧 Watering schedules\n☀️ Light requirements\n🌍 Soil and fertilizing\n🐛 Pest control\n✂️ Pruning techniques\n🏠 Indoor plant care\n\nWhat would you like to know more about?";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <DecorativeStar size={20} color={colors.primary} delay={0} />
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Plant Care Assistant",
            headerRight: renderHeaderRight,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header with decorative elements */}
        {Platform.OS !== 'ios' && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <IconSymbol name="message.fill" size={28} color={colors.primary} />
                <View style={styles.leafDecoration1}>
                  <IconSymbol name="leaf.fill" size={16} color={colors.secondary} />
                </View>
                <View style={styles.leafDecoration2}>
                  <IconSymbol name="leaf.fill" size={12} color={colors.highlight} />
                </View>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Plant Care Assistant</Text>
                <Text style={styles.headerSubtitle}>Ask me anything about your plants</Text>
              </View>
            </View>
            <View style={styles.headerStars}>
              <DecorativeStar size={16} color={colors.primary} delay={0} />
              <DecorativeStar size={14} color={colors.highlight} delay={500} />
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            Platform.OS !== 'ios' && styles.messagesContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative top section */}
          <View style={styles.chatTopDecoration}>
            <LinearGradient
              colors={[colors.primary + '20', colors.background]}
              style={styles.topGradient}
            >
              <View style={styles.plantIconsRow}>
                <IconSymbol name="leaf.fill" size={24} color={colors.primary + '40'} />
                <IconSymbol name="leaf.fill" size={20} color={colors.secondary + '40'} />
                <IconSymbol name="leaf.fill" size={28} color={colors.highlight + '40'} />
                <IconSymbol name="leaf.fill" size={22} color={colors.primary + '40'} />
              </View>
            </LinearGradient>
          </View>

          {messages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInDown.delay(index * 50)}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper
              ]}
            >
              {!message.isUser && (
                <View style={styles.aiAvatar}>
                  <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.aiText
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.timestamp,
                  message.isUser ? styles.userTimestamp : styles.aiTimestamp
                ]}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {message.isUser && (
                <View style={styles.userAvatar}>
                  <IconSymbol name="person.fill" size={20} color="#FFFFFF" />
                </View>
              )}
            </Animated.View>
          ))}

          {isTyping && (
            <Animated.View entering={FadeIn} style={styles.typingIndicator}>
              <View style={styles.aiAvatar}>
                <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </Animated.View>
          )}

          {/* Decorative bottom section */}
          <View style={styles.chatBottomDecoration}>
            <View style={styles.plantIconsRow}>
              <IconSymbol name="leaf.fill" size={20} color={colors.secondary + '30'} />
              <IconSymbol name="leaf.fill" size={24} color={colors.primary + '30'} />
              <IconSymbol name="leaf.fill" size={18} color={colors.highlight + '30'} />
            </View>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputDecorationLeft}>
              <IconSymbol name="leaf.fill" size={16} color={colors.secondary} />
            </View>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your plants..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <Pressable 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <IconSymbol 
                name="arrow.up.circle.fill" 
                size={36} 
                color={inputText.trim() ? colors.primary : colors.textSecondary} 
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary + '30',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: 24,
  },
  leafDecoration1: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  leafDecoration2: {
    position: 'absolute',
    bottom: -2,
    left: -2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerStars: {
    position: 'absolute',
    top: 16,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    paddingRight: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messagesContentWithTabBar: {
    paddingBottom: 100,
  },
  chatTopDecoration: {
    marginBottom: 16,
  },
  topGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  plantIconsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  chatBottomDecoration: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.textSecondary,
    textAlign: 'left',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.8,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.secondary + '30',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  inputDecorationLeft: {
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    marginBottom: -4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
