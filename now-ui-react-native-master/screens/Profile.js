import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Modal, ImageBackground, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Block, Text, theme, Button as GaButton, Card } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, CalculatorForm } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

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

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      modalVisible: false,
      modalFormVisible: false,
      modalData: [],
      simulation: [],
    };
  }

  async componentDidMount() {
    const user = await getData('@user') 
    const simulation = await getData('@simulation')
    
    this.setState({
      simulation: simulation.data,
      user: user.data
    })
  }

  simulationRedirect = (e, item) => {
    let data = [];
    data.push(item);

    storeData('@simulationSearch', data);
    this.setState({ modalVisible: !this.state.modalVisible })
    return this.props.navigation.push('App');
  }

  openModal = (e, item) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      modalData: item
    })
  }

  render() {
    const { simulation, user, modalVisible, modalFormVisible, modalData } = this.state;

    return (
      <Block flex={1}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalFormVisible}
            onRequestClose={() => {
              this.setState({ modalFormVisible: !modalFormVisible })
            }}
          >
            <DismissKeyboard>
              <Block style={styles.modalView}>
                <CalculatorForm userId={user.id}/>
                <Button color="primary" round onPress={() => this.setState({ modalFormVisible: !modalFormVisible })}>
                  <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    size={14}
                    color={nowTheme.COLORS.WHITE}
                  >
                    Fermer
                  </Text>
                </Button>
              </Block>
            </DismissKeyboard>
          </Modal>
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
                <Button  onPress={() => this.setState({ modalFormVisible: !modalFormVisible })} style={{ width: 150, height: 44, marginHorizontal: 5, elevation: 0 }} textStyle={{ fontSize: 16 }} round>
                  + simulation
                </Button>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
        <Block />
        <ScrollView showsVerticalScrollIndicator={false} flex style={{ position: 'absolute', padding: theme.SIZES.BASE, top: height * 0.435}}>          
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
                <Block row space="between" style={{flexDirection: 'column', width: width}}>
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
                                <Text>Revenus emprunteur: {modalData.revenusEmp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus Co emprunteur: {modalData.revenusCoemp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Primes emprunteur: {modalData.primesEmp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Primes Co emprunteur: {modalData.primesCoemp}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Pension reçue: {modalData.pensionRecu}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus financiers: {modalData.revenusFin}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Allocations: {modalData.alloc}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Revenus locatifs: {modalData.revenusLoc}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Pension versée: {modalData.pensionVerse}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Loyer: {modalData.loyer}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Prêt immo: {modalData.pretImmo}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Prêt locatif: {modalData.pretLocatif}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Crédit conso: {modalData.creditConso}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Crédit Auto: {modalData.creditAuto}</Text>
                              </Block>
                              <Block style={styles.detail}>
                                <Text>Autre crédit: {modalData.autreCredit}</Text>
                              </Block>
                            </Block>
                        <Block style={styles.bottom} center>
                          <Button color="primary" round onPress={(e) => this.simulationRedirect(e, modalData)}>
                            <Text
                              style={{ fontFamily: 'montserrat-bold' }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Rechercher
                            </Text>
                          </Button>
                          <Button color="primary" round onPress={() => this.setState({ modalVisible: !modalVisible })}>
                            <Text
                              style={{ fontFamily: 'montserrat-bold' }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Fermer
                            </Text>
                          </Button>
                        </Block>
                        </Block>
                      </Modal>
                  {simulation.map((item, Index) => (
                    <TouchableOpacity key={Index} onPress={(e) => this.openModal(e, item)}>
                    <Block card flex style={[styles.card, styles.shadow]}>
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
        </ScrollView>
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
    marginBottom: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
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

  modalView: {
    marginTop: 20,
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
    width: width,
    height: height * 0.95,
    // backgroundColor: 'red'
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
