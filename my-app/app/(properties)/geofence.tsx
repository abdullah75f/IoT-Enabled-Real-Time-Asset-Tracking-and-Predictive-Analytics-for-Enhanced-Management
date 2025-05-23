import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation, createGeofenceAlert } from "../apiService/api"; // Update import path
import { setGeofencePoints, clearGeofence } from "@/store/slices/geofenceSlice";
import store from "../../store/store";
import { playAlertSound } from "../../utils/soundUtils";
import AlertSoundPlayer from "../../components/AlertSoundPlayer";
import { setupNotifications, sendGeofenceNotification } from "../../utils/notificationUtils";

interface Point {
  latitude: number;
  longitude: number;
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  const x = point.latitude,
    y = point.longitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    const xj = polygon[j].latitude,
      yj = polygon[j].longitude;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function Geofence() {
  const dispatch = useDispatch();
  const { points } = useSelector((state: any) => state.geofence);
  const [mapRegion, setMapRegion] = useState({
    latitude: 9.03,
    longitude: 38.74,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [databaseLocation, setDatabaseLocation] = useState<Point | null>(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean | null>(
    null
  );
  const renderCount = useRef(0);

  useEffect(() => {
    // Setup notifications when component mounts
    setupNotifications();
  }, []);

  const checkGeofenceStatus = (location: Point) => {
    if (points.length === 6 && databaseLocation) {
      const isInside = isPointInPolygon(location, points);
      if (isInsideGeofence === null) {
        setIsInsideGeofence(isInside);
        if (!isInside) {
          // Show alert and play sound
          sendGeofenceNotification(
            "Geofence Alert",
            "The current location is outside the geofenced area!"
          );
          playAlertSound(); // Play sound for initial alert
          // Send alert to backend
          try {
            createGeofenceAlert({
              event: "exited",
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error("Failed to send geofence alert to backend:", error);
          }
        }
      } else if (isInsideGeofence !== isInside) {
        const event = isInside ? "entered" : "exited";
        // Show alert and play sound
        sendGeofenceNotification(
          "Geofence Alert",
          `The current location has ${event} the geofenced area!`
        );
        playAlertSound(); // Play sound for state change alert
        setIsInsideGeofence(isInside);
        try {
          createGeofenceAlert({
            event,
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to send geofence alert to backend:", error);
        }
      } else if (!isInside) {
        // Show alert and play sound
        sendGeofenceNotification(
          "Geofence Alert",
          "The current location is outside the geofenced area!"
        );
        try {
          createGeofenceAlert({
            event: "exited",
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to send geofence alert to backend:", error);
        }
      }
    } else {
      setIsInsideGeofence(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndUpdateLocation = async () => {
      try {
        const data = await fetchLocation();
        console.log("(NOBRIDGE) LOG Backend location response:", data);
        if (isMounted) {
          setDatabaseLocation((prevLocation) => {
            if (
              !prevLocation ||
              prevLocation.latitude !== data.latitude ||
              prevLocation.longitude !== data.longitude
            ) {
              console.log("(NOBRIDGE) LOG Location changed, updating:", data);
              setMapRegion({
                latitude: data.latitude,
                longitude: data.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
              const newLocation = {
                latitude: data.latitude,
                longitude: data.longitude,
              };
              checkGeofenceStatus(newLocation);
              return newLocation;
            }
            console.log("(NOBRIDGE) LOG Same location, skipping update:", data);
            return prevLocation;
          });
        }
      } catch (error: any) {
        if (isMounted) {
          console.log(
            "(NOBRIDGE) ERROR Fetch location failed:",
            error.message,
            error.response?.data
          );
          Alert.alert(
            "Error",
            error.message || "Failed to fetch updated location."
          );
        }
      } finally {
        if (isMounted) {
          setTimeout(fetchAndUpdateLocation, 5000);
        }
      }
    };

    fetchAndUpdateLocation();

    return () => {
      isMounted = false;
    };
  }, [points]);

  renderCount.current += 1;
  useEffect(() => {
    console.log(
      "(NOBRIDGE) LOG Render count:",
      renderCount.current,
      "Database Location:",
      databaseLocation
    );
  }, [databaseLocation]);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newPoints = [...points, { latitude, longitude }];
    if (newPoints.length > 6) {
      newPoints.shift();
    }
    dispatch(setGeofencePoints(newPoints));
  };

  const clearGeofenceSettings = () => {
    dispatch(clearGeofence());
    setIsInsideGeofence(null);
  };

  return (
    <View style={styles.container}>
      <AlertSoundPlayer shouldPlay={isInsideGeofence === false} />
      <Text style={styles.title}>Set Geofence</Text>
      <MapView style={styles.map} region={mapRegion} onPress={handleMapPress}>
        {databaseLocation && (
          <Marker coordinate={databaseLocation} title="Current Location" />
        )}
        {points.length > 0 && (
          <>
            {points.map((point: Point, index: number) => (
              <Marker key={index} coordinate={point} />
            ))}
            {points.length === 6 && (
              <Polygon
                coordinates={points}
                strokeColor="#FF0000"
                fillColor="rgba(255, 0, 0, 0.2)"
              />
            )}
          </>
        )}
      </MapView>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Tap the map to select 6 points for a polygonal geofence. Current
          points: {points.length}/6
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (points.length !== 6) {
              Alert.alert(
                "Error",
                "Please select exactly 6 points to set the geofence."
              );
              return;
            }
            Alert.alert("Success", "Geofence settings saved!");
            if (databaseLocation) {
              const isInside = isPointInPolygon(databaseLocation, points);
              if (!isInside) {
                Alert.alert(
                  "Geofence Alert",
                  "The current location is outside the geofenced area!"
                );
              }
              setIsInsideGeofence(isInside);
            }
          }}
        >
          <Text style={styles.buttonText}>Save Geofence</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearGeofenceSettings}
        >
          <Text style={styles.buttonText}>Clear Geofence</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#21252C",
    marginBottom: 10,
  },
  map: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  instructionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginHorizontal: 20,
  },
  saveButton: {
    backgroundColor: "#21252C",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  clearButton: {
    backgroundColor: "#FF4D4F",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
