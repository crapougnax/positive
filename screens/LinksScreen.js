import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Garbageform from '../components/GarbageForm'

export default class LinksScreen extends React.Component {

  static navigationOptions = {
    title: 'Saisir une poubelle',
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Garbageform {...this.props}/>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
})
