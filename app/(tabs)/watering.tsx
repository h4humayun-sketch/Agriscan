
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
import React, { useState } from "react";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn } from 'react-native-reanimated';
import DecorativeStar from "@/components/DecorativeStar";

interface WateringSchedule {
  plantType: string;
  soilMoisture: string;
  lastWatered: Date | null;
  nextWatering: Date | null;
}

export default function WateringScreen() {
  const [plantType, setPlantType] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [wateredToday, setWateredToday] = useState(false);
  const [schedule, setSchedule] = useState<WateringSchedule | null>(null);

  const calculateWateringSchedule = () => {
    const now = new Date();
    const nextWatering = new Date(now);
    
    // Simple logic based on plant type and soil moisture
    let daysUntilNext = 3; // default
    
    if (soilMoisture.toLowerCase().includes('dry')) {
      daysUntilNext = 1;
    } else if (soilMoisture.toLowerCase().includes('moist')) {
      daysUntilNext = 2;
    } else if (soilMoisture.toLowerCase().includes('wet')) {
      daysUntilNext = 4;
    }
    
    nextWatering.setDate(now.getDate() + daysUntilNext);
    
    setSchedule({
      plantType,
      soilMoisture,
      lastWatered: wateredToday ? now : null,
      nextWatering,
    });
  };

  const getWateringRecommendation = () => {
    if (!schedule) return null;
    
    const moisture = schedule.soilMoisture.toLowerCase();
    
    if (moisture.includes('dry')) {
      return {
        icon: 'drop.fill',
        color: colors.accent,
        title: 'Water Soon',
        message: 'Your plant needs watering. The soil is dry.',
      };
    } else if (moisture.includes('moist')) {
      return {
        icon: 'checkmark.circle.fill',
        color: colors.primary,
        title: 'Good Moisture',
        message: 'Soil moisture is optimal. Water in 2-3 days.',
      };
    } else if (moisture.includes('wet')) {
      return {
        icon: 'exclamationmark.triangle.fill',
        color: colors.highlight,
        title: 'Too Wet',
        message: 'Soil is too wet. Wait before watering again.',
      };
    }
    
    return null;
  };

  const recommendation = getWateringRecommendation();

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Watering & Care",
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
          {/* Header with Decorative Stars */}
          <View style={styles.header}>
            <View style={styles.decorativeStarsTop}>
              <View style={styles.starTopLeft}>
                <DecorativeStar size={18} color={colors.primary} delay={0} />
              </View>
              <View style={styles.starTopRight}>
                <DecorativeStar size={14} color="#87CEEB" delay={500} />
              </View>
            </View>
            <IconSymbol name="drop.fill" size={48} color={colors.primary} />
            <Text style={styles.title}>Smart Watering Assistant</Text>
            <Text style={styles.subtitle}>Get personalized watering recommendations</Text>
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
              <Text style={styles.label}>Soil Moisture</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Dry, Moist, Wet"
                placeholderTextColor={colors.textSecondary}
                value={soilMoisture}
                onChangeText={setSoilMoisture}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Did you water today?</Text>
              <Switch
                value={wateredToday}
                onValueChange={setWateredToday}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor={wateredToday ? colors.card : '#f4f3f4'}
              />
            </View>

            <Pressable 
              style={styles.calculateButton}
              onPress={calculateWateringSchedule}
            >
              <IconSymbol name="calendar" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Calculate Schedule</Text>
            </Pressable>
          </View>

          {/* Recommendation Result */}
          {schedule && recommendation && (
            <Animated.View entering={FadeIn} style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <IconSymbol name={recommendation.icon} size={40} color={recommendation.color} />
                <View style={styles.resultHeaderText}>
                  <Text style={styles.resultTitle}>{recommendation.title}</Text>
                  <Text style={styles.resultMessage}>{recommendation.message}</Text>
                </View>
              </View>

              <View style={styles.scheduleDetails}>
                <View style={styles.scheduleItem}>
                  <IconSymbol name="leaf.fill" size={20} color={colors.primary} />
                  <View style={styles.scheduleItemText}>
                    <Text style={styles.scheduleLabel}>Plant Type</Text>
                    <Text style={styles.scheduleValue}>{schedule.plantType}</Text>
                  </View>
                </View>

                <View style={styles.scheduleItem}>
                  <IconSymbol name="drop.fill" size={20} color={colors.primary} />
                  <View style={styles.scheduleItemText}>
                    <Text style={styles.scheduleLabel}>Soil Moisture</Text>
                    <Text style={styles.scheduleValue}>{schedule.soilMoisture}</Text>
                  </View>
                </View>

                {schedule.lastWatered && (
                  <View style={styles.scheduleItem}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                    <View style={styles.scheduleItemText}>
                      <Text style={styles.scheduleLabel}>Last Watered</Text>
                      <Text style={styles.scheduleValue}>
                        {schedule.lastWatered.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.scheduleItem}>
                  <IconSymbol name="calendar" size={20} color={colors.accent} />
                  <View style={styles.scheduleItemText}>
                    <Text style={styles.scheduleLabel}>Next Watering</Text>
                    <Text style={styles.scheduleValue}>
                      {schedule.nextWatering?.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Tips Section with Stars */}
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <DecorativeStar size={16} color={colors.highlight} delay={0} />
              <Text style={styles.tipsTitle}>Watering Tips</Text>
              <DecorativeStar size={16} color={colors.highlight} delay={500} />
            </View>
            
            <View style={styles.tipItem}>
              <IconSymbol name="sun.max.fill" size={20} color={colors.highlight} />
              <Text style={styles.tipText}>Water early morning or late evening to reduce evaporation</Text>
            </View>

            <View style={styles.tipItem}>
              <IconSymbol name="drop.fill" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Water at the base of plants, avoid wetting leaves</Text>
            </View>

            <View style={styles.tipItem}>
              <IconSymbol name="thermometer" size={20} color={colors.accent} />
              <Text style={styles.tipText}>Adjust watering based on weather and season</Text>
            </View>

            <View style={styles.tipItem}>
              <IconSymbol name="hand.raised.fill" size={20} color={colors.secondary} />
              <Text style={styles.tipText}>Check soil moisture before watering</Text>
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
    position: 'relative',
  },
  decorativeStarsTop: {
    position: 'absolute',
    top: -10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starTopLeft: {
    position: 'absolute',
    left: 20,
    top: 0,
  },
  starTopRight: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  resultHeaderText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  scheduleDetails: {
    gap: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleItemText: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  scheduleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tipsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
