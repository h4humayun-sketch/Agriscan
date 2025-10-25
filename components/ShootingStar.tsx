
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ShootingStarProps {
  delay?: number;
  duration?: number;
  startX?: number;
  startY?: number;
}

export default function ShootingStar({ 
  delay = 0, 
  duration = 1500,
  startX = 0,
  startY = 0,
}: ShootingStarProps) {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      translateX.value = startX;
      translateY.value = startY;
      opacity.value = 0;

      translateX.value = withDelay(
        delay,
        withRepeat(
          withTiming(startX + 200, {
            duration: duration,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        )
      );

      translateY.value = withDelay(
        delay,
        withRepeat(
          withTiming(startY + 200, {
            duration: duration,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        )
      );

      opacity.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: duration / 3,
            easing: Easing.in(Easing.ease),
          }),
          -1,
          false
        )
      );
    };

    animate();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: '45deg' },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 100,
    height: 2,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});
