import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { garbageTypes } from '@crapougnax/positive-common'

admin.initializeApp(functions.config().firebase)

export const calcWeeklyStats = functions
  .region("europe-west1")
  .firestore.document('/garbages/{userId}/{garbageId}')
  .onWrite((change, context) => {

    console.log(`Garbage ${context.params.garbageId} has been edited`)

    // Ignore all changes not related to the weight property
    if (change.before.exists() && change.after
      && change.before.data().weight === change.after.data().weight) {
      return null
    }

    const data = change.after.data() || change.before.data()
    const stats = {
      _computed: (new Date()).toISOString(),
      types: {},
      total: {
        records: 0, // number of records
        grams: 0, // total of garbages
      },
    }

    garbageTypes.map(item => stats.types[item.value] = 0)

    // Call all data for same week
    admin.firestore().collection(`/garbages/${context.params.userId}/`)
    .where('week', '==', data.week).get()
    .then(dataset => {
      // sum up by types
      dataset.forEach(doc => {
        const item= doc.data()
        stats.types[item.type] += parseInt(item.weight)
        stats.total.records++
        stats.total.grams += parseInt(item.weight)
      })

      if (data.week.length === 1) {
        data.week.length = '0' + data.week.length
      }

      // create or replace weekly stats
      const ref = `/stats/${context.params.userId}/${data.date.substring(0,4)}W${data.week}`

      return admin.firestore().doc(ref).set(stats)
    })
    .catch(err => err)
})
