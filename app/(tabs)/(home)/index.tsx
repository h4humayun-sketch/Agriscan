
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import StarField from "@/components/StarField";
import ShootingStar from "@/components/ShootingStar";
import DecorativeStar from "@/components/DecorativeStar";

interface DiseaseResult {
  name: string;
  severity: string;
  description: string;
  treatments: string[];
}

export default function ScanPlantScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);

  // Simulated AI disease detection
  const analyzePlant = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock disease detection results
    const mockDiseases: DiseaseResult[] = [
      {
        name: "Early Blight",
        severity: "Moderate",
        description: "A common fungal disease affecting tomato and potato plants. It appears as dark spots with concentric rings on older leaves.",
        treatments: [
          "Remove and destroy infected leaves immediately",
          "Apply neem oil spray every 7-10 days",
          "Ensure proper air circulation between plants",
          "Water at the base of plants, avoid wetting leaves",
          "Apply organic copper fungicide as preventive measure"
        ]
      },
      {
        name: "Powdery Mildew",
        severity: "Low",
        description: "A fungal disease that appears as white powdery spots on leaves and stems. Common in warm, dry climates with cool nights.",
        treatments: [
          "Mix 1 tablespoon baking soda with 1 gallon water and spray",
          "Apply milk solution (1 part milk to 9 parts water)",
          "Improve air circulation around plants",
          "Remove heavily infected leaves",
          "Apply sulfur-based organic fungicide"
        ]
      },
      {
        name: "Nitrogen Deficiency",
        severity: "Moderate",
        description: "Nutrient deficiency causing yellowing of older leaves. Plants may appear stunted with pale green color.",
        treatments: [
          "Apply organic compost rich in nitrogen",
          "Use fish emulsion or seaweed fertilizer",
          "Add coffee grounds to soil",
          "Plant nitrogen-fixing cover crops",
          "Apply well-rotted manure around plants"
        ]
      },
      {
        name: "Healthy Plant",
        severity: "None",
        description: "Your plant appears to be in excellent health! The leaves show vibrant color and no signs of disease or nutrient deficiency.",
        treatments: [
          "Continue current care routine",
          "Maintain consistent watering schedule",
          "Monitor regularly for any changes",
          "Ensure adequate sunlight exposure",
          "Apply organic mulch to retain moisture"
        ]
      }
    ];
    
    const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    setDiseaseResult(randomDisease);
    setIsAnalyzing(false);
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos of your plants."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiseaseResult(null);
        await analyzePlant();
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setDiseaseResult(null);
        await analyzePlant();
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setDiseaseResult(null);
    setIsAnalyzing(false);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Info", "AGRISCAN - AI-Powered Plant Health Assistant\n\nProject by Affan & Eyad\nSupervisor: Ms. Savera Rehman\nNSRC Project - Qatar National Vision 2030")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="info.circle" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "AGRISCAN",
            headerRight: renderHeaderRight,
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
          {/* Header Section with Decorative Stars */}
          <View style={styles.header}>
            <View style={styles.decorativeStarsTop}>
              <View style={styles.starTopLeft}>
                <DecorativeStar size={20} color={colors.primary} delay={0} />
              </View>
              <View style={styles.starTopRight}>
                <DecorativeStar size={16} color={colors.highlight} delay={500} />
              </View>
            </View>
            <View style={styles.logoContainer}>
              <IconSymbol name="leaf.fill" size={48} color={colors.primary} />
              <View style={styles.scanIconOverlay}>
                <IconSymbol name="viewfinder" size={32} color={colors.accent} />
              </View>
            </View>
            <Text style={styles.title}>AGRISCAN</Text>
            <Text style={styles.subtitle}>AI-Powered Plant Health Assistant</Text>
            <View style={styles.decorativeStarsBottom}>
              <View style={styles.starBottomLeft}>
                <DecorativeStar size={14} color={colors.secondary} delay={1000} />
              </View>
              <View style={styles.starBottomRight}>
                <DecorativeStar size={18} color={colors.primary} delay={1500} />
              </View>
            </View>
          </View>

          {/* Image Preview or Placeholder */}
          <View style={styles.imageSection}>
            {selectedImage ? (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                {isAnalyzing && (
                  <View style={styles.analyzingOverlay}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.analyzingText}>Analyzing plant health...</Text>
                  </View>
                )}
              </Animated.View>
            ) : (
              <View style={styles.placeholderContainer}>
                <IconSymbol name="camera.fill" size={64} color={colors.secondary} />
                <Text style={styles.placeholderText}>Take or upload a photo of your plant</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={takePhoto}
            >
              <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={pickImage}
            >
              <IconSymbol name="photo.fill" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Upload Photo</Text>
            </Pressable>
          </View>

          {/* Disease Result */}
          {diseaseResult && !isAnalyzing && (
            <Animated.View entering={FadeIn} style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <IconSymbol 
                  name={diseaseResult.severity === "None" ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"} 
                  size={32} 
                  color={diseaseResult.severity === "None" ? colors.primary : colors.accent} 
                />
                <View style={styles.resultHeaderText}>
                  <Text style={styles.diseaseName}>{diseaseResult.name}</Text>
                  <Text style={[
                    styles.severityText,
                    diseaseResult.severity === "None" && styles.severityNone,
                    diseaseResult.severity === "Low" && styles.severityLow,
                    diseaseResult.severity === "Moderate" && styles.severityModerate,
                  ]}>
                    Severity: {diseaseResult.severity}
                  </Text>
                </View>
              </View>

              <Text style={styles.descriptionText}>{diseaseResult.description}</Text>

              <View style={styles.treatmentSection}>
                <Text style={styles.treatmentTitle}>
                  {diseaseResult.severity === "None" ? "Care Recommendations:" : "Eco-Friendly Treatments:"}
                </Text>
                {diseaseResult.treatments.map((treatment, index) => (
                  <View key={index} style={styles.treatmentItem}>
                    <IconSymbol name="leaf.fill" size={16} color={colors.primary} />
                    <Text style={styles.treatmentText}>{treatment}</Text>
                  </View>
                ))}
              </View>

              <Pressable 
                style={[styles.actionButton, styles.resetButton]}
                onPress={resetScan}
              >
                <IconSymbol name="arrow.clockwise" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Scan Another Plant</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Features Info */}
          {!selectedImage && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>How It Works</Text>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <IconSymbol name="1.circle.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Capture or Upload</Text>
                  <Text style={styles.featureDescription}>Take a clear photo of the affected plant leaf</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <IconSymbol name="2.circle.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AI Analysis</Text>
                  <Text style={styles.featureDescription}>Our AI detects diseases and nutrient deficiencies</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <IconSymbol name="3.circle.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Get Solutions</Text>
                  <Text style={styles.featureDescription}>Receive eco-friendly treatment recommendations</Text>
                </View>
              </View>
            </View>
          )}

          {/* Night Sky Credits Section */}
          <View style={styles.creditsWrapper}>
            <LinearGradient
              colors={['#0a1128', '#1a1f3a', '#2d1b4e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.nightSkyGradient}
            >
              <StarField starCount={80} height={350} />
              <ShootingStar delay={2000} duration={1500} startX={50} startY={30} />
              <ShootingStar delay={5000} duration={1800} startX={200} startY={80} />
              <ShootingStar delay={8000} duration={1600} startX={100} startY={150} />
              
              <View style={styles.creditsContent}>
                <View style={styles.moonContainer}>
                  <View style={styles.moon}>
                    <View style={styles.moonCrater1} />
                    <View style={styles.moonCrater2} />
                    <View style={styles.moonCrater3} />
                  </View>
                </View>

                <View style={styles.creditsTextContainer}>
                  <View style={styles.titleStarRow}>
                    <DecorativeStar size={20} color="#FFD700" delay={0} />
                    <Text style={styles.creditsTitle}>Project Credits</Text>
                    <DecorativeStar size={20} color="#FFD700" delay={500} />
                  </View>
                  
                  <View style={styles.creditLine}>
                    <IconSymbol name="star.fill" size={14} color="#FFD700" />
                    <Text style={styles.creditsText}>Researchers: Affan & Eyad</Text>
                  </View>
                  
                  <View style={styles.creditLine}>
                    <IconSymbol name="star.fill" size={14} color="#87CEEB" />
                    <Text style={styles.creditsText}>Supervisor: Ms. Savera Rehman</Text>
                  </View>
                  
                  <View style={styles.creditLine}>
                    <IconSymbol name="star.fill" size={14} color="#98D8C8" />
                    <Text style={styles.creditsText}>NSRC Project</Text>
                  </View>
                  
                  <View style={styles.creditLine}>
                    <IconSymbol name="star.fill" size={14} color="#F7DC6F" />
                    <Text style={styles.creditsText}>Qatar National Vision 2030</Text>
                  </View>

                  <View style={styles.decorativeStarsCredits}>
                    <DecorativeStar size={16} color="#FFD700" delay={1000} />
                    <DecorativeStar size={12} color="#87CEEB" delay={1500} />
                    <DecorativeStar size={14} color="#98D8C8" delay={2000} />
                  </View>
                </View>
              </View>
            </LinearGradient>
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
  decorativeStarsBottom: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starBottomLeft: {
    position: 'absolute',
    left: 40,
    bottom: 0,
  },
  starBottomRight: {
    position: 'absolute',
    right: 40,
    bottom: 0,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  scanIconOverlay: {
    position: 'absolute',
    right: -8,
    bottom: -8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  resetButton: {
    backgroundColor: colors.accent,
    marginTop: 16,
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
    marginBottom: 16,
    gap: 12,
  },
  resultHeaderText: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityNone: {
    color: colors.primary,
  },
  severityLow: {
    color: colors.highlight,
  },
  severityModerate: {
    color: colors.accent,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  treatmentSection: {
    marginTop: 8,
  },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  treatmentText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  creditsWrapper: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  nightSkyGradient: {
    position: 'relative',
    minHeight: 350,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  creditsContent: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
  },
  moonContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  moon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F1DE',
    boxShadow: '0px 0px 30px rgba(244, 241, 222, 0.6)',
    position: 'relative',
  },
  moonCrater1: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#E8E4D0',
    top: 20,
    left: 25,
  },
  moonCrater2: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8E4D0',
    top: 45,
    left: 50,
  },
  moonCrater3: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8E4D0',
    top: 35,
    left: 15,
  },
  creditsTextContainer: {
    alignItems: 'center',
    width: '100%',
  },
  titleStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  creditsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  creditLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  creditsText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  decorativeStarsCredits: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  headerButtonContainer: {
    padding: 8,
  },
});
