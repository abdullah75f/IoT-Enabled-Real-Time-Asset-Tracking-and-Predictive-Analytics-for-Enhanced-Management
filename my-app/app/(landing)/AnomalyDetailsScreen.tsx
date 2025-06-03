import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { predictAnomaly, fetchLatestReading } from '../apiService/api';

export default function AnomalyDetailsScreen() {
  const { carName, temp, speed } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [anomalyData, setAnomalyData] = useState<{
    anomaly: string;
    recommendation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [showAllReadings, setShowAllReadings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch latest readings
        const latestReadings = await fetchLatestReading();
        console.log('Latest readings from API:', latestReadings);
        const carReadings = latestReadings[carName as string];
        console.log('Car readings:', carReadings);
        if (carReadings && Array.isArray(carReadings)) {
          setReadings(carReadings);
        } else {
          console.log('No readings found for car:', carName);
          setReadings([]);
        }

        // Ensure we have valid numbers for prediction
        const currentTemp = Number(temp) || 0;
        const currentSpeed = Number(speed) || 0;
        
        console.log('Making prediction with:', { temp: currentTemp, speed: currentSpeed });
        
        // Get anomaly prediction
        const result = await predictAnomaly(currentTemp, currentSpeed);
        console.log('Prediction result:', result);
        setAnomalyData(result);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [temp, speed, carName]);

  const toggleReadings = () => {
    setShowAllReadings(!showAllReadings);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
        </TouchableOpacity>
        <Text style={styles.title}>Anomaly Analysis</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            {readings && readings.length > 0 ? (
              <View>
                {/* Show first reading always */}
                <View style={styles.readingRow}>
                  <Text style={styles.readingLabel}>Latest Reading:</Text>
                  <View style={styles.readingDetails}>
                    <Text style={styles.readingValue}>
                      Temp: {readings[0].engine_temperature !== null ? `${readings[0].engine_temperature}°C` : 'N/A'}
                    </Text>
                    <Text style={styles.readingValue}>
                      Speed: {readings[0].speed !== null ? `${readings[0].speed} km/h` : 'N/A'}
                    </Text>
                    <Text style={styles.readingTime}>
                      {readings[0].reading_timestamp ? new Date(readings[0].reading_timestamp).toLocaleTimeString() : 'No timestamp'}
                    </Text>
                  </View>
                </View>

                {/* Show expand/collapse button if there are more readings */}
                {readings.length > 1 && (
                  <TouchableOpacity onPress={toggleReadings} style={styles.expandButton}>
                    <Text style={styles.expandButtonText}>
                      {showAllReadings ? 'Show Less' : `Show ${readings.length - 1} More Readings`}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Show additional readings if expanded */}
                {showAllReadings && readings.slice(1).map((reading, index) => (
                  <View key={index} style={styles.readingRow}>
                    <Text style={styles.readingLabel}>Reading {index + 2}:</Text>
                    <View style={styles.readingDetails}>
                      <Text style={styles.readingValue}>
                        Temp: {reading.engine_temperature !== null ? `${reading.engine_temperature}°C` : 'N/A'}
                      </Text>
                      <Text style={styles.readingValue}>
                        Speed: {reading.speed !== null ? `${reading.speed} km/h` : 'N/A'}
                      </Text>
                      <Text style={styles.readingTime}>
                        {reading.reading_timestamp ? new Date(reading.reading_timestamp).toLocaleTimeString() : 'No timestamp'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noReadingsText}>No readings available</Text>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Analyzing vehicle data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : anomalyData ? (
            <View>
              <View style={[styles.card, styles.anomalyCard]}>
                <Text style={styles.cardTitle}>Detected Anomaly</Text>
                <Text style={styles.anomalyText}>{anomalyData.anomaly}</Text>
              </View>

              <View style={[styles.card, styles.recommendationCard]}>
                <Text style={styles.cardTitle}>Recommendation</Text>
                <Text style={styles.recommendationText}>
                  {anomalyData.recommendation}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  readingRow: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  readingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  readingDetails: {
    marginLeft: 10,
  },
  readingValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  readingTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  expandButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 10,
  },
  expandButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  anomalyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  recommendationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  anomalyText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  noReadingsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 