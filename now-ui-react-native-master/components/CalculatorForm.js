import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet,Dimensions, TouchableWithoutFeedback, View, Modal, Pressable } from 'react-native';
import { Block, Text, theme, Button } from 'galio-framework';

import { nowTheme } from '../constants/';
import Checkbox from '../components/Checkbox.js';
import { Input, Icon } from '../components';


const { width, height } = Dimensions.get('screen');

class CalculatorForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false,
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
        formData: {
          revenusEmp: 0,
          revenusCoemp: 0,
          primesEmp: 0,
          primesCoemp: 0,
          totalCharges: 0,
          totalRevenus: 0,
        },
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  checkThisBox = (itemId) => {
    const updatedList = this.state.options.map( item => item.id === itemId ?  {...item, checked:true} :  {...item, checked:false} );
    this.setState({options:updatedList})
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
            placeholder="0"
            style={styles.inputs}
            iconContent={
              <Text>€ / mois</Text>
             }
          />
        </Block>
        <Block width={width * 0.5}>
          <Input
            label="Vos primes :"
            right
            placeholder="0"
            style={styles.inputs}
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
            placeholder="0"
            style={styles.inputs}
            iconContent={
              <Text>€ / mois</Text>
             }
          />
        </Block>
        <Block width={width * 0.4}>
          <Input
            label="Vos primes :"
            right
            placeholder="0"
            style={styles.inputs}
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
                placeholder="0"
                style={styles.inputs}
                iconContent={
                  <Text>€ / mois</Text>
                 }
              />
            </Block>
            <Block width={width * 0.4}>
              <Input
                label="Vos primes :"
                right
                placeholder="0"
                style={styles.inputs}
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
    const { modalVisible } = this.state;
    
    return (    
    <Block>
      <Button color="primary" round style={styles.formButton} onPress={() => this.setModalVisible(!modalVisible)}>
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
      <Text>Total charges: {this.state.formData.totalCharges} €</Text>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <Block center>
            <Block style={styles.modalView}>
              <Block flex>
                <Text>Charges</Text>
                <Pressable
                  onPress={() => this.setModalVisible(!modalVisible)}
                >
                  <Text>Hide Modal</Text>
                </Pressable>
              </Block>
              <Block flex={0.1} center>
                <Button color="primary" round style={styles.createButton} onPress={() => this.setModalVisible(!modalVisible)}>
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
        </Modal>
    </Block>
    )
  };

  renderRevenus = () => {
    const { modalVisible } = this.state;
    return(
    <Block>
      <Button color="primary" round style={styles.formButton} onPress={() => this.setModalVisible(!modalVisible)}>
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
      <Text>Total revenus: {this.state.formData.totalRevenus} €</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <Block center>
            <Block style={styles.modalView}>
              <Block flex>
                <Text>Revenus</Text>
                <Pressable
                  onPress={() => this.setModalVisible(!modalVisible)}
                >
                  <Text>Hide Modal</Text>
                </Pressable>
              </Block>
              <Block flex={0.1} center>
                <Button color="primary" round style={styles.createButton} onPress={() => this.setModalVisible(!modalVisible)}>
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
        </Modal>
    </Block>
    )
  };

  render() {
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
                    <Block width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
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
                <Button color="primary" round style={styles.createButton}>
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
    padding: 35,
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
      marginBottom: 40
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
