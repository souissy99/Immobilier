import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet,Dimensions, TouchableWithoutFeedback, View, Modal, Keyboard, Alert } from 'react-native';
import { Block, Text, theme, Button } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { nowTheme, api } from '../constants/';
import { Input, Icon } from '../components';


const { width, height } = Dimensions.get('screen');

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    console.log('stored')
    return this.props.navigation.navigate('App');
  } catch (e) {
    console.log(e)
  }
}

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);


class CalculatorForm extends React.Component {

  constructor(props) {
    super(props);
    this.getSimulation = this.getSimulation.bind(this);
    this.state = {
      isLoading: false,
      modalRevenusVisible: false,
      modalChargesVisible: false,
      options: [
            {
                id: 1,
                title: 'Seul',
                checked: true
            },
            {
                id: 2,
                title: 'A deux',
                checked: false
            }
        ],
      revenusEmp: 0,
      revenusCoemp: 0,
      primesEmp: 0,
      primesCoemp: 0,
      totalCharges: 0,
      totalRevenus: 0,
      pensionVerse: 0,
      loyer: 0,
      pretLocatif: 0,
      pretImmo: 0,
      creditConso: 0,
      creditAuto: 0,
      autreCredit: 0,
      revenusFin: 0,
      alloc: 0,
      revenusLoc: 0,
      pensionRecu: 0,
    };
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  checkThisBox = (itemId) => {
    const updatedList = this.state.options.map( item => item.id === itemId ?  {...item, checked:true} :  {...item, checked:false} );
    this.setState({options:updatedList})
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
        storeData('@simulationSearch', data.data.pop())
        this.setState({isLoading: false})
        return this.props.navigation.push('App');
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

 calculRedirect = () => {

  this.setState({isLoading: true})
  const { 
    revenusEmp,
    revenusCoemp,
    primesEmp,
    primesCoemp,
    pensionVerse,
    loyer,
    pretLocatif,
    pretImmo,
    creditConso,
    creditAuto,
    autreCredit,
    revenusFin,
    alloc,
    revenusLoc,
    pensionRecu, } = this.state
  const totalCharges = Number(pensionVerse) + Number(loyer) + Number(pretLocatif) + Number(pretImmo) + Number(creditConso) + Number(creditAuto) + Number(autreCredit)
  const totalRevenus = Number(revenusFin) + Number(alloc) + Number(revenusLoc) + Number(pensionRecu) + Number(revenusEmp) + Number(revenusCoemp) + Number(primesCoemp) + Number(primesEmp)
  // if(!revenusEmp && !renderCoemp) {
  //   console.log('remplir au moins un revenus')
  //   this.setState({isLoading: false})
  // }

  fetch(api.url + 'simulations', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      UserId: this.props.userId,
      alloc: alloc,
      autreCredit: autreCredit,
      creditAuto: creditAuto,
      creditConso: creditConso,
      loyer: loyer,
      pensionRecu: pensionRecu,
      pensionVerse: pensionVerse,
      pretImmo: pretImmo,
      pretLocatif: pretLocatif,
      primesCoemp: primesCoemp,
      primesEmp: primesEmp,
      revenusCoemp: revenusCoemp,
      revenusEmp: revenusEmp,
      revenusFin: revenusFin,
      revenusLoc: revenusLoc,
      totalCharges: totalCharges,
      totalRevenus: totalRevenus,
    })
  })
  .then(response => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  }).then(([res, data]) => {
    if(res == 201) {
      this.getSimulation(this.props.userId)
      this.setState({isLoading: false})
    } else {
      this.setState({isLoading: false})
      console.log(data)
      Alert.alert("Une erreur est survenus, veuillez ressayer.")
    }
  })
  .catch((error) => {
    this.setState({isLoading: false})
    console.error(error)
    Alert.alert("Une erreur est survenus, veuillez ressayer plus tard.")
  })
  
 }

  renderSingleForm = () => {
    return (
      <Block>
        <Text>EMPRUNTEUR</Text>
        <Block width={width * 0.5}>
          <Input
            label="Votre salaire
            (net avant impôt) :"
            right
            placeholder={this.state.revenusEmp.toString()}
            style={styles.inputs}
            type="number-pad"
            onChangeText={val => this.onChangeText('revenusEmp', val)}
            iconContent={
              <Text>€ / mois</Text>
             }
          />
        </Block>
        <Block width={width * 0.5}>
          <Input
            label="Vos primes :"
            right
            placeholder={this.state.primesEmp.toString()}
            style={styles.inputs}
            type="number-pad"
            onChangeText={val => this.onChangeText('primesEmp', val)}
            iconContent={
              <Text>€ / an</Text>
             }
          />
        </Block>
      </Block>
    )
  };

  renderCoForm = () => {
    return (
      <Block style={styles.name}>
        <Block style={{margin: 2}}>
          <Text>EMPRUNTEUR</Text>
        <Block width={width * 0.4}>
          <Input
            label="Votre salaire
            (net avant impôt) :"
            right
            placeholder={this.state.revenusEmp.toString()}
            style={styles.inputs}
            type="number-pad"
            onChangeText={val => this.onChangeText('revenusEmp', val)}
            iconContent={
              <Text>€ / mois</Text>
             }
          />
        </Block>
        <Block width={width * 0.4}>
          <Input
            label="Vos primes :"
            right
            placeholder={this.state.primesEmp.toString()}
            style={styles.inputs}
            type="number-pad"
            onChangeText={val => this.onChangeText('primesEmp', val)}
            iconContent={
              <Text>€ / an</Text>
             }
          />
        </Block>
      </Block>
        <Block style={{margin: 2}}>
        <Text>CO-EMPRUNTEUR</Text>
            <Block width={width * 0.4}>
              <Input
                label="Votre salaire
                (net avant impôt) :"
                right
                placeholder={this.state.revenusCoemp.toString()}
                style={styles.inputs}
                type="number-pad"
                onChangeText={val => this.onChangeText('revenusCoemp', val)}
                iconContent={
                  <Text>€ / mois</Text>
                 }
              />
            </Block>
            <Block width={width * 0.4}>
              <Input
                label="Vos primes :"
                right
                placeholder={this.state.primesCoemp.toString()}
                style={styles.inputs}
                type="number-pad"
                onChangeText={val => this.onChangeText('primesCoemp', val)}
                iconContent={
                  <Text>€ / an</Text>
                 }
              />
            </Block>
          </Block>
      </Block>
    )
  };

  renderCheckbox = (id, label, checked) => {
    return (
      <TouchableWithoutFeedback
        key={id}
        onPress={() => {
          this.checkThisBox(id);
        }}
      >
        <View
          style={styles.checkboxContainer}
        >
          <Icon
            name={checked ? 'check-square' : 'square'}
            family="feather"
            size={20}
            color={nowTheme.COLORS.PRIMARY}
          />
          <View
            style={{ marginLeft: 5 }}
          >
            <Text>{'' + label}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  };

  renderCharges = () => {
    const { modalChargesVisible } = this.state;
    
    return (
    <Block>
      <Button color="primary" round style={styles.formButton} onPress={() => this.setState({ modalChargesVisible: !modalChargesVisible })}>
        <Block row middle>
            <Icon
              name="pluscircleo"
              family="antdesign"
              size={18}
              style={{ paddingRight: 8, color: nowTheme.COLORS.WHITE }}
              color={nowTheme.COLORS.HEADER}
            />
          <Text
            style={{ fontFamily: 'montserrat-bold' }}
            size={14}
            color={nowTheme.COLORS.WHITE}
          >
            Vos charges
          </Text>
        </Block>
      </Button>
      <Text>Total charges: {this.state.totalCharges} €</Text>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalChargesVisible}
          onRequestClose={() => {
            this.setState({ modalChargesVisible: !modalChargesVisible })
          }}
        >
          <DismissKeyboard>
            <Block center>
            <Block style={styles.modalView}>
              <Block flex>
                <Text>Charges</Text>
                <Block style={styles.name}>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Pension versée :"
                      right
                      placeholder={this.state.pensionVerse.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('pensionVerse', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Loyer :"
                      right
                      placeholder={this.state.loyer.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('loyer', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                </Block>
                <Block style={styles.name}>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Prêt locatif :"
                      right
                      placeholder={this.state.pretLocatif.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('pretLocatif', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Prêt immobilier :"
                      right
                      placeholder={this.state.pretImmo.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('pretImmo', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                </Block>
                <Block style={styles.name}>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Crédit à la consommation :"
                      right
                      placeholder={this.state.creditConso.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('creditConso', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                  <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                    <Input
                      label="Crédit Auto/Moto :"
                      right
                      placeholder={this.state.creditAuto.toString()}
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('creditAuto', val)}
                      iconContent={
                        <Text>€ / mois</Text>
                      }
                    />
                  </Block>
                </Block>
                <Block width={width * 0.5}>
                  <Input
                    label="Autre(s) crédit(s) :"
                    right
                    placeholder={this.state.autreCredit.toString()}
                    style={styles.inputs}
                    type="number-pad"
                    onChangeText={val => this.onChangeText('autreCredit', val)}
                    iconContent={
                      <Text>€ / mois</Text>
                    }
                  />
                </Block>
              </Block>
              <Block flex={0.2} center>
                <Button color="primary" round style={styles.createButton} onPress={() => this.setState({ modalChargesVisible: !modalChargesVisible })}>
                  <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    size={14}
                    color={nowTheme.COLORS.WHITE}
                  >
                    Valider
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
          </DismissKeyboard>  
        </Modal>
    </Block>
    )
  };

  renderRevenus = () => {
    const { modalRevenusVisible } = this.state;
    
    return(
    <Block>
      <Button color="primary" round style={styles.formButton} onPress={() => this.setState({ modalRevenusVisible: !modalRevenusVisible })}>
        <Block row middle>
            <Icon
              name="pluscircleo"
              family="antdesign"
              size={18}
              style={{ paddingRight: 8, color: nowTheme.COLORS.WHITE }}
              color={nowTheme.COLORS.HEADER}
            />
          <Text
            style={{ fontFamily: 'montserrat-bold' }}
            size={14}
            color={nowTheme.COLORS.WHITE}
          >
            Vos revenus
          </Text>
        </Block>
      </Button>
      <Text>Total revenus: {this.state.totalRevenus} €</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalRevenusVisible}
          onRequestClose={() => {
            this.setState({ modalRevenusVisible: !modalRevenusVisible })
          }}
        >
          <DismissKeyboard>
          <Block center>
            <Block style={styles.modalView}>
              <Block flex>
                <Text>Revenus</Text>
                <Block width={width * 0.5}>
                  <Input
                    label="Revenus financiers :"
                    right
                    placeholder={this.state.revenusFin.toString()}
                    style={styles.inputs}
                    type="number-pad"
                    onChangeText={val => this.onChangeText('revenusFin', val)}
                    iconContent={
                      <Text>€ / mois</Text>
                    }
                  />
                </Block>
                <Block width={width * 0.5}>
                  <Input
                    label="Allocations familiales :"
                    right
                    placeholder={this.state.alloc.toString()}
                    style={styles.inputs}
                    type="number-pad"
                    onChangeText={val => this.onChangeText('alloc', val)}
                    iconContent={
                      <Text>€ / mois</Text>
                    }
                  />
                </Block>
                <Block width={width * 0.5}>
                  <Input
                    label="Revenus locatifs existants :"
                    right
                    placeholder={this.state.revenusLoc.toString()}
                    style={styles.inputs}
                    type="number-pad"
                    onChangeText={val => this.onChangeText('revenusLoc', val)}
                    iconContent={
                      <Text>€ / mois</Text>
                    }
                  />
                </Block>
                <Block width={width * 0.5}>
                  <Input
                    label="Pension alimentaire reçue :"
                    right
                    placeholder={this.state.pensionRecu.toString()}
                    style={styles.inputs}
                    type="number-pad"
                    onChangeText={val => this.onChangeText('pensionRecu', val)}
                    iconContent={
                      <Text>€ / mois</Text>
                    }
                  />
                </Block>
              </Block>
              <Block flex={0.2} center>
                <Button color="primary" round style={styles.createButton} onPress={() => this.setState({ modalRevenusVisible: !modalRevenusVisible })}>
                  <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    size={14}
                    color={nowTheme.COLORS.WHITE}
                  >
                    Valider
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
          </DismissKeyboard>
        </Modal>
    </Block>
    )
  };

  render() {
    const { isLoading } = this.state;

    return (
      <Block flex space="evenly">
        <Block flex={0.1} middle style={styles.socialConnect}>
          <Block flex={0.5} middle>
            <Text
              style={{
                fontFamily: 'montserrat-regular',
                textAlign: 'center'
              }}
              color="#333"
              size={24}
            >
              Calculette
            </Text>
          </Block>
        </Block>
        <Block flex={1} middle space="between">
          <Block center flex={1}>
            <Block flex space="between">
              <Block>
                <Text>J'emprunte:</Text>
              <Block style={styles.name}>
                {this.state.options.map((opt) => (
                    <Block key={opt.id} width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                      {this.renderCheckbox(opt.id, opt.title, opt.checked)}
                    </Block>
                    )
                )}
              </Block>
                  {this.state.options[0].checked ? this.renderSingleForm() : this.renderCoForm()}
              </Block>
              <Block>
                  {this.renderCharges()}
                  {this.renderRevenus()}
              </Block>
              <Block center>
                <Button color="primary" round style={styles.createButton} onPress={() => this.calculRedirect()} loading={isLoading}>
                  <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    size={14}
                    color={nowTheme.COLORS.WHITE}
                  >
                    Calculez
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: '30%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    height: height * 0.7
  },
  name: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
    socialConnect: {
      backgroundColor: nowTheme.COLORS.WHITE
      // borderBottomWidth: StyleSheet.hairlineWidth,
      // borderColor: "rgba(136, 152, 170, 0.3)"
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
    createButton: {
      width: width * 0.5,
      marginTop: 20,
      marginBottom: 40
    },
    formButton: {
      width: width * 0.4,
      marginTop: 20,
      marginBottom: 20
    },
    social: {
      width: theme.SIZES.BASE * 3.5,
      height: theme.SIZES.BASE * 3.5,
      borderRadius: theme.SIZES.BASE * 1.75,
      justifyContent: 'center',
      marginHorizontal: 10
    },
    checkboxContainer: {
      flexDirection:  'row' ,
      alignItems: 'center'
    },
  });
  
export default withNavigation(CalculatorForm);
