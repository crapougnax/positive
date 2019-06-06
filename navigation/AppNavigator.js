import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation'
import MainTabNavigator from './MainTabNavigator'
import AuthLoginForm from '../screens/AuthLoginForm'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: MainTabNavigator,
    Auth: createStackNavigator({ SignIn: AuthLoginForm })
  }, {
    initialRouteName: 'AuthLoading',
  }
))
