import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchBreachDetails } from '../apiService/api';

interface BreachDetail {
  event: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface RawBreachDetail {
  event: string;
  latitude: string | number;
  longitude: string | number;
  timestamp: string;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function BreachDetailsScreen() {
  const { carName } = useLocalSearchParams();
  const [breachDetails, setBreachDetails] = useState<BreachDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreach, setSelectedBreach] = useState<BreachDetail | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);

  useEffect(() => {
    const loadBreachDetails = async () => {
      try {
        const details = await fetchBreachDetails(carName as string);
        const formattedDetails = details.map((detail: RawBreachDetail) => ({
          ...detail,
          latitude: Number(detail.latitude),
          longitude: Number(detail.longitude)
        }));
        setBreachDetails(formattedDetails);
        
        // Set initial selected breach
        if (formattedDetails.length > 0) {
          const firstBreach = formattedDetails[0];
          setSelectedBreach(firstBreach);
          setMapRegion({
            latitude: firstBreach.latitude,
            longitude: firstBreach.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error('Failed to load breach details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBreachDetails();
  }, [carName]);

  const handleBreachSelect = (breach: BreachDetail) => {
    setSelectedBreach(breach);
    setMapRegion({
      latitude: breach.latitude,
      longitude: breach.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCoordinate = (coord: number) => {
    return typeof coord === 'number' ? coord.toFixed(6) : 'N/A';
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800">
          Breach History for {carName}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Total Breaches: {breachDetails.length}
        </Text>
      </View>

      {/* Map View */}
      <View style={{ height: 300, margin: 10, borderRadius: 10, overflow: 'hidden' }}>
        {selectedBreach && mapRegion && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={mapRegion}
          >
            <Marker
              coordinate={{
                latitude: selectedBreach.latitude,
                longitude: selectedBreach.longitude,
              }}
              title={`Breach at ${formatDate(selectedBreach.timestamp)}`}
              description={`Location: ${formatCoordinate(selectedBreach.latitude)}, ${formatCoordinate(selectedBreach.longitude)}`}
            />
          </MapView>
        )}
      </View>

      <ScrollView className="flex-1 mt-4">
        {breachDetails.map((breach, index) => (
          <TouchableOpacity
            key={index}
            className={`mx-4 my-2 p-4 rounded-lg ${
              selectedBreach === breach
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-50'
            }`}
            onPress={() => handleBreachSelect(breach)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  Breach #{breachDetails.length - index}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {formatDate(breach.timestamp)}
                </Text>
              </View>
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-600 font-medium">
                  {breach.event.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View className="mt-2">
              <Text className="text-gray-700">
                Location: {formatCoordinate(breach.latitude)}, {formatCoordinate(breach.longitude)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
