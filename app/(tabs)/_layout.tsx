import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
        screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Landmarks',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'trail-sign' : 'trail-sign-outline'} color={color} />
                ),
            }}
        />
      <Tabs.Screen
        name="hotel"
        options={{
          title: 'Hotels',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bed' : 'bed-outline'} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
