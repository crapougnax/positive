import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as _ from 'lodash'
import { garbageTypes } from '@crapougnax/positive-common'

admin.initializeApp(functions.config().firebase)

export const calcWeeklyStats = functions
  .runWith({ memory: "128MB", timeoutSeconds: 15 })
  .region("europe-west1")
  .database.ref('/garbages/{userId}/{garbageId}')
  .onWrite((change, context) => {

    console.log(`Garbage ${context.params.garbageId} has been edited`)

    // Ignore all changes not related to the weight property
    if (change.before.exists() && change.after.exists() && change.before.val().weight === change.after.val().weight) {
      return null
    }

    const data = change.after.val() || change.before.val()
    const stats = {
      _computed: (new Date()).toISOString(),
      types: {},
      total: {
        records: 0, // number of records
        grams: 0, // total of garbages
      },
    }

    _.map(garbageTypes, item => {
      stats.types[item.value] = 0
    })

    // Call all data for same week
    admin.database()
    .ref(`/garbages/${context.params.userId}/`)
    .orderByChild('week').equalTo(data.week)
    .on('value', snapshot => {
      // sum up by types
      _.map(snapshot.val(), item => {
        stats.types[item.type] += parseInt(item.weight)
        stats.total.records++
        stats.total.grams += parseInt(item.weight)
      })

      if (data.week.length === 1) {
        data.week.length = '0' + data.week.length
      }

      // create or replace weekly stats
      const ref = `/stats/${context.params.userId}/${data.date.substring(0,4)}W${data.week}`

      return admin.database().ref(ref).set(stats)
    })
})
