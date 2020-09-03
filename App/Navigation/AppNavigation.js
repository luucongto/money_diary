import React from 'react'
import { Icon } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LaunchScreen from '../Containers/LaunchScreen'
import HomeScreen from '../Containers/HomeScreen'
import WalletScreen from '../Containers/WalletScreen'
import CategoryScreen from '../Containers/CategoryScreen'
import SettingScreen from '../Containers/SettingScreen'
import TransactionScreen from '../Containers/TransactionScreen'
import TransactionDetailScreen from '../Containers/TransactionDetailScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
function MainScreen () {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ios-albums-outline'
          switch (route.name) {
            case 'Home':
              iconName = focused
                ? 'home'
                : 'home-outline'
              break
            case 'Wallet':
              iconName = focused
                ? 'wallet'
                : 'wallet-outline'
              break
            case 'Settings':
              iconName = focused
                ? 'settings'
                : 'settings-outline'
              break
            case 'Category':
              iconName = focused
                ? 'pricetags'
                : 'pricetags-outline'
          }

          // You can return any component that you like here!
          return <Icon name={iconName} type='Ionicons' size={size} color={color} />
        }
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray'
      }}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Wallet' component={WalletScreen} />
      <Tab.Screen name='Category' component={CategoryScreen} />
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
        <Stack.Screen name='TransactionScreen' component={TransactionScreen} />
        <Stack.Screen name='TransactionDetailScreen' component={TransactionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
