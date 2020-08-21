import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LaunchScreen from '../Containers/LaunchScreen'
import HomeScreen from '../Containers/HomeScreen'
import WalletScreen from '../Containers/WalletScreen'
import SettingScreen from '../Containers/SettingScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
function MainScreen () {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Wallet' component={WalletScreen} />
      <Tab.Screen name='Settings' component={SettingScreen} />
    </Tab.Navigator>
  )
}
function AppNavigation () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: 'horizontal'
          // cardStyle: { backgroundColor: 'transparent' },
          // cardStyleInterpolator: ({ current, next, layouts }) => {
          //   return {
          //     cardStyle: {
          //       transform: [
          //         {
          //           translateX: current.progress.interpolate({
          //             inputRange: [0, 1],
          //             outputRange: [layouts.screen.width, 0]
          //           })
          //         }
          //       ]
          //     },
          //     overlayStyle: {
          //       opacity: current.progress.interpolate({
          //         inputRange: [0, 1],
          //         outputRange: [0, 0.5]
          //       })
          //     }
          //   }
          // }
        }}
      >
        <Stack.Screen name='LaunchScreen' component={LaunchScreen} />
        <Stack.Screen name='MainScreen' component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
