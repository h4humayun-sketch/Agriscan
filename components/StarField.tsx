
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface StarFieldProps {
  starCount?: number;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StarField({ starCount = 50, width, height }: StarFieldProps) {
  const containerWidth = width || screenWidth;
  const containerHeight = height || 300;

  // Generate random stars
  const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    x: Math.random() * containerWidth,
    y: Math.random() * containerHeight,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2000,
    duration: Math.random() * 2000 + 1500,
  }));

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      {stars.map((star) => (
        <AnimatedStar key={star.id} star={star} />
      ))}
    </View>
  );
}

function AnimatedStar({ star }: { star: Star }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(1, {
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 4px rgba(255, 255, 255, 0.8)',
  },
});
