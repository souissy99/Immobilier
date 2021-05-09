import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Modal, ImageBackground, Platform, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Block, Text, theme, Button as GaButton, Card } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e)
  }
}

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    console.log('stored')
  } catch (e) {
    console.log(e)
  }
}


class Profile extends React.Component {

  state = {
    user: {},
    modalVisible: false,
    simulation: [],
  }

  async componentDidMount() {
    const user = await getData('@user') 
    const simulation = await getData('@simulation')

    this.setState({
      simulation: simulation.data,
      user: user.data
    })
  }

  addSimulation = () => {
    console.log('test')
  }

  simulationRedirect = (e, item) => {
    let data = [];
    data.push(item);

    storeData('@simulationSearch', data);
    this.setState({ modalVisible: !this.state.modalVisible })
    return this.props.navigation.push('App');
  }

  render() {
    const { simulation, user, modalVisible } = this.state;

    return (
      <Block flex>
        <Block flex>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <Block style={{ position: 'absolute', width: width, zIndex: 5, height: height * 0.4, paddingHorizontal: 20, backgroundColor: 'rgba(255, 255, 255, .8)' }}>
                <Block style={{ top: height * 0.1 }}>
                  <Block middle>
                    <Text
                      style={{
                        fontFamily: 'montserrat-bold',
                        marginBottom: theme.SIZES.BASE / 2,
                        fontWeight: '900',
                        fontSize: 26,
                        opacity: .7
                      }}
                      color='black'
                      >
                      {user.firstName}
                    </Text>
  
                    <Text
                      size={16}
                      color="black"
                      style={{
                        marginTop: 5,
                        fontFamily: 'montserrat-bold',
                        lineHeight: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                        opacity: .7
                      }}
                    >
                      {user.firstName}
                    </Text>
                  </Block>
                  <Block style={styles.info}>
                    <Block row space="around">
                          
                    <Text
                      size={16}
                      color="black"
                      style={{
                        marginTop: 5,
                        fontFamily: 'montserrat-bold',
                        lineHeight: 20,
                        fontWeight: 'bold',
                        fontSize: 18,
                        opacity: .7
                      }}
                    >
                      {user.email}
                    </Text>
                    </Block>
                  </Block>
                </Block>
              <Block
                middle
                row
                style={{ position: 'absolute', width: width, top: height * 0.4 - 26, zIndex: 99 }}
              >
                <Button onPress={this.addSimulation} style={{ width: 150, height: 44, marginHorizontal: 5, elevation: 0 }} textStyle={{ fontSize: 16 }} round>
                  + simulation
                </Button>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
        <Block />
        <Block flex style={{ position: 'absolute', padding: theme.SIZES.BASE, top: height * 0.42}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block flex>
              <Block middle>
                <Text
                  style={{
                    color: '#2c2c2c',
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'montserrat-bold',
                    marginTop: 15,
                    marginBottom: 30,
                    zIndex: 2
                  }}
                >
                  Mes simulations
                    </Text>
              </Block>
              <Block >
                <Block row space="between" style={{flexDirection: 'column', width: width}}>
                  {simulation.map((item, Index) => (
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: !modalVisible })}>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                          this.setState({ modalVisible: !modalVisible })
                        }}
                      >
                        <Block flex={0.5} style={styles.modalView2} center>
                          <Block>
                            <Text style={styles.title}>
                              Détails
                            </Text>
                          </Block>
                            <Block style={styles.wrap}>
                              <Block style={styles.detail}>
                                <Text>Revenus emprunteur: {item.revenusEmp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus Co emprunteur: {item.revenusCoemp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Primes emprunteur: {item.primesEmp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Primes Co emprunteur: {item.primesCoemp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Pension reçue: {item.pensionRecu}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus financiers: {item.revenusFin}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Allocations: {item.alloc}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus locatifs: {item.revenusLoc}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Pension versée: {item.pensionVerse}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Loyer: {item.loyer}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Prêt immo: {item.pretImmo}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Prêt locatif: {item.pretLoc}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Crédit conso: {item.creditConso}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Crédit Auto: {item.creditAuto}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Autre crédit: {item.autreCredit}</Text>
                              </Block>
                            </Block>
                        <Block style={styles.bottom} center>
                          <Button color="primary" round onPress={(e) => this.simulationRedirect(e, item)}>
                            <Text
                              style={{ fontFamily: 'montserrat-bold' }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Rechercher
                            </Text>
                          </Button>
                        </Block>
                        </Block>
                      </Modal>
                    <Block card key={Index} flex style={[styles.card, styles.shadow]}>
                      <Block flex space="between" style={[styles.cardDescription, styles.content]}>
                        <Block flex>
                          <Text
                            size={22}
                            color={nowTheme.COLORS.SECONDARY}
                          >
                            {item.result} €
                          </Text>
                        </Block>
                        <Block flex right>
                          <Text
                            size={22}
                            color={nowTheme.COLORS.SECONDARY}
                          >
                            +
                          </Text>
                        </Block>
                      </Block>
                  </Block>
                  </TouchableOpacity>
                  ))}
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    )
  }
}

const styles = StyleSheet.create({

  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1,
  },

  name: {
    width: width,
    marginLeft: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },

  detail: {
    margin: 5,
  },

  title: {
    fontFamily: 'montserrat-bold',
    fontSize: 20,
  },

  wrap: {
    width: width * 0.95,
    flexDirection: "column",
    flexWrap: "wrap",
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10
  },

  modalView2: {
    position: 'absolute',
    top: height / 5.5,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width,
    height: height / 1.5,
    
  },

  profileBackground: {
    width,
    height: height * 0.4
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.1,
  },

  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    width: width * 0.85,
    height: 70,
    marginBottom: 4,
    marginLeft: 4
  },

  cardDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: 'hidden'
  },

  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.4,
    elevation: 2
  },
});

export default Profile;
