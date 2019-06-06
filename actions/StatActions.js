import firebase from 'firebase'
import { Actions } from "react-native-router-flux"
import { GB_STAT_FETCH } from './types'

export const garbageStatsFetch = (key) => {
  const stats = {}
  _.map(garbageTypes, item => {
    stats[item.value] = 0
  })

  const { currentUser } = firebase.auth()

  const _date = new Date()
  //const statKey = _date.getFullYear() + 'W' + _date.getWeekNumber()

  return (dispatch) => {
    firebase.database().ref(`/stats/${currentUser.uid}/${key}`)
      .on('value', snapshot => {
        dispatch({ type: GB_STAT_FETCH, payload: snapshot.val() })
      })
  }
}
