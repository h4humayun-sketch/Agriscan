
import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  Pressable,
  Image
} from "react-native";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Animated, { FadeIn } from 'react-native-reanimated';

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
  // Mock plant data
  const [plants] = useState<Plant[]>([
    {
      id: '1',
      name: 'Tomato Plant',
      type: 'Vegetable',
      dateAdded: new Date(2024, 0, 15),
      health: 85,
      lastScanned: new Date(2024, 2, 10),
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    },
    {
      id: '2',
      name: 'Rose Bush',
      type: 'Flower',
      dateAdded: new Date(2024, 1, 1),
      health: 92,
      lastScanned: new Date(2024, 2, 12),
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    },
    {
      id: '3',
      name: 'Basil',
      type: 'Herb',
      dateAdded: new Date(2024, 1, 20),
      health: 78,
      lastScanned: new Date(2024, 2, 8),
      imageUrl: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400',
    },
  ]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return colors.primary;
    if (health >= 60) return colors.highlight;
    return colors.accent;
  };

  const getHealthStatus = (health: number) => {
    if (health >= 80) return 'Excellent';
    if (health >= 60) return 'Good';
    if (health >= 40) return 'Fair';
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
          {/* Header */}
          <View style={styles.header}>
            <IconSymbol name="leaf.fill" size={48} color={colors.primary} />
            <Text style={styles.title}>My Plant Journal</Text>
            <Text style={styles.subtitle}>Track your plants&apos; health and growth</Text>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <IconSymbol name="leaf.fill" size={28} color={colors.primary} />
              <Text style={styles.statValue}>{plants.length}</Text>
              <Text style={styles.statLabel}>Total Plants</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={28} color={colors.primary} />
              <Text style={styles.statValue}>
                {Math.round(plants.reduce((sum, p) => sum + p.health, 0) / plants.length)}%
              </Text>
              <Text style={styles.statLabel}>Avg Health</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="checkmark.circle.fill" size={28} color={colors.primary} />
              <Text style={styles.statValue}>
                {plants.filter(p => p.health >= 80).length}
              </Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
          </View>

          {/* Plant List */}
          <View style={styles.plantsSection}>
            <Text style={styles.sectionTitle}>Your Plants</Text>
            
            {plants.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="leaf" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No plants yet</Text>
                <Text style={styles.emptySubtext}>
                  Scan your first plant to start tracking its health
                </Text>
              </View>
            ) : (
              plants.map((plant, index) => (
                <Animated.View 
                  key={plant.id} 
                  entering={FadeIn.delay(index * 100)}
                  style={styles.plantCard}
                >
                  <Image 
                    source={{ uri: plant.imageUrl }} 
                    style={styles.plantImage}
                  />
                  
                  <View style={styles.plantInfo}>
                    <View style={styles.plantHeader}>
                      <Text style={styles.plantName}>{plant.name}</Text>
                      <View style={[styles.healthBadge, { backgroundColor: getHealthColor(plant.health) }]}>
                        <Text style={styles.healthText}>{plant.health}%</Text>
                      </View>
                    </View>

                    <View style={styles.plantDetails}>
                      <View style={styles.detailRow}>
                        <IconSymbol name="tag.fill" size={14} color={colors.textSecondary} />
                        <Text style={styles.detailText}>{plant.type}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
                        <Text style={styles.detailText}>
                          {getDaysSinceAdded(plant.dateAdded)} days old
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statusRow}>
                      <View style={styles.statusBadge}>
                        <IconSymbol 
                          name={plant.health >= 80 ? "checkmark.circle.fill" : "exclamationmark.circle.fill"} 
                          size={16} 
                          color={getHealthColor(plant.health)} 
                        />
                        <Text style={[styles.statusText, { color: getHealthColor(plant.health) }]}>
                          {getHealthStatus(plant.health)}
                        </Text>
                      </View>

                      <Text style={styles.lastScannedText}>
                        Last scanned: {plant.lastScanned.toLocaleDateString()}
                      </Text>
                    </View>

                    <Pressable style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>View Progress</Text>
                      <IconSymbol name="chevron.right" size={16} color={colors.primary} />
                    </Pressable>
                  </View>
                </Animated.View>
              ))
            )}
          </View>

          {/* Growth Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Growth Tracking Tips</Text>
            
            <View style={styles.tipCard}>
              <IconSymbol name="camera.fill" size={24} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Regular Photos</Text>
                <Text style={styles.tipText}>
                  Take photos from the same angle weekly to track growth
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Monitor Progress</Text>
                <Text style={styles.tipText}>
                  Track height, leaf count, and flowering stages
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="note.text" size={24} color={colors.primary} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Keep Notes</Text>
                <Text style={styles.tipText}>
                  Record treatments, fertilizing, and environmental changes
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
    marginBottom: 24,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  plantsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  plantCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  plantName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  healthText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  plantDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastScannedText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
