import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, theme, Button, Text } from "galio-framework";

import { Card } from "../components";
import { api, nowTheme } from '../constants/';
import { isLoading } from "expo-font";
const { width } = Dimensions.get("screen");

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
    console.log('stored')
  } catch (e) {
    console.log(e)
  }
}

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

class Home extends React.Component {

  state = {
    isLoading: false,
    offset: 1,
    simulation: {},
    ads: [],
  };

  getAds = (offset, limit) => {
    this.setState({isLoading: true})
    fetch(api.url + 'immobiliers?page=' + offset + '&limit=' + limit + '&price[min]=' + this.state.simulation.result * 0.90 + '&price[max]=' + this.state.simulation.result * 1.1, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.data.map(item => (this.state.ads.push(item)))
        this.setState({
          isLoading: false,
        })
      })
      .catch((error) => {
        this.setState({isLoading: false})
        console.error(error);
      })
  }

  async componentDidMount() {
    const simulation = await getData('@simulation') 
    const filter = await getData('@filter')

    console.log(filter)

    this.setState({simulation: simulation.data[0]})
    this.getAds(this.state.offset, 15, this.state.simulation.price)
  }

  loadMore = () => {
    const newOffset = this.state.offset + 1;
    this.setState({offset: newOffset})
    this.getAds(this.state.offset, 15, this.state.simulation.price)
  }

  renderArticles = () => {
    const { isLoading } = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.ads.map((ads) => (
            <Card item={ads} key={ads.id} full />
            )
          )}
        </Block>
        <Block flex center>
          <Button color="primary" round style={styles.createButton} onPress={this.loadMore} loading={isLoading}>
            <Text
              style={{ fontFamily: 'montserrat-bold' }}
              size={14}
              color={nowTheme.COLORS.WHITE}
            >
              Plus de résultats
            </Text>
          </Button> 
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'
  },
  createButton: {
    width: width * 0.5,
    marginTop: 20,
    marginBottom: 40
  },
});

export default Home;
