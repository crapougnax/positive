"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const positive_common_1 = require("@crapougnax/positive-common");
admin.initializeApp(functions.config().firebase);
exports.calcWeeklyStats = functions
    .region("europe-west1")
    .firestore.document('/garbages/{userId}/{garbageId}')
    .onWrite((change, context) => {
    console.log(`Garbage ${context.params.garbageId} has been edited`);
    // Ignore all changes not related to the weight property
    if (change.before && change.after
        && change.before.data().weight === change.after.data().weight) {
        return null;
    }
    const data = change.after.data() || change.before.data();
    const stats = {
        _computed: (new Date()).toISOString(),
        types: {},
        total: {
            records: 0,
            grams: 0,
        },
    };
    positive_common_1.garbageTypes.map(item => stats.types[item.value] = 0);
    // Call all data for same week
    admin.firestore().collection(`/garbages/${context.params.userId}/`)
        .where('week', '==', data.week).get()
        .then(dataset => {
        // sum up by types
        dataset.forEach(doc => {
            const item = doc.data();
            stats.types[item.type] += parseInt(item.weight);
            stats.total.records++;
            stats.total.grams += parseInt(item.weight);
        });
        if (data.week.length === 1) {
            data.week.length = '0' + data.week.length;
        }
        // create or replace weekly stats
        const ref = `/stats/${context.params.userId}/${data.date.substring(0, 4)}W${data.week}`;
        return admin.firestore().doc(ref).set(stats);
    })
        .catch(err => err);
});
//# sourceMappingURL=index.js.map