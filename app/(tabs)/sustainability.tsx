
import React from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Platform
} from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function SustainabilityScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Sustainability",
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
          <View style={styles.content}>
            <IconSymbol name="globe" size={80} color={colors.primary} />
            <Text style={styles.title}>Sustainability Dashboard</Text>
            <Text style={styles.subtitle}>Coming Soon</Text>
            <Text style={styles.description}>
              Track your environmental impact, carbon footprint reduction, and contribution to sustainable farming practices.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <IconSymbol name="leaf.fill" size={32} color={colors.primary} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Eco-Friendly Score</Text>
                  <Text style={styles.featureDescription}>
                    Track your use of organic treatments
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="drop.fill" size={32} color={colors.primary} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Water Conservation</Text>
                  <Text style={styles.featureDescription}>
                    Monitor water usage and savings
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color={colors.primary} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Carbon Footprint</Text>
                  <Text style={styles.featureDescription}>
                    Measure your environmental impact
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="trophy.fill" size={32} color={colors.primary} />
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Achievements</Text>
                  <Text style={styles.featureDescription}>
                    Earn badges for sustainable practices
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.visionCard}>
              <Text style={styles.visionTitle}>🌍 Qatar National Vision 2030</Text>
              <Text style={styles.visionText}>
                Supporting sustainable development and environmental stewardship through smart agriculture and eco-friendly farming practices.
              </Text>
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
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  visionCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  visionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    textAlign: 'center',
  },
});
