import React from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { Appbar, Avatar, Divider, IconButton } from 'react-native-paper'
import firebase from 'firebase'
import GarbageList from '../components/GarbageList'
import { garbageTypes, renderLabel, getWeekNumber } from '@crapougnax/positive-common'
import _ from 'lodash'

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    const currentWeek = this.buildWeekKey()
    this.state = {
      allStats: {}, // All avilable weekly stats (@todo paginate)
      stats: {}, // current displayed stats object
      statsWeek: currentWeek, // current displayed stats object key
      currentWeek, // current week key
      weekName: '...', // current stats week name
      prevExists: false, // previous week exists
      nextExists: false, // next week exists
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    firebase.database().ref(`/stats/${currentUser.uid}/`).on('value', snapshot => {
      if (snapshot.exists()) {
        const allStats = {}
        _.map(snapshot.val(), (item, key) => {
          allStats[key] = item
        })
        this.setState({ allStats })
        this.getWeeklyStats()
      }
    })
  }

  buildStatsObject = () => {
    const stats = {}
    _.map(garbageTypes, item => {
      stats[item.value] = 0
    })

    return stats
  }

  getWeeklyStats = (delta = 0) => {
    const key = this.buildWeekKey(this.state.statsWeek, delta)

    if (! this.state.allStats[key]) {
      if (key === this.state.currentWeek) {
        // create stats on the fly
        this.state.allStats[key] = {
          types: this.buildStatsObject(),
        }
      } else {
        Alert.alert('Pas de statistiques disponibles pour la semaine ' + key)
      }
    }

    if (this.state.allStats[key]) {
      this.setState({
        stats: this.state.allStats[key].types,
        statsWeek: key,
        weekName: this.state.currentWeek === key ? "Cette semaine" : "Semaine " + key.substr(5,2),
        prevExists: this.state.allStats[this.buildWeekKey(key, -1)] ? true : false,
        nextExists: this.state.allStats[this.buildWeekKey(key, 1)] ? true : false,
      })
      //console.log(this.state)
    }
  }

  buildWeekKey = (base = null, delta = 0) => {
    if (! base) {
      const _date = new Date()
      return _date.getFullYear() + 'W' + getWeekNumber(_date)
    }

    const elements = _.map(base.split('W'), val => {
      return parseInt(val)
    })
    const newWeek = elements[1] + delta

    return elements[0] + 'W' + String(newWeek)

    if (newWeek < 0) {
      elements[0]--
    }
  }

  onPressGetPrevWeek = () => {
    if (this.state.prevExists) {
      this.getWeeklyStats(-1)
    }
  }

  renderComponent() {
    return (
      <View>
        <GarbageList />
        <Button
          title="Sign out"
          onPress={() => firebase.auth().signOut()} />
      </View>
    )
  }

  onPressGetNextWeek = () => {
    if (this.state.nextExists) {
      this.getWeeklyStats(1)
    }
  }

  renderComponent() {
    return (
      <View>
        <GarbageList />
        <Button
          title="Sign out"
          onPress={() => firebase.auth().signOut()} />
      </View>
    )
  }

  renderStats() {
    return _.map(garbageTypes, (item) => {
      const weight = this.state.stats[item.value] / 1000
      return (
        <View style={[styles.statStyle, { color: item.color}]} key={item.value}>
          <Avatar.Icon size={36} icon={item.icon} />
          <Text>{renderLabel(item.label)}</Text>
          <Text>{`${weight.toPrecision(2)} Kg`}</Text>
        </View>
      )
    })
  }

  renderStatsHeader = () => {
    return (
      <View style={styles.statsHeaderStyle}>
        <IconButton
          icon="arrow-back"
          size={20}
          color={this.state.prevExists ? 'black' : 'grey'}
          onPress={() => this.onPressGetPrevWeek()}
        />
        <Text style={{ fontSize: 20, justifyContent: 'center' }}>{this.state.weekName}</Text>
        <IconButton
          icon="arrow-forward"
          size={20}
          color={this.state.nextExists ? 'black' : 'grey'}
          onPress={() => this.onPressGetNextWeek()}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Appbar.Header>
          <Appbar.Content
            title="Positive Garbage"
            subtitle="Maîtrisez vos déchets"
          />
          <Appbar.Action icon="more-vert" onPress={() => { }} />
        </Appbar.Header>
        {this.renderStatsHeader()}
        <View style={styles.statsContainer}>
          {this.renderStats()}
        </View>
        <Divider />
        <View style={styles.container}>
          <GarbageList week={this.state.statsWeek} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statsHeaderStyle: {
    height: 30,
    backgroundColor: '#ddd',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statsContainer: {
    height: 100,
    flexDirection: 'row',
    backgroundColor: '#eee'
  },
  statStyle: {
    flex: 0.25,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
})
