import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { Icon } from 'native-base'
import React from 'react'
import CategoryScreen from '../Containers/CategoryScreen'
import HomeScreen from '../Containers/HomeScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import SettingScreen from '../Containers/SettingScreen'
import TransactionDetailScreen from '../Containers/TransactionDetailScreen'
import TransactionReportScreen from '../Containers/TransactionReportScreen'
import TransactionScreen from '../Containers/TransactionScreen'
import WalletScreen from '../Containers/WalletScreen'
import I18n from '../I18n'
import Utils from '../Utils/Utils'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
// const Tab = createBottomTabNavigator()
// function MainScreen () {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName = 'ios-albums-outline'
//           switch (route.name) {
//             case 'Home':
//               iconName = focused
//                 ? 'home'
//                 : 'home-outline'
//               break
//             case 'Wallet':
//               iconName = focused
//                 ? 'wallet'
//                 : 'wallet-outline'
//               break
//             case 'Settings':
//               iconName = focused
//                 ? 'settings'
//                 : 'settings-outline'
//               break
//             case 'Category':
//               iconName = focused
//                 ? 'pricetags'
//                 : 'pricetags-outline'
//           }

//           // You can return any component that you like here!
//           return <Icon name={iconName} type='Ionicons' size={size} color={color} />
//         }
//       })}
//       tabBarOptions={{
//         activeTintColor: 'tomato',
//         inactiveTintColor: 'gray'
//       }}
//     >
//       <Tab.Screen name='Home' component={HomeScreen} />
//       <Tab.Screen name='Wallet' component={WalletScreen} />
//       <Tab.Screen name='Category' component={CategoryScreen} />
//       <Tab.Screen name='Settings' component={SettingScreen} />
//     </Tab.Navigator>
//   )
// }

function MainScreen () {
  return (
    <Drawer.Navigator
      initialRouteName={I18n.t('Wallet')}
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName = 'ios-albums-outline'
          Utils.log('============', route)
          switch (route.name) {
            case I18n.t('Home'):
              iconName = focused
                ? 'home'
                : 'home-outline'
              break
            case I18n.t('Wallet'):
              iconName = focused
                ? 'wallet'
                : 'wallet-outline'
              break
            case I18n.t('Settings'):
              iconName = focused
                ? 'settings'
                : 'settings-outline'
              break
            case I18n.t('Category'):
              iconName = focused
                ? 'pricetags'
                : 'pricetags-outline'
          }

          // You can return any component that you like here!
          return <Icon name={iconName} type='Ionicons' size={size} color={color} />
        }
      })}
    >
      <Drawer.Screen tag='Home' name={I18n.t('Home')} component={HomeScreen} />
      <Drawer.Screen tag='Wallet' name={I18n.t('Wallet')} component={WalletScreen} />
      {/* <Drawer.Screen tag='Category' name={I18n.t('Category')} component={CategoryScreen} /> */}
      <Drawer.Screen tag='Settings' name={I18n.t('Settings')} component={SettingScreen} />
    </Drawer.Navigator>
  )
}
function AppNavigation () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardStyle: { backgroundColor: 'transparent' },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 500
              }
            },
            close: {
              animation: 'timing',
              config: {
                duration: 500
              }
            }
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
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
        <Stack.Screen name='TransactionReportScreen' component={TransactionReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
