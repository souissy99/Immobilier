import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, Text } from "galio-framework";

const { width, height } = Dimensions.get('screen');

class Details extends React.Component {
  render() {
    const item = this.props.route.params.data;
    console.log(JSON.stringify(item))
    return (
    <Block flex center style={styles.home}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
        >
        <Block flex>
            <Text>
                {JSON.stringify(item)}
            </Text>
        </Block>
        </ScrollView>
    </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
});
  
export default Details;
  