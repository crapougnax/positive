import React from 'react'
import { renderLabel } from '@crapougnax/positive-common'
import _ from 'lodash'
import { ListItem, Icon } from 'react-native-elements'
import Swipeout from 'react-native-swipeout'
import firebase from 'firebase'
import { Alert } from 'react-native'

export const garbageTypes = [
  {
    label: {
      fr: 'Ordinaire',
    },
    value: 'ordinary',
    icon: 'delete',
    faw:'trash',
    color: '#f44336',
    coef: 0,
  }, {
    label: {
      fr: 'Recyclable',
    },
    value: 'recycle',
    icon: 'loop',
    faw: 'recycle',
    color: '#ff5722',
    coef: 0.3,
  },{
    label: {
      fr: 'Compostable',
    },
    value: 'compost',
    icon: 'all-inclusive',
    faw: 'leaf', //'seeding',
    color: '#4caf50',
    coef: 1.0,
  },{
    label: {
      fr: 'Verre',
    },
    value: 'glass',
    faw: 'glass',
    icon: 'local-drink',
    color: '#4caf50',
    coef: 1.0,
  },
]

export default class GarbageItem extends React.Component {

  delete = (uid) => {
    console.log(uid)
    Alert.alert(
      'Suppression',
      'Veuillez confirmer la suppression de cet enregistrement',
      [
        {
          text: 'Confirmer',
          onPress: () => {
            const { currentUser } = firebase.auth()
            firebase.database().ref(`garbages/${currentUser.uid}/${uid}`).delete()
          }
        },
        {
          text: 'Annuler',
          onPress: () => console.log('annulé !'),
          style: 'cancel'
        }
      ]
    )
  }

  render() {
    const { uid, type, weight, date } = this.props.item
    const garbageType = _.find(garbageTypes, obj => {
      return obj.value === type
    })

    return (
      <Swipeout
        right={[  {
          text:"Supprimer",
          backgroundColor: 'red',
          type: 'delete',
          onPress: () => this.delete(uid),
        }]}
        onOpen={() => this.setState({current: this.props.item})}
      >
        <ListItem
          title={`${renderLabel(garbageType.label)} | ${this.formatDate(date)}`}
          subtitle={`${weight} gr.`}
          leftIcon={props => <Icon
            color={garbageType.color}
            size={36}
            icon={garbageType.icon}
            name={garbageType.faw} type="font-awesome"
          />}
        />
      </Swipeout>
    )
  }

  formatDate(date) {
    const parts = date.split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
}
