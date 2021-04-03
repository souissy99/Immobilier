import React from 'react';
import { StyleSheet, StatusBar, Dimensions, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableHighlight } from 'react-native';
import { Block, Button, Text, Checkbox, theme, Button as GaButton } from 'galio-framework';

import { Images, nowTheme } from '../constants/';
import { Input, Icon } from '../components';
import CalculatorForm from '../components/CalculatorForm';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const { width, height } = Dimensions.get('screen');

export default class Onboarding extends React.Component {

  state = {
    loginView: true,
    calculatorView: false,
    lastName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    passwordCheck: '',
  }
  
  loginRedirect = () => {
    this.setState({loginView: !this.state.loginView})
  }

  registerValidation = () => {
    this.setState({calculatorView: !this.state.calculatorView})
  }

  renderRegisterForm = () => {

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
                  placeholder="Prénom"
                  style={styles.inputs}
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
              <Button color="primary" round style={styles.createButton} onPress={this.registerValidation}>
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
                      Déjà inscrit ? Connectez vous.
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
    return (
    <Block flex space="evenly">
      <Block flex={0.4} middle style={styles.socialConnect}>
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
            </Block>
            <Block center>
              <Button color="primary" round style={styles.createButton}>
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
      <CalculatorForm />
    )
  };
  
  render() {
    const { loginView } = this.state;
    const { calculatorView } = this.state;

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
    height: height
  },
  registerContainer: {
    marginTop: 30,
    width: width * 0.95,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: nowTheme.COLORS.WHITE,
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
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
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
