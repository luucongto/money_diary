import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LaunchScreen from '../Containers/LaunchScreen'

const Stack = createStackNavigator()
function AppNavigation () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
