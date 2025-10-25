
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  Pressable,
  TextInput,
  Switch
} from "react-native";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn } from 'react-native-reanimated';
import DecorativeStar from "@/components/DecorativeStar";
import { LinearGradient } from 'expo-linear-gradient';

interface WateringSchedule {
  plantType: string;
  soilMoisture: string;
  lastWatered: Date | null;
  nextWatering: Date | null;
}

export default function WateringScreen() {
  const [plantType, setPlantType] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('medium');
  const [wateredToday, setWateredToday] = useState(false);
  const [schedule, setSchedule] = useState<WateringSchedule | null>(null);

  const calculateWateringSchedule = () => {
    const now = new Date();
    let daysUntilNext = 3;

    if (soilMoisture === 'dry') {
      daysUntilNext = 1;
    } else if (soilMoisture === 'medium') {
      daysUntilNext = 3;
    } else if (soilMoisture === 'wet') {
      daysUntilNext = 7;
    }

    const nextWatering = new Date(now);
    nextWatering.setDate(now.getDate() + daysUntilNext);

    setSchedule({
      plantType,
      soilMoisture,
      lastWatered: wateredToday ? now : null,
      nextWatering,
    });
  };

  const getWateringRecommendation = () => {
    if (soilMoisture === 'dry') {
      return 'Your plant needs water soon! Water deeply until it drains from the bottom.';
    } else if (soilMoisture === 'medium') {
      return 'Soil moisture is good. Water when the top inch feels dry.';
    } else {
      return 'Soil is moist. Wait before watering to avoid root rot.';
    }
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Watering Assistant",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with decorations */}
          <View style={styles.header}>
            <View style={styles.headerDecoration}>
              <DecorativeStar size={16} color={colors.primary} delay={0} />
              <IconSymbol name="leaf.fill" size={20} color={colors.secondary + '60'} />
            </View>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={[colors.primary + '30', colors.primary + '10']}
                style={styles.headerIconGradient}
              >
                <IconSymbol name="drop.fill" size={48} color={colors.primary} />
              </LinearGradient>
              <View style={styles.headerLeaf1}>
                <IconSymbol name="leaf.fill" size={24} color={colors.secondary + '60'} />
              </View>
              <View style={styles.headerLeaf2}>
                <IconSymbol name="leaf.fill" size={20} color={colors.highlight + '60'} />
              </View>
            </View>
            <Text style={styles.title}>Smart Watering Assistant</Text>
            <Text style={styles.subtitle}>Optimize your plant watering schedule</Text>
            <View style={styles.headerDecorationBottom}>
              <IconSymbol name="leaf.fill" size={18} color={colors.primary + '60'} />
              <DecorativeStar size={14} color={colors.highlight} delay={500} />
            </View>
          </View>

          {/* Input Section */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.inputSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Plant Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plant Type</Text>
              <View style={styles.inputWrapper}>
                <IconSymbol name="leaf.fill" size={16} color={colors.secondary} />
                <TextInput
                  style={styles.input}
                  value={plantType}
                  onChangeText={setPlantType}
                  placeholder="e.g., Tomato, Rose, Basil"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soil Moisture Level</Text>
              <View style={styles.moistureOptions}>
                {['dry', 'medium', 'wet'].map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.moistureButton,
                      soilMoisture === level && styles.moistureButtonActive
                    ]}
                    onPress={() => setSoilMoisture(level)}
                  >
                    <IconSymbol 
                      name={level === 'dry' ? 'sun.max.fill' : level === 'medium' ? 'cloud.fill' : 'cloud.rain.fill'} 
                      size={24} 
                      color={soilMoisture === level ? '#FFFFFF' : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.moistureButtonText,
                      soilMoisture === level && styles.moistureButtonTextActive
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                  <Text style={styles.label}>Did you water today?</Text>
                </View>
                <Switch
                  value={wateredToday}
                  onValueChange={setWateredToday}
                  trackColor={{ false: colors.textSecondary, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <Pressable 
              style={styles.calculateButton}
              onPress={calculateWateringSchedule}
            >
              <IconSymbol name="calendar" size={20} color="#FFFFFF" />
              <Text style={styles.calculateButtonText}>Calculate Schedule</Text>
            </Pressable>
          </Animated.View>

          {/* Schedule Result */}
          {schedule && (
            <Animated.View entering={FadeIn.delay(200)} style={styles.resultSection}>
              <LinearGradient
                colors={[colors.primary + '15', colors.card]}
                style={styles.resultGradient}
              >
                <View style={styles.resultHeader}>
                  <IconSymbol name="calendar.badge.clock" size={32} color={colors.primary} />
                  <Text style={styles.resultTitle}>Your Watering Schedule</Text>
                </View>

                <View style={styles.resultCard}>
                  <View style={styles.resultRow}>
                    <View style={styles.resultIcon}>
                      <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Plant Type</Text>
                      <Text style={styles.resultValue}>{schedule.plantType || 'Not specified'}</Text>
                    </View>
                  </View>

                  <View style={styles.resultDivider} />

                  <View style={styles.resultRow}>
                    <View style={styles.resultIcon}>
                      <IconSymbol name="drop.fill" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Soil Moisture</Text>
                      <Text style={styles.resultValue}>{schedule.soilMoisture.charAt(0).toUpperCase() + schedule.soilMoisture.slice(1)}</Text>
                    </View>
                  </View>

                  <View style={styles.resultDivider} />

                  <View style={styles.resultRow}>
                    <View style={styles.resultIcon}>
                      <IconSymbol name="calendar" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>Next Watering</Text>
                      <Text style={styles.resultValue}>
                        {schedule.nextWatering?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.recommendationBox}>
                  <View style={styles.recommendationHeader}>
                    <IconSymbol name="lightbulb.fill" size={20} color={colors.accent} />
                    <Text style={styles.recommendationTitle}>Recommendation</Text>
                  </View>
                  <Text style={styles.recommendationText}>{getWateringRecommendation()}</Text>
                </View>

                {/* Decorative leaves */}
                <View style={styles.resultDecoration}>
                  <IconSymbol name="leaf.fill" size={16} color={colors.primary + '30'} />
                  <IconSymbol name="leaf.fill" size={20} color={colors.secondary + '30'} />
                  <IconSymbol name="leaf.fill" size={16} color={colors.highlight + '30'} />
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Tips Section */}
          <Animated.View entering={FadeIn.delay(300)} style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="sparkles" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Watering Tips</Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <IconSymbol name="sun.max.fill" size={24} color={colors.accent} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Best Time to Water</Text>
                <Text style={styles.tipText}>Water in the early morning to reduce evaporation and prevent fungal diseases.</Text>
              </View>
              <View style={styles.tipLeaf}>
                <IconSymbol name="leaf.fill" size={18} color={colors.secondary + '40'} />
              </View>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <IconSymbol name="drop.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Deep Watering</Text>
                <Text style={styles.tipText}>Water deeply but less frequently to encourage strong root growth.</Text>
              </View>
              <View style={styles.tipLeaf}>
                <IconSymbol name="leaf.fill" size={18} color={colors.primary + '40'} />
              </View>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <IconSymbol name="hand.raised.fill" size={24} color={colors.highlight} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Check Soil Moisture</Text>
                <Text style={styles.tipText}>Stick your finger 1-2 inches into the soil. If it feels dry, it&apos;s time to water.</Text>
              </View>
              <View style={styles.tipLeaf}>
                <IconSymbol name="leaf.fill" size={18} color={colors.highlight + '40'} />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  headerDecoration: {
    position: 'absolute',
    top: -10,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerDecorationBottom: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerIconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  headerIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeaf1: {
    position: 'absolute',
    top: -8,
    right: -8,
    transform: [{ rotate: '45deg' }],
  },
  headerLeaf2: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.secondary + '40',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  moistureOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  moistureButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.secondary + '40',
    gap: 8,
  },
  moistureButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moistureButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  moistureButtonTextActive: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  resultGradient: {
    padding: 20,
    position: 'relative',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  resultDivider: {
    height: 1,
    backgroundColor: colors.secondary + '30',
    marginVertical: 12,
  },
  recommendationBox: {
    backgroundColor: colors.accent + '15',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  resultDecoration: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    position: 'relative',
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tipLeaf: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});
