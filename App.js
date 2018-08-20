/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native';
import { MapView } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      coordinates: [],
    };
    this.getDirections = this.getDirections.bind(this);
    this.handleGetDirections = this.handleGetDirections.bind(this);
  }

  componentDidMount() {
    this.getDirections('40.7308, -73.9973', '40.7359', '-73.9911');
  }

  getDirections = async (startLoc, destinationLoc) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&&mode=walking&key=YOUR_API_KEY`);
      const jsonResponse = await response.json();
      const points = Polyline.decode(jsonResponse.routes[0].overview_polyline.points);
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      const newCoords = [...this.state.coordinates, coords];
      this.setState({ coordinates: newCoords });
      return coords;
    } catch (error) {
      alert(error);
      return error;
    }
  };

  handleGetDirections = () => {
    const data = {
      source: {
        latitude: 40.7308,
        longitude: -73.9973,
      },
      destination: {
        latitude: 40.7308,
        longitude: -73.9973,
      },
      params: [
        {
          key: 'travelmode',
          value: 'walking', // walking / bicycling / transit
        },
        {
          key: 'dir_action',
          value: 'navigate',
        }
      ],
    };
    getDirections(data);
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.7308,
            longitude: -73.9973,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: 40.7308,
              longitude: -73.9973,
            }}
          />
          <Button transparent>
            <Icon
              size={30}
              color="#fff"
              name="ios-man"
              onPress={this.handleGetDirections}
            />
          </Button>
          {this.state.coordinates.map((coords, index) => (
            <MapView.Polyline
              key={index}
              index={index}
              coordinates={coords}
              strokeWidth={2}
              strokeColor="blue"
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
