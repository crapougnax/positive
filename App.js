import React from 'react'
import { Provider as StoreProvider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Provider as PaperProvider } from 'react-native-paper'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import firebase from 'firebase'
import * as firebaseConfig from './config/firebase.json'
import registerForNotifications from './services/push_notifications'

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig)
  }

  componentDidMount() {
    registerForNotifications()
    Notifications.addListener((notification) => {
      const { data: { text}, origin } = notification
      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text:'Ok.' }]
        )
      }
    })
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

      return (
        <StoreProvider store={store}>
          <PaperProvider>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </View>
          </PaperProvider>
        </StoreProvider>
      )
    }
  }

  _loadResourcesAsync = async () => {
  }

  _handleLoadingError = error => {
    console.warn(error);
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
