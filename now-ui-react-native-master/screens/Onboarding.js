import React, { useState } from 'react';
import { StyleSheet, StatusBar, Dimensions, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableHighlight, Alert  } from 'react-native';
import { Block, Button, Text, Checkbox, theme, Button as GaButton, Toast } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationPopup from 'react-native-push-notification-popup';

import { Images, nowTheme, api } from '../constants/';
import { Input, Icon, CalculatorForm } from '../components';
import { isLoading } from 'expo-font';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get('screen');

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    console.log('stored')
  } catch (e) {
    console.log(e)
  }
}

export default class Onboarding extends React.Component {

  state = {
    loginView: true,
    isLoading: false,
    calculatorView: false,
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    passwordCheck: '',
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  getSimulation = (id) => {
    fetch(api.url + 'simulations/user/' + id, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]);
    }).then(([res, data]) => {
      if(res == 200) {
        storeData('@simulation', data)
        storeData('@simulationSearch', data.data[0])
        this.setState({isLoading: false})
        return this.props.navigation.navigate('App');
      } else {
        this.setState({isLoading: false})
        console.log(res)
        Alert.alert("Une erreur est survenus, veuillez ressayer plus tard.")
      }
    })
    .catch((error) => {
      this.setState({isLoading: false})
      console.error(error)
      Alert.alert("Une erreur est survenus, veuillez ressayer plus tard.")
    })
  }
  
  loginRedirect = () => {
    this.setState({loginView: !this.state.loginView})
  }

  registerValidation = () => {
    this.setState({isLoading: true})
    const { firstName, lastName, email, address, password, passwordCheck } = this.state

    if(!firstName || !lastName || !email || !address || !password || !passwordCheck) {
      console.log('remplir tout les champs')
      this.setState({isLoading: false})
      Alert.alert("Veuillez remplir tous les champs svp.")
    }

    else if(password != passwordCheck) {
      console.log('Mdp differents')
      this.setState({isLoading: false})
      Alert.alert("Les mots de passes sont diff??rents.")
    }

    else {
        fetch(api.url + 'app/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                adresse: address,
                email: email,
                password: password,
            })
        })
        .then(response => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        }).then(([res, data]) => {
          if(res == 200) {
            storeData('@user', data)
            this.setState({
              isLoading: false,
              userId: data.data.id,
              calculatorView: !this.state.calculatorView
            })
          } else {
            console.log(res, data)
            this.setState({isLoading: false})
            Alert.alert("Une erreur est survenus, veuillez ressayer.")
          }
        })
        .catch((error) => {
          this.setState({isLoading: false})
          console.error(error)
          Alert.alert("Une erreur est survenus, veuillez ressayer plus tard.")
        })
    }
  }

  loginValidation = () => {
    this.setState({isLoading: true})
    const { email, password } = this.state

    if(!email || !password) {
        console.log('remplir tout les champs')
        this.setState({isLoading: false})
        Alert.alert("Veuillez remplir tout les champs svp.")
    }
    else {
        fetch(api.url + 'app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        .then(response => {
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]);
        }).then(([res, data]) => {
          if(res == 200) {
            storeData('@user', data)
            this.getSimulation(data.data.id)
          } else {
            this.setState({isLoading: false})
            console.log(res)
            Alert.alert("Une erreur est survenus, veuillez ressayer.")
          }
        })
        .catch((error) => {
          this.setState({isLoading: false})
            console.error(error)
            Alert.alert("Une erreur est survenus, veuillez ressayer plus tard.")
        })
    }
  }


  renderRegisterForm = () => {
    const { isLoading } = this.state;

    return (
    <Block flex space="evenly">
        <Block flex={0.2} middle>
          <Text
            style={{
              fontFamily: 'montserrat-regular',
              textAlign: 'center'
            }}
            color="#333"
            size={24}
          >
            Inscription
          </Text>
        </Block>
      <Block flex={1} middle space="between">
        <Block center flex={0.9}>
          <Block flex space="between">
            <Block>
              <Block style={styles.name}>
              <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                <Input
                  placeholder="Pr??nom"
                  style={styles.inputs}
                  onChangeText={val => this.onChangeText('firstName', val)}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="profile-circle"
                      family="NowExtra"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block width={width * 0.4} style={{ marginBottom: 5 }}>
                <Input
                  placeholder="Nom"
                  style={styles.inputs}
                  onChangeText={val => this.onChangeText('lastName', val)}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="caps-small2x"
                      family="NowExtra"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              </Block>
              <Block width={width * 0.8}>
                <Input
                  placeholder="Email"
                  style={styles.inputs}
                  type="email-address"
                  textContentType="emailAddress"
                  onChangeText={val => this.onChangeText('email', val)}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="email-852x"
                      family="NowExtra"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block width={width * 0.8}>
              <Input
                  placeholder="Addresse"
                  style={styles.inputs}
                  textContentType="fullStreetAddress"
                  onChangeText={val => this.onChangeText('address', val)}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="house-user"
                      family="font-awesome-5"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block width={width * 0.8}>
              <Input
                  placeholder="Mot de passe"
                  style={styles.inputs}
                  onChangeText={val => this.onChangeText('password', val)}
                  password
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="key"
                      family="feather"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block width={width * 0.8}>
              <Input
                  placeholder="Confirmez votre mot de passe"
                  style={styles.inputs}
                  onChangeText={val => this.onChangeText('passwordCheck', val)}
                  password
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="key"
                      family="feather"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block
                style={{ marginVertical: theme.SIZES.BASE, marginLeft: 15}}
                row
                width={width * 0.75}
              >
                <Checkbox
                  checkboxStyle={{
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: '#E3E3E3'
                  }}
                  color={nowTheme.COLORS.PRIMARY}
                  labelStyle={{
                    color: nowTheme.COLORS.HEADER,
                    fontFamily: 'montserrat-regular'
                  }}
                  label="J'ai lu et j'accepte les termes et conditions."
                />
              </Block>
            </Block>
            <Block center>
              <Button color="primary" round style={styles.createButton} onPress={this.registerValidation} loading={isLoading}>
                <Text
                  style={{ fontFamily: 'montserrat-bold' }}
                  size={14}
                  color={nowTheme.COLORS.WHITE}
                >
                  S'inscrire
                </Text>
              </Button>
              <TouchableHighlight onPress={this.loginRedirect}>
                  <Text
                      style={{ fontFamily: 'montserrat-regular', textDecorationLine: 'underline' }}
                      size={12}
                      color={nowTheme.COLORS.PRIMARY}
                    >
                      D??j?? inscrit ? Connectez vous.
                    </Text>
                </TouchableHighlight>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
    )
  };

  renderLoginForm = () => {
    const { isLoading } = this.state;

    return (
    <Block flex space="evenly">
      <Block flex={0.3} middle style={styles.socialConnect}>
        <Block flex={0.5} middle>
          <Text
            style={{
              fontFamily: 'montserrat-regular',
              textAlign: 'center'
            }}
            color="#333"
            size={24}
          >
            Connexion
          </Text>
        </Block>
      </Block>
      <Block flex={1} middle space="between">
        <Block center flex={0.9}>
          <Block flex space="between">
            <Block>
              <Block width={width * 0.8}>
                <Input
                  placeholder="Email"
                  style={styles.inputs}
                  type="email-address"
                  textContentType="emailAddress"
                  onChangeText={val => this.onChangeText('email', val)}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="email-852x"
                      family="NowExtra"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
              <Block width={width * 0.8}>
              <Input
                  placeholder="Mot de passe"
                  style={styles.inputs}
                  onChangeText={val => this.onChangeText('password', val)}
                  secureTextEntry={true}
                  iconContent={
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="key"
                      family="feather"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>
            </Block>
            <Block center>
              <Button color="primary" round style={styles.createButton} onPress={() => this.loginValidation()} loading={isLoading}>
                <Text
                  style={{ fontFamily: 'montserrat-bold' }}
                  size={14}
                  color={nowTheme.COLORS.WHITE}
                >
                  Connexion
                </Text>
              </Button>
              <TouchableHighlight onPress={this.loginRedirect}>
                  <Text
                      style={{ fontFamily: 'montserrat-regular', textDecorationLine: 'underline' }}
                      size={12}
                      color={nowTheme.COLORS.PRIMARY}
                    >
                      Pas de compte ? Inscrivez vous.
                    </Text>
                </TouchableHighlight>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
    )
  };

  renderCalculatorForm = () => {
    return(
      <CalculatorForm userId={this.state.userId}/>
    )
  };
  
  render() {
    const { loginView, calculatorView } = this.state;

    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
              <Block style={styles.registerContainer}>
                {calculatorView ? this.renderCalculatorForm() : loginView ? this.renderRegisterForm() : this.renderLoginForm()}
              </Block>
            </Block>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  toast: {
    width: width * 0.9,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: 'pink'
  },
  name: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height,
    aspectRatio: 3/2
  },
  registerContainer: {
    marginTop: 30,
    width: width * 0.95,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 20,
    marginBottom: 40
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  }
});
