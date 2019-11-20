import React from 'react'
import { Divider } from 'react-native-elements'

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Paramètres',
  }

  render() {
    return (
      <Divider/>
    )
  }
}
