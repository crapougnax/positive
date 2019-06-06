import React from 'react'
import { FlatList, Text } from 'react-native'
import GarbageItem from './GarbageItem'
import { connect } from 'react-redux'
import { garbageFetch } from '../actions'
import _ from 'lodash'

class GarbageList extends React.Component {

  state = { week: null }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.week !== prevState.week) {
      return { week: String(nextProps.week) }
   } else {
     return null
   }
 }

 componentDidMount() {
  this.props.garbageFetch(this.state.week)
 }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.week !== this.props.week || prevProps.week === null) {
      this.setState({ week: this.state.week })
      this.props.garbageFetch(this.state.week)
    }
  }

  renderItem = ({item}) => (<GarbageItem item={item} />)

  render() {
    return (
        <FlatList
          keyExtractor={(item) => item.uid}
          data={this.props.garbages}
          renderItem={this.renderItem}
          extraData={this.props}
        />
    )
  }
}

const mapStateToProps = state => {
  const garbages = _.reverse(_.map(state.garbages, (val, uid) => {
    return { ...val, uid }
  }))

  return { garbages }
}

export default connect(mapStateToProps, { garbageFetch })(GarbageList)
