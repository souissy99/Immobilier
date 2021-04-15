import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme, Button, Button as GaButton } from "galio-framework";
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

import Icon from '../components/Icon';
import nowTheme from '../constants/Theme';

const { width, height } = Dimensions.get('screen');

class Details extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      activeIndex:0,
  }
}
  renderHeader = () => {
    return (
      <Block style={styles.headerStyles}>
        <Block left center style={styles.header}>
          <Block style={styles.backIcon}>
            <Icon
            name="arrowleft"
            family="antdesign"
            size={30}
            color="grey"
            /> 
          </Block>
        </Block>
      </Block>
    );
  };
  renderFooter = () => {
    return (
      <Block style={styles.footerStyles}>
        <Block center style={styles.footer}>
          <Block row style={styles.options}>
          <Button
            shadowless
            style={[styles.tab, styles.divider]}
          >
            <Block row middle>
              <Icon
                name="phone"
                family="feather"
                size={25}
                style={{ paddingRight: 8 }}
                color={nowTheme.COLORS.ACTIVE}
              />
              <Text style={{ fontFamily: 'montserrat-regular' }} size={20} style={styles.tabTitle}>
                Appeler
              </Text>
            </Block>
          </Button>
          <Button shadowless style={styles.tab} >
            <Block row middle>
              <Icon
                size={24}
                name="email"
                family="entypo"
                style={{ paddingRight: 8 }}
                color={nowTheme.COLORS.ACTIVE}
              />
              <Text style={{ fontFamily: 'montserrat-regular' }} size={20} style={styles.tabTitle}>
                Ecrire
              </Text>
            </Block>
          </Button>
        </Block>
        </Block>
      </Block>
    );
  };

  _renderItem({item, index}){
    return (
      <Block style={styles.imgContainer}>
        <Image
          source={{ uri: item }}
          containerStyle={styles.imgStyle}
          style={styles.image}
          parallaxFactor={0.4}
        />
      </Block>
    )
  }

  render() {
    const item = this.props.route.params.data;

    return (
    <Block flex center style={styles.home}>
      {this.renderHeader()}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
        >
        <Block flex left>
        <Text>{item.city}</Text>
        <Text>Code postal: {item.code_postal}</Text>
        </Block>
        <Block flex center>
          <Carousel
            sliderWidth={width}
            sliderHeight={width}
            itemWidth={width - 60}
            data={item.medias.images}
            renderItem={this._renderItem}
            hasParallaxImages={true}
          />
        </Block>
        <Block flex>
          <Text
            style={{ fontFamily: 'montserrat-regular' }}
            size={22}
            style={styles.title}
            color={nowTheme.COLORS.SECONDARY}
          >
            {item.title}
          </Text>
        </Block>
        <Block flex left>
          <Text
            style={styles.price}
            size={30}
            color={nowTheme.COLORS.HEADER}
            bold
          >
            {item.price} €
          </Text>
        </Block>
        <Block flex left style={{marginBottom: 5}}>
          <Text>Pièce(s): {item.rooms}</Text>
          <Text>Chambre(s): {item.bedrooms}</Text>
          <Text>Pièce(s): {item.rooms}</Text>
          <Text>Surface: {item.surface}²</Text>
          <Text>Description: {item.description}</Text>
        </Block>
        </ScrollView>
        {this.renderFooter()}
    </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  backIcon: {
    marginLeft: 10
  },
  imgStyle: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  item: {
    width: width - 60,
    height: width - 60,
  },
  imgContainer: {
    width: width,
    height: height / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  title: {
    paddingTop: 7,
    paddingBottom: 10
  },
  price: {
    fontFamily: 'montserrat-bold',
    paddingVertical: 7
  },
  footerStyles: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  headerStyles: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  footer: {
    width: width,
    height: height / 10,
    zIndex: 5
  },
  header: {
    width: width,
    height: height / 15,
    zIndex: 5
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  },
  options: {
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
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: nowTheme.COLORS.ACTIVE
  },
});
  
export default Details;
  