import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ShortTermForecast from '../screens/ShortTermForecast';

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="earth" size={size} color={color} />
                        ),
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Short-term Forecast"
                    component={ShortTermForecast}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="weather-cloudy-clock"
                                size={size}
                                color={color}
                            />
                        ),
                        // headerShown: false,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
