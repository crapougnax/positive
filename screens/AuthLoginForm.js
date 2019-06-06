import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import firebase from 'firebase'

export default class AuthLoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = { email: '', password: '', error: '' }
  }

  onButtonPress() {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          })
      })
  }

  signInWithTwitter = () => {

  }

  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loading: false
    })
  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false })
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <View style={styles.spinnerStyle}>
          <ActivityIndicator size={"small"} />
        </View>
      )
    } else {
      return (
        <Button
          mode="contained"
          style={{ marginLeft: 40, marginRight: 40, marginTop: 10, height: 40 }}
          contentStyle={{ fontSize: 16, alignSelf: 'center' }}
          icon="play-arrow"
          onPress={this.onButtonPress.bind(this)}
        >
          Connexion
        </Button>
      )
    }
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.TextInputStyle}
          mode="outlined"
          label="Email"
          placeholder="user@mail.com"
          value={this.state.email}
          secureTextEntry={false}
          onChangeText={email => this.setState({ email })} />

        <TextInput
          style={styles.TextInputStyle}
          label="Password"
          mode="outlined"
          placeholder="password"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })} />

        {this.renderButton()}

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <Button
          mode="contained"
          style={{ marginLeft: 40, marginRight: 40, marginTop: 10, height: 40 }}
          contentStyle={{ fontSize: 16, alignSelf: 'center' }}
          icon="play-arrow"
          onPress={this.signInWithTwitter}
        >
          Twitter Login
        </Button>
      </View>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'red'
  },
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextInputStyle: {
    margin: 10,
    alignItems: 'center',
    fontSize: 16,
  },
}
