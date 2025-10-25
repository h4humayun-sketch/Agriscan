
import { Stack } from "expo-router";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  Pressable,
  Image
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import React, { useState } from "react";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn } from 'react-native-reanimated';
import DecorativeStar from "@/components/DecorativeStar";

interface Plant {
  id: string;
  name: string;
  type: string;
  dateAdded: Date;
  health: number;
  lastScanned: Date;
  imageUrl: string;
}

export default function MyPlantsScreen() {
  // Start with empty plants array - users will add their own plants
  const [plants] = useState<Plant[]>([]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return colors.primary;
    if (health >= 60) return colors.highlight;
    return colors.accent;
  };

  const getHealthStatus = (health: number) => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    return 'Needs Attention';
  };

  const getDaysSinceAdded = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "My Plants",
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
                <DecorativeStar size={14} color={colors.secondary} delay={500} />
              </View>
            </View>
            <IconSymbol name="leaf.fill" size={48} color={colors.primary} />
            <Text style={styles.title}>My Plant Journal</Text>
            <Text style={styles.subtitle}>Track your plants&apos; health and growth</Text>
          </View>

          {plants.length > 0 ? (
            <>
              {/* Stats Overview with Stars */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <DecorativeStar size={20} color={colors.primary} delay={0} />
                  <Text style={styles.statNumber}>{plants.length}</Text>
                  <Text style={styles.statLabel}>Total Plants</Text>
                </View>
                <View style={styles.statCard}>
                  <DecorativeStar size={20} color={colors.highlight} delay={500} />
                  <Text style={styles.statNumber}>
                    {Math.round(plants.reduce((acc, p) => acc + p.health, 0) / plants.length)}%
                  </Text>
                  <Text style={styles.statLabel}>Avg Health</Text>
                </View>
              </View>

              {/* Plants List */}
              <View style={styles.plantsContainer}>
                {plants.map((plant, index) => (
                  <Animated.View 
                    key={plant.id} 
                    entering={FadeIn.delay(index * 100)}
                    style={styles.plantCard}
                  >
                    <Image source={{ uri: plant.imageUrl }} style={styles.plantImage} />
                    
                    <View style={styles.plantInfo}>
                      <View style={styles.plantHeader}>
                        <View style={styles.plantNameContainer}>
                          <Text style={styles.plantName}>{plant.name}</Text>
                          <View style={styles.plantTypeTag}>
                            <IconSymbol name="leaf.fill" size={12} color={colors.primary} />
                            <Text style={styles.plantType}>{plant.type}</Text>
                          </View>
                        </View>
                        <DecorativeStar size={16} color={getHealthColor(plant.health)} delay={index * 200} />
                      </View>

                      <View style={styles.healthContainer}>
                        <View style={styles.healthBar}>
                          <View 
                            style={[
                              styles.healthFill, 
                              { 
                                width: `${plant.health}%`,
                                backgroundColor: getHealthColor(plant.health)
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.healthText, { color: getHealthColor(plant.health) }]}>
                          {plant.health}% - {getHealthStatus(plant.health)}
                        </Text>
                      </View>

                      <View style={styles.plantDetails}>
                        <View style={styles.detailItem}>
                          <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                          <Text style={styles.detailText}>
                            {getDaysSinceAdded(plant.dateAdded)} days old
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <IconSymbol name="camera.fill" size={16} color={colors.textSecondary} />
                          <Text style={styles.detailText}>
                            Last scan: {plant.lastScanned.toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </>
          ) : (
            /* Empty State */
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <DecorativeStar size={24} color={colors.primary} delay={0} />
                <IconSymbol name="leaf.fill" size={80} color={colors.secondary} />
                <DecorativeStar size={20} color={colors.highlight} delay={500} />
              </View>
              <Text style={styles.emptyTitle}>No Plants Yet</Text>
              <Text style={styles.emptyDescription}>
                Start your plant journal by scanning your first plant! 
                Use the camera to detect diseases and track your plants&apos; health over time.
              </Text>
              
              <View style={styles.emptySteps}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.stepText}>Scan a plant using the camera</Text>
                </View>
                
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Get AI-powered disease detection</Text>
                </View>
                
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.stepText}>Save and track your plant&apos;s progress</Text>
                </View>
              </View>
            </View>
          )}

          {/* Add Plant Button */}
          <Pressable style={styles.addButton}>
            <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Plant</Text>
          </Pressable>

          {/* Tips Section */}
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <DecorativeStar size={16} color={colors.highlight} delay={0} />
              <Text style={styles.tipsTitle}>Growth Tips</Text>
              <DecorativeStar size={16} color={colors.highlight} delay={500} />
            </View>
            
            <View style={styles.tipItem}>
              <IconSymbol name="camera.fill" size={20} color={colors.primary} />
              <Text style={styles.tipText}>Scan your plants weekly to track progress</Text>
            </View>

            <View style={styles.tipItem}>
              <IconSymbol name="photo.fill" size={20} color={colors.secondary} />
              <Text style={styles.tipText}>Take photos from the same angle for comparison</Text>
            </View>

            <View style={styles.tipItem}>
              <IconSymbol name="chart.bar.fill" size={20} color={colors.accent} />
              <Text style={styles.tipText}>Monitor health trends over time</Text>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  plantsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  plantCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  plantImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.secondary,
  },
  plantInfo: {
    padding: 16,
  },
  plantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  plantNameContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  plantTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  plantType: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  healthContainer: {
    marginBottom: 12,
  },
  healthBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  plantDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emptyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptySteps: {
    width: '100%',
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
