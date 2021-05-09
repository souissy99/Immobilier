import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Modal, TouchableWithoutFeedback, Keyboard, View, Alert } from 'react-native';
import { Button, Block, NavBar, Text, theme, Button as GaButton, Checkbox } from 'galio-framework';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from './Icon';
import Tabs from './Tabs';
import { Input, CustomSlider } from '../components';
import nowTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

const BellButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
  >
    <Icon
      family="NowExtra"
      size={16}
      name="bulb"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={[styles.notify, { backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY'] }]} />
  </TouchableOpacity>
);

const BasketButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} >
    <Icon
      family="NowExtra"
      size={16}
      name="basket2x"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    console.log('stored')
  } catch (e) {
    console.log(e)
  }
}

class Header extends React.Component {
  state = {
    modalFilterVisible: false,
    modalSortVisible: false,
    type: [
      {
          id: 1,
          title: 'Maison',
          checked: true
      },
      {
          id: 2,
          title: 'Appartement',
          checked: true
      }
    ],
    surfaceMin: 0,
    surfaceMax: 0,
    nombreChambres: [],
    nombrePieces: []
  };

  checkThisBox = (itemId, checked) => {
    this.setState(prevState => ({
      type: prevState.type.map(
      obj => (obj.id === itemId ? Object.assign(obj, { checked: !checked }) : obj)
    )
  }));
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };

  renderRight = () => {
    const { white, title, navigation } = this.props;
    

    if (title === 'Title') {
      return [
        <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
        <BasketButton key="basket-title" navigation={navigation} isWhite={white} />
      ];
    }

    switch (title) {
      case 'Acceuil':
        return [
          <BellButton key="chat-home" navigation={navigation} isWhite={white} />,
        ];
      case 'Profile':
        return [
          <BellButton key="chat-profile" navigation={navigation} isWhite={white} />,
        ];
      case 'Product':
        return [
          <BellButton key="chat-profile" navigation={navigation} isWhite={white} />,
          <BasketButton key="basket-product" navigation={navigation} isWhite={white} />
        ];
      case 'Settings':
        return [
          <BellButton key="chat-search" navigation={navigation} isWhite={white} />,
          <BasketButton key="basket-search" navigation={navigation} isWhite={white} />
        ];
      default:
        break;
    }
  };

  renderCheckbox = (id, label, checked) => {
    return (
      <TouchableWithoutFeedback
        key={id}
        onPress={() => {
          this.checkThisBox(id, checked);
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

  bedroomsValue = (values) => {
    if (values[1] == 5) values.pop()
    this.setState({nombreChambres : values})
  }

  roomsValue = (values) => {
    if (values[1] == 5) values.pop()
    this.setState({nombrePieces : values})
  }

  filterValidation = () => {
    if (this.state.surfaceMax != 0) {
      if (Number(this.state.surfaceMin) > Number(this.state.surfaceMax)) {
        console.log("Min ne peut etre sup a max")
        Alert.alert("La surface minimum ne peut pas être supérieur à la surface maximum.")
        return
      }
    }
    const filter = {
      maison: this.state.type[0].checked,
      appartement: this.state.type[1].checked,
      surfaceMin: this.state.surfaceMin,
      surfaceMax: this.state.surfaceMax,
      nombreChambres: this.state.nombreChambres,
      nombrePieces: this.state.nombrePieces,
    };

    storeData('@filter', filter);
    this.setState({ modalFilterVisible: !this.state.modalFilterVisible })
    return this.props.navigation.push('App');
  }

  sortValidation = () => {
    this.setState({ modalSortVisible: !this.state.modalSortVisible })
    return this.props.navigation.push('App');
  }

  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;
    const { modalFilterVisible, modalSortVisible } = this.state;

    return (
      <Block row style={styles.options}>
        {/* <Button
          shadowless
          style={[styles.tab, styles.divider]}
          onPress={() => this.setState({ modalSortVisible: !modalSortVisible })}
        >
          <Block row middle>
            <Icon
              name="sort"
              family="material-icons"
              size={18}
              style={{ paddingRight: 8 }}
              color={nowTheme.COLORS.HEADER}
            />
            <Text style={{ fontFamily: 'montserrat-regular' }} size={16} style={styles.tabTitle}>
              {optionLeft || 'Trier'}
            </Text>
          </Block>
        </Button> */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalSortVisible}
          onRequestClose={() => {
            this.setState({ modalSortVisible: !modalSortVisible })
          }}
        >
          <Block flex={0.5} style={styles.modalView2} center>
            <Block>
              <Text>GFG</Text>
            </Block>
          <Block style={styles.bottom} center>
            <Button color="primary" round style={styles.createButton} onPress={this.sortValidation}>
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
        </Modal> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalFilterVisible}
          onRequestClose={() => {
            this.setState({ modalFilterVisible: !modalFilterVisible })
          }}
        >
          <DismissKeyboard>
          <Block flex center>
            <Block style={styles.modalView}>
              <Block style={styles.lined}>
                <Text style={styles.titleFilter}>Type de bien</Text>
                  <Block>
                    {this.state.type.map((opt) => (
                      <Block key={opt.id} width={width * 0.4} style={{ marginBottom: 5, marginRight: 2 }}>
                        {this.renderCheckbox(opt.id, opt.title, opt.checked)}
                      </Block>
                      )
                    )}
                  </Block>
              </Block>
              <Block style={styles.lined}>
                <Text style={styles.titleFilter}>Surface</Text>
                <Block style={styles.name}>
                <Block width={width * 0.4}>
                  <Input
                      right
                      placeholder="Surface min"
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('surfaceMin', val)}
                      iconContent={
                        <Text>m²</Text>
                      }
                    />
                  </Block>
                  <Text>à</Text>
                  <Block width={width * 0.4}>
                    <Input
                      right
                      placeholder="Surface max"
                      style={styles.inputs}
                      type="number-pad"
                      onChangeText={val => this.onChangeText('surfaceMax', val)}
                      iconContent={
                        <Text>m²</Text>
                      }
                    />
                  </Block>
                </Block>
              </Block>
              <Block style={styles.lined}>
                <Text style={styles.titleFilter}>Nombre de chambres</Text>
                <CustomSlider
                    min={1}
                    max={5}
                    LRpadding={40}
                    callback={this.bedroomsValue}
                    single={false}
                  />
              </Block>
              <Block style={styles.lined}>
                <Text style={styles.titleFilter}>Nombre de pièces</Text>
                <CustomSlider
                    min={1}
                    max={5}
                    LRpadding={40}
                    callback={this.roomsValue}
                    single={false}
                  />
              </Block>
              {/* <Block style={styles.lined}>
                <Text style={styles.titleFilter}>Surface terrain</Text>
              </Block> */}
            </Block>
          </Block>
          </DismissKeyboard>
          <Block flex={0.1} center>
            <Button color="primary" round style={styles.createButton} onPress={this.filterValidation}>
              <Text
                style={{ fontFamily: 'montserrat-bold' }}
                size={14}
                color={nowTheme.COLORS.WHITE}
              >
                Valider
              </Text>
            </Button>
          </Block>
        </Modal>
        <Button
        shadowless
        style={styles.tab}
        onPress={() => this.setState({ modalFilterVisible: !modalFilterVisible })}>
          <Block row middle>
            <Icon
              size={18}
              name="filter"
              family="feather"
              style={{ paddingRight: 8 }}
              color={nowTheme.COLORS.HEADER}
            />
            <Text style={{ fontFamily: 'montserrat-regular' }} size={16} style={styles.tabTitle}>
              {optionRight || 'Filtrer'}
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };

  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  };
  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      ...props
    } = this.props;

    const noShadow = ['Search', 'Categories', 'Deals', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null
    ];

    const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={
            <Icon
              name={back ? 'minimal-left2x' : 'align-left-22x'}
              family="NowExtra"
              size={16}
              onPress={this.handleLeftPress}
              color={iconColor || (white ? nowTheme.COLORS.WHITE : nowTheme.COLORS.ICON)}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: nowTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  titleFilter: {
    fontFamily: 'montserrat-regular',
    fontSize: 20,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  name: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  lined: {
    margin: 5,
    width: '100%',
    borderTopColor: 'grey',
    borderTopWidth: 1,
  },
  button: {
    padding: 12,
    position: 'relative'
  },
  modalView: {
    margin: 20,
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
    height: height
  },
  modalView2: {
    position: 'absolute',
    top: height / 5.5,
    margin: 20,
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
    height: height / 3
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'montserrat-regular'
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 20,
    fontWeight: '400',
    color: nowTheme.COLORS.HEADER
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
});

export default withNavigation(Header);
