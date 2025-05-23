import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";

import { useDispatch, useSelector } from "react-redux";
import {
  setAnomalyData,
  setCarNames,
  setError,
  setInitialData,
  setLoadingAnomaly,
  setLoadingInitialData,
  toggleShowAllCars,
} from "@/store/slices/assetHistorySlice";
import {
  createCar,
  fetchCarNamesFromDB,
  fetchLatestReading,
  fetchBreachesByCarName,
  fetchCarValues,
} from "../apiService/api";

export default function AssetHistory() {
  const dispatch = useDispatch();
  const assetHistoryData = useSelector((state: any) => state.assetHistory);

  const [carNameInput, setCarNameInput] = useState(""); // For input field
  const [carValueInput, setCarValueInput] = useState(""); // For car value input
  const [addingCar, setAddingCar] = useState(false); // Loading state for adding car
  const [breachCounts, setBreachCounts] = useState<{[key: string]: number}>({});

  interface LatestReading {
    [carName: string]: {
      speed?: number;
      engine_temperature?: number;
      reading_timestamp?: string;
    };
  }

  const [latestReading, setLatestReading] = useState<LatestReading>({});

  // Function to update total values
  const updateTotalValues = async () => {
    try {
      const response = await fetchCarValues();
      dispatch(setInitialData({
        totalValue: response.totalValue,
        totalAssets: response.totalAssets,
        industries: response.industries,
        percentageChange: 0 // You can calculate this if needed
      }));
    } catch (error) {
      console.error("Failed to update total values:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedCarNames = await fetchCarNamesFromDB();
        dispatch(setCarNames(updatedCarNames));
        // Update total values whenever car names change
        await updateTotalValues();
      } catch (err) {
        console.error("Failed to refresh car names:", err);
      }
    }, 1000); // refresh every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchLatestReading();
        setLatestReading(data);
      } catch (error) {
        console.error("Failed to load latest reading:", error);
      }
    }, 500); // 1000ms = 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchBreachCounts = async () => {
      const counts: {[key: string]: number} = {};
      for (const carName of assetHistoryData.carNames) {
        try {
          const response = await fetchBreachesByCarName(carName);
          counts[carName] = response.boundaryBreach;
        } catch (error) {
          console.error(`Failed to fetch breach count for ${carName}:`, error);
          counts[carName] = 0;
        }
      }
      setBreachCounts(counts);
    };

    if (assetHistoryData.carNames.length > 0) {
      fetchBreachCounts();
      const interval = setInterval(fetchBreachCounts, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [assetHistoryData.carNames]);

  // Handler to add a car to the backend
  const handleAddCar = async () => {
    if (!carNameInput.trim()) {
      Alert.alert("Validation", "Please enter a car name.");
      return;
    }
    if (!carValueInput.trim() || isNaN(Number(carValueInput))) {
      Alert.alert("Validation", "Please enter a valid car value.");
      return;
    }
    setAddingCar(true);
    try {
      await createCar(carNameInput.trim(), Number(carValueInput));
      Alert.alert(
        "Success",
        `Car "${carNameInput.trim()}" added successfully!`
      );
      setCarNameInput("");
      setCarValueInput("");
      // ✅ Refetch car names from DB and update Redux
      const updatedCarNames = await fetchCarNamesFromDB();
      dispatch(setCarNames(updatedCarNames));
      // Update total values after adding a new car
      await updateTotalValues();
    } catch (error: any) {
      Alert.alert("Error", `Failed to add car: ${error.message || error}`);
    } finally {
      setAddingCar(false);
    }
  };

  const handleShowAllCars = () => dispatch(toggleShowAllCars());

  const carsToDisplay = assetHistoryData.showAllCars
    ? assetHistoryData.carNames
    : assetHistoryData.carNames.slice(0, 2);

  useEffect(() => {
    const loadCarNames = async () => {
      dispatch(setLoadingInitialData(true));
      try {
        const carNames = await fetchCarNamesFromDB();
        dispatch(setCarNames(carNames));
      } catch (err) {
        dispatch(setError("Failed to load car names from database"));
      } finally {
        dispatch(setLoadingInitialData(false));
      }
    };

    loadCarNames();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 pt-[50px] pb-4">
        <View className="pl-[40px]">
          <Text className="font-bold text-[36px]">
            ETB {assetHistoryData.initialData.totalValue.toLocaleString()}
          </Text>
          <View className="flex-row w-3/4 justify-between items-center">
            <Text className="text-[#858D9D] text-[15px]">Total Value </Text>
            <View className="border bg-black w-[52] h-[25.46] rounded-[40] justify-center items-center">
              <Text className="text-white">{`+${assetHistoryData.initialData.percentageChange}%`}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row">
          <View className="flex-row items-center pl-[40px] mt-4 gap-3">
            <Text className="text-[32px] font-bold">
              {assetHistoryData.initialData.totalAssets}
            </Text>
            <Text className="text-[#858D9D]">Total Assets</Text>
          </View>
          <View className="flex-row items-center pl-[40px] mt-4 gap-3">
            <Text className="text-[32px] font-bold">
              {assetHistoryData.initialData.industries}
            </Text>
            <Text className="text-[#858D9D]">Industries</Text>
          </View>
        </View>
        <View className="flex-row justify-between w-11/12 ">
          <View className="pl-[40px] mt-4 gap-3">
            <Text className="text-[20px] font-bold">Vehicles </Text>
            <Text className="text-[#858D9D]">Highest value asset</Text>
          </View>
          <View className="pl-[40px] mt-4 gap-3">
            <Text className="text-[20px] font-bold">Other Assets </Text>
            <Text className="text-[#858D9D]">Lowest Value Assets</Text>
          </View>
        </View>

        <View className="mt-8 flex-1 pl-[25px] pr-[25px]">
          <View className="mb-4">
            <Text className="text-[16px] font-bold mb-2">Enter Car Details:</Text>
            <View className="border border-[#D0D3D9] rounded-[8px] px-3 py-2 bg-white mb-2">
              <TextInput
                placeholder="Car Name (e.g. Toyota Corolla)"
                value={carNameInput}
                onChangeText={setCarNameInput}
                className="text-[16px]"
              />
            </View>
            <View className="border border-[#D0D3D9] rounded-[8px] px-3 py-2 bg-white mb-2">
              <TextInput
                placeholder="Car Value in ETB"
                value={carValueInput}
                onChangeText={setCarValueInput}
                keyboardType="numeric"
                className="text-[16px]"
              />
            </View>

            {/* Add Car button */}
            <TouchableOpacity
              onPress={handleAddCar}
              disabled={addingCar}
              className="mt-2 bg-blue-600 py-2 px-4 rounded-md"
            >
              <Text className="text-white text-center">
                {addingCar ? "Adding..." : "Add Car"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between w-11/12 items-center ">
            <Text className="font-bold text-[20px]">Vehicles</Text>
            <TouchableOpacity onPress={handleShowAllCars}>
              <Text className="text-[#10A760] text-[13px]">See all</Text>
            </TouchableOpacity>
          </View>
          <View className="border border-[#D0D3D9] w-11/12 mt-2"></View>
          {assetHistoryData.carNames.length > 0 ? (
            <ScrollView>
              {carsToDisplay.map((carName: string, index: number) => (
                <View key={index}>
                  <Text className="font-semibold mt-4 text-[15px] ">
                    {carName}
                  </Text>
                  <View className="border border-[#e3e5e9] w-11/12 mt-2"></View>
                  <View className="mt-4 flex-row justify-between gap-4 w-4/5 items-center">
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[90px] flex-wrap">
                        Highest Speed
                      </Text>
                      <View className="border bg-black w-[58.79] h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px]">
                          {latestReading[carName]?.speed ?? "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[90px] flex-wrap">
                        Boundary Breach
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/(landing)/BreachDetailsScreen",
                            params: { carName },
                          })
                        }
                        className="border bg-black w-[58.79px] h-[17px] rounded-[70.42px] justify-center items-center"
                      >
                        <Text className="text-white text-[12.25px]">
                          {breachCounts[carName] || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="border border-[#e3e5e9] w-11/12 mt-2"></View>
                  <View className="mt-4 flex-row justify-between gap-4 w-4/5 items-center">
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[90px] flex-wrap">
                        Temperature Alert
                      </Text>
                      <View className="border bg-black w-[58.79] h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px]">
                          {latestReading[carName]?.engine_temperature ?? "N/A"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[90px] flex-wrap">
                        Detected Anomaly
                      </Text>
                      <View className="border bg-black w-[58.79] h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px]">
                          {assetHistoryData.anomalyData[carName]?.detectedAnomaly || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="border border-[#e3e5e9] w-11/12 mt-2"></View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 justify-center items-center bg-gray-100">
              <Text className="text-red-600 text-4xl tracking-widest shadow-md">
                Empty !
              </Text>
            </View>
          )}
        </View>
      </View>

      <Footer />
    </View>
  );
}
