import React from 'react'
import { Alert, View, Text, DatePickerIOS, StyleSheet, Dimensions } from 'react-native'
import { Input } from 'react-native-elements'
import { Button, Card, CardSection } from './common'
import { garbageTypes, getWeekNumber } from '@crapougnax/positive-common'
import RNPickerSelect from 'react-native-picker-select'
import firebase from 'firebase'
import _ from 'lodash'
import { Camera, Permissions } from 'expo'

export default class GarbageForm extends React.Component {

  camera = null

  state = {
      type: null,
      weight: null,
      date: new Date(),
      hasCameraPermission: null,
  }

  async componentDidMount() {
    const camera = await Permissions.askAsync(Permissions.CAMERA)
    //const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    const hasCameraPermission = (camera.status === 'granted')

    this.setState({ hasCameraPermission })
  }

  onButtonPress = () => {
    const { date, weight, type } = this.state

    if (! date || ! weight || ! type) {
      Alert.alert('Données manquantes', 'Veuillez compléter les trois champs')
      return false
    }

    const week = getWeekNumber(date /*, true */)

    const { currentUser } = firebase.auth()
    firebase.database().ref(`/garbages/${currentUser.uid}/`)
      .push({
        date: date.toISOString().substr(0,10),
        weight,
        type,
        week,
        _created: (new Date()).toISOString(),
      })
      .then(() => {
//        this.props.navigate('Home')
        this.setState({
          type: null,
          weight: null,
          date: new Date(),
        })
      })
  }

  render() {

    const { hasCameraPermission } = this.state

    // keep only one label string per type
    const frGarbageTypes = _.map(garbageTypes, item => {
      return { ...item, label: item.label.fr}
    })

    const placeholder = {
      label: 'Choisissez un type...',
      value: null,
      color: '#9EA0A4',
    };
    return (
        <Card>
          <View style={styles.container}>
            <CardSection style={{ flexDirection: 'column' }}>
              <Text>Type de Déchet</Text>
              <RNPickerSelect
                placeholder={placeholder}
                items={frGarbageTypes}
                onValueChange={type => { this.setState({ type }) }}
                style={pickerSelectStyles}
                value={this.state.type}
              />
            </CardSection>
            <CardSection>
            <Text>Masse</Text>
              <Input
                placeholder="en grammes"
                keyboardType="numeric"
                value={this.state.weight}
                onChangeText={weight => { this.setState({ weight }) }}
              />
            </CardSection>
            <CardSection>
              <Text>Date</Text>
              <View style={{flex: 1, justifyContent: 'center'}}>
              <DatePickerIOS
                maximumDate={new Date()}
                date={this.state.date}
                locale="fr"
                mode="date"
                onDateChange={date => this.setState({ date })}
              />
              </View>
            </CardSection>
              <Text>Photo</Text>
                <View style={{flex: 1, justifyContent: 'center'}}>
                { hasCameraPermission &&
                    <Camera
                      style={styles.preview}
                      ref={camera => this.camera = camera}
                    />
                }
              </View>
            <CardSection>
              <Button onPress={this.onButtonPress.bind(this)}>
                Enregistrer
              </Button>
            </CardSection>
          </View>
        </Card>
    )
  }
}

const { width: winWidth, height: winHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  preview: {
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
},
})
