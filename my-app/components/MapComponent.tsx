import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({ latitude, longitude }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude || 37.78825, // Default latitude
          longitude: longitude || -122.4324, // Default longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marker for Asset Location */}
        <Marker coordinate={{ latitude, longitude }} title="Asset Location" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
