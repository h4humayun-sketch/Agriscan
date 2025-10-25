
import React, { useState } from "react";
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
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn } from 'react-native-reanimated';

interface WateringSchedule {
  plantType: string;
  soilMoisture: string;
  lastWatered: Date | null;
  nextWatering: Date | null;
}

export default function WateringScreen() {
  const [plantType, setPlantType] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const [wateredToday, setWateredToday] = useState(false);
  const [schedule, setSchedule] = useState<WateringSchedule | null>(null);

  const calculateWateringSchedule = () => {
    const now = new Date();
    const nextWatering = new Date(now);
    
    // Simple logic based on soil moisture
    let daysUntilNextWatering = 2; // Default
    
    if (soilMoisture.toLowerCase().includes('dry')) {
      daysUntilNextWatering = 1;
    } else if (soilMoisture.toLowerCase().includes('moist')) {
      daysUntilNextWatering = 3;
    } else if (soilMoisture.toLowerCase().includes('wet')) {
      daysUntilNextWatering = 5;
    }
    
    nextWatering.setDate(now.getDate() + daysUntilNextWatering);
    
    setSchedule({
      plantType,
      soilMoisture,
      lastWatered: wateredToday ? now : null,
      nextWatering,
    });
  };

  const getWateringRecommendation = () => {
    if (!soilMoisture) return "Enter soil moisture level to get recommendations";
    
    if (soilMoisture.toLowerCase().includes('dry')) {
      return "Your plant needs water soon! Water thoroughly until water drains from the bottom.";
    } else if (soilMoisture.toLowerCase().includes('moist')) {
      return "Soil moisture is good. Check again in 2-3 days.";
    } else if (soilMoisture.toLowerCase().includes('wet')) {
      return "Soil is too wet. Wait before watering again to prevent root rot.";
    }
    
    return "Monitor your plant regularly and adjust watering based on weather conditions.";
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Smart Watering",
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
          {/* Header */}
          <View style={styles.header}>
            <IconSymbol name="drop.fill" size={48} color={colors.primary} />
            <Text style={styles.title}>Smart Watering Assistant</Text>
            <Text style={styles.subtitle}>Optimize your plant watering schedule</Text>
          </View>

          {/* Input Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plant Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Tomato, Rose, Cactus"
                placeholderTextColor={colors.textSecondary}
                value={plantType}
                onChangeText={setPlantType}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soil Moisture Level</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Dry, Moist, Wet"
                placeholderTextColor={colors.textSecondary}
                value={soilMoisture}
                onChangeText={setSoilMoisture}
              />
              <Text style={styles.helperText}>
                Touch the soil 2 inches deep to check moisture
              </Text>
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <IconSymbol name="checkmark.circle.fill" size={24} color={wateredToday ? colors.primary : colors.textSecondary} />
                <Text style={styles.label}>Did you water today?</Text>
              </View>
              <Switch
                value={wateredToday}
                onValueChange={setWateredToday}
                trackColor={{ false: colors.textSecondary, true: colors.secondary }}
                thumbColor={wateredToday ? colors.primary : '#f4f3f4'}
              />
            </View>

            <Pressable 
              style={[styles.calculateButton, (!plantType || !soilMoisture) && styles.buttonDisabled]}
              onPress={calculateWateringSchedule}
              disabled={!plantType || !soilMoisture}
            >
              <IconSymbol name="calendar" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Calculate Schedule</Text>
            </Pressable>
          </View>

          {/* Schedule Result */}
          {schedule && (
            <Animated.View entering={FadeIn} style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <IconSymbol name="calendar.badge.clock" size={32} color={colors.primary} />
                <Text style={styles.resultTitle}>Your Watering Schedule</Text>
              </View>

              <View style={styles.scheduleCard}>
                <View style={styles.scheduleItem}>
                  <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleLabel}>Plant Type</Text>
                    <Text style={styles.scheduleValue}>{schedule.plantType}</Text>
                  </View>
                </View>

                <View style={styles.scheduleItem}>
                  <IconSymbol name="drop.fill" size={20} color={colors.primary} />
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleLabel}>Soil Condition</Text>
                    <Text style={styles.scheduleValue}>{schedule.soilMoisture}</Text>
                  </View>
                </View>

                {schedule.lastWatered && (
                  <View style={styles.scheduleItem}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                    <View style={styles.scheduleInfo}>
                      <Text style={styles.scheduleLabel}>Last Watered</Text>
                      <Text style={styles.scheduleValue}>
                        {schedule.lastWatered.toLocaleDateString()} at {schedule.lastWatered.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.scheduleItem}>
                  <IconSymbol name="calendar" size={20} color={colors.accent} />
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleLabel}>Next Watering</Text>
                    <Text style={[styles.scheduleValue, styles.nextWateringValue]}>
                      {schedule.nextWatering?.toLocaleDateString()} at 8:00 AM
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>💡 Recommendation</Text>
                <Text style={styles.recommendationText}>{getWateringRecommendation()}</Text>
              </View>
            </Animated.View>
          )}

          {/* Watering Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Watering Tips</Text>
            
            <View style={styles.tipCard}>
              <IconSymbol name="sun.max.fill" size={24} color={colors.accent} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Best Time to Water</Text>
                <Text style={styles.tipText}>
                  Water early morning (6-10 AM) or evening (4-7 PM) to minimize evaporation
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="thermometer.sun.fill" size={24} color={colors.accent} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Weather Matters</Text>
                <Text style={styles.tipText}>
                  Reduce watering during rainy or humid days, increase during hot weather
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="drop.triangle.fill" size={24} color={colors.accent} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Deep Watering</Text>
                <Text style={styles.tipText}>
                  Water deeply but less frequently to encourage strong root growth
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.accent} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Avoid Overwatering</Text>
                <Text style={styles.tipText}>
                  Overwatering is the #1 cause of plant death. When in doubt, wait a day
                </Text>
              </View>
            </View>
          </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nextWateringValue: {
    color: colors.accent,
  },
  recommendationCard: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
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
});
