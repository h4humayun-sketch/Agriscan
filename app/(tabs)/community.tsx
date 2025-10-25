
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

export default function CommunityScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Community",
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
            <IconSymbol name="person.3.fill" size={80} color={colors.secondary} />
            <Text style={styles.title}>Community</Text>
            <Text style={styles.subtitle}>Coming Soon</Text>
            <Text style={styles.description}>
              Connect with other farmers and gardeners, share your experiences, and learn from the community.
            </Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <IconSymbol name="bubble.left.and.bubble.right.fill" size={32} color={colors.primary} />
                <Text style={styles.featureText}>Discussion Forums</Text>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="photo.on.rectangle.angled" size={32} color={colors.primary} />
                <Text style={styles.featureText}>Share Plant Photos</Text>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="lightbulb.fill" size={32} color={colors.primary} />
                <Text style={styles.featureText}>Expert Tips & Advice</Text>
              </View>
              
              <View style={styles.featureItem}>
                <IconSymbol name="star.fill" size={32} color={colors.primary} />
                <Text style={styles.featureText}>Success Stories</Text>
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
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
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
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
