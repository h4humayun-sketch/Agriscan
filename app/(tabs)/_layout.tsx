
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration for AGRISCAN
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'camera.fill',
      label: 'Scan Plant',
    },
    {
      name: 'watering',
      route: '/(tabs)/watering',
      icon: 'drop.fill',
      label: 'Watering',
    },
    {
      name: 'plants',
      route: '/(tabs)/plants',
      icon: 'leaf.fill',
      label: 'My Plants',
    },
    {
      name: 'community',
      route: '/(tabs)/community',
      icon: 'person.3.fill',
      label: 'Community',
    },
    {
      name: 'sustainability',
      route: '/(tabs)/sustainability',
      icon: 'globe',
      label: 'Dashboard',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="camera.fill" drawable="ic_camera" />
          <Label>Scan Plant</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="watering">
          <Icon sf="drop.fill" drawable="ic_water" />
          <Label>Watering</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="plants">
          <Icon sf="leaf.fill" drawable="ic_leaf" />
          <Label>My Plants</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="community">
          <Icon sf="person.3.fill" drawable="ic_community" />
          <Label>Community</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="sustainability">
          <Icon sf="globe" drawable="ic_globe" />
          <Label>Dashboard</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="watering" />
        <Stack.Screen name="plants" />
        <Stack.Screen name="community" />
        <Stack.Screen name="sustainability" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={360} />
    </>
  );
}
