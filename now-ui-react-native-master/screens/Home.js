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
    type: "",
    surfaceMin: 0,
    surfaceMax: 0,
    bedrooms: [],
    rooms: [],
  };

  getAds = (offset, limit) => {
    const { type, ads, surfaceMin, surfaceMax, bedrooms, rooms, simulation } = this.state;
    let category = "";
    let surfacemax = surfaceMax;
    let bedroomsMax;
    let bedroomsMin;
    let roomsMax;
    let roomsMin;
    let result;

    if (simulation.result) result = simulation.result;
    else if (simulation[0].result) result = simulation[0].result;

    this.setState({isLoading: true})

    if (type == "appartement") category += "&category=appartement"
    if (type == "maison") category += "&category=maison"
    if (surfaceMax == 0) surfacemax = ""
    if (!bedrooms[1]) bedroomsMax = ""
    else bedroomsMax = bedrooms[1]

    if (!bedrooms[0]) bedroomsMin = ""
    else bedroomsMin = bedrooms[0]

    if (!rooms[1]) roomsMax = ""
    else roomsMax = rooms[1]

    if (!rooms[0]) roomsMin = ""
    else roomsMin = rooms[0]

    fetch(
      api.url + 'immobiliers?page=' + offset + '&limit=' + limit + '&price[min]=' + result * 0.90 + '&price[max]=' + result * 1.1 + category + '&surface[min]=' + surfaceMin + '&surface[max]=' + surfacemax + '&bedrooms[min]=' + bedroomsMin + '&bedrooms[max]=' + bedroomsMax + '&rooms[min]=' + roomsMin + '&rooms[max]=' + roomsMax, {
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
        if (res == 200) {
          data.data.map(item => (ads.push(item)))
          this.setState({
            isLoading: false,
          })
        } else {
          this.setState({
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        this.setState({isLoading: false})
        console.error(error);
      })
  }

  async componentDidMount() {
    const simulation = await getData('@simulationSearch') 
    const filter = await getData('@filter')

    console.log(typeof(simulation))

    if (filter.maison && !filter.appartement) this.setState({type: "maison"})
    else if (!filter.maison && filter.appartement) this.setState({type: "appartement"})
    else this.setState({type: ""})

    this.setState({
      simulation: simulation,
      surfaceMin: filter.surfaceMin,
      surfaceMax: filter.surfaceMax,
      bedrooms: filter.nombreChambres,
      rooms: filter.nombrePieces
    })
    this.getAds(this.state.offset, 15)
  }

  loadMore = () => {
    const newOffset = this.state.offset + 1;
    this.setState({offset: newOffset})
    this.getAds(newOffset, 15, this.state.simulation.result)
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
