import firebase from 'firebase'
import { Actions } from "react-native-router-flux"
import { GB_FETCH, GB_STAT_FETCH } from './types'

/**
 * Get the list of garbages of the current user
 */
export const garbageFetch = week => {
  console.log("Fetching data for week #" + week)
  if (week) week = week.substring(5)

  const { currentUser } = firebase.auth()
  const ref = firebase.database().ref(`/garbages/${currentUser.uid}/`)

  return (dispatch) => {
    ref
      .orderByChild('week').equalTo(week)
      .on('value', snapshot => {
        dispatch({ type: GB_FETCH, payload: snapshot.val() })
      })
  }
}
