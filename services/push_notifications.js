import { Permissions, Notifications } from 'expo'
import { AsyncStorage } from 'react-native'
import firebase from 'firebase'

export default async () => {
  firebase.auth().onAuthStateChanged(async user => {
    let previousToken = await AsyncStorage.getItem('pushtoken')
    if (previousToken) {
      firebase.database().ref(`/users/${user.uid}/notifications`).update({ token:previousToken })
      return
    } else {
      let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if (status !== 'granted') {
        return
      }
    }

    let token = await Notifications.getExpoPushTokenAsync()
    AsyncStorage.setItem('pushtoken', token)
    firebase.database().ref(`/users/${user.uid}/notifications`).update({ token })
  })
}
