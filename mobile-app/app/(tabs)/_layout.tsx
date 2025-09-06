import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme } from '../../context/ThemeContext'; 

export default function TabLayout() {
  const { paperTheme } = useTheme(); 

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: paperTheme.colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: paperTheme.colors.surface, 
          borderTopColor: paperTheme.colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}