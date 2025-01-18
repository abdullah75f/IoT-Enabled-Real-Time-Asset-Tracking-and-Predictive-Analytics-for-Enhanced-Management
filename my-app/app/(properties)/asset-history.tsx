import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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

export default function AssetHistory() {
  const dispatch = useDispatch();
  const assetHistoryData = useSelector((state: any) => state.assetHistory);

  // we fetch initial data to display
  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://your-backend-api.com/initial-value"
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const result = await response.json();
  //       dispatch(setInitialData(result));
  //     } catch (error: any) {
  //       dispatch(setError(`Initial Data Error: ${error.message}`));
  //     } finally {
  //       dispatch(setLoadingInitialData(false));
  //     }
  //   };
  //   fetchInitialData();
  // }, [dispatch]);

  // fetch car names and anomaly data
  // useEffect(() => {
  //   const fetchAnomalyData = async () => {
  //     try {
  //       const carResponse = await fetch(
  //         "https://your-backend-api.com/car-data"
  //       );
  //       if (!carResponse.ok) {
  //         throw new Error("Failed to fetch car data");
  //       }
  //       const carResult = await carResponse.json();
  //       dispatch(setCarNames(carResult.carNames));

  //       const anomalyResult: any = {};
  //       for (const carName of carResult.carNames) {
  //         const anomalyResponse = await fetch(
  //           `https://your-backend-api.com/anomaly/${carName}`
  //         );
  //         if (!anomalyResponse.ok) {
  //           throw new Error(`Failed to fetch anomaly data for ${carName}`);
  //         }
  //         const anomaly = await anomalyResponse.json();
  //         anomalyResult[carName] = anomaly;
  //       }
  //       dispatch(setAnomalyData(anomalyResult));
  //     } catch (error: any) {
  //       dispatch(setError(`Anomaly Data Error: ${error.message}`));
  //     } finally {
  //       dispatch(setLoadingAnomaly(false));
  //     }
  //   };
  //   fetchAnomalyData();
  // }, [dispatch]);

  const handleShowAllCars = () => dispatch(toggleShowAllCars());

  const carsToDisplay = assetHistoryData.showAllCars
    ? assetHistoryData.carNames
    : assetHistoryData.carNames.slice(0, 2);

  // if (loadingInitialData) {
  //   return <Text>Loading initial data...</Text>;
  // }
  // if (loadingAnomaly) {
  //   return <Text>Loading Car data...</Text>;
  // }
  // if (error) {
  //   return <Text>Error:{error}</Text>;
  // }
  return (
    <View className=" flex-1 pt-[50px] ">
      <View className="flex-1">
        <View className=" pl-[40px]">
          <Text className="font-bold text-[36px]">
            ETB {assetHistoryData.initialData.totalValue.toLocaleString()}
          </Text>
          <View className="flex-row w-3/4 justify-between items-center">
            <Text className="text-[#858D9D] text-[15px]">Total Value </Text>
            <View className="border  bg-black w-[52]  h-[25.46] rounded-[40] justify-center items-center">
              <Text className="text-white ">{`+${assetHistoryData.initialData.percentageChange}%`}</Text>
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

        <View className="mt-8 flex-1 pl-[25px]">
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
                  <View className="mt-4 flex-row justify-between gap-6 w-5/6 items-center">
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[100px] flex-wrap ">
                        Highest Speed
                      </Text>
                      <View className="border  bg-black w-[58.79]  h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px] ">
                          {assetHistoryData.anomalyData[carName]
                            ?.highestSpeed || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[100px] flex-wrap">
                        Boundary Breach
                      </Text>
                      <View className="border  bg-black w-[58.79]  h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px] ">
                          {assetHistoryData.anomalyData[carName]?.boundaryBreach || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="border border-[#e3e5e9] w-11/12 mt-2"></View>
                  <View className="mt-4 flex-row justify-between gap-6 w-5/6 items-center">
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-[14px] w-[100px] flex-wrap">
                        Temperature Alert
                      </Text>
                      <View className="border  bg-black w-[58.79]  h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px] ">
                          {assetHistoryData.anomalyData[carName]?.temperatureAlert || "N/A"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 items-center ">
                      <Text className="text-[14px] w-[100px] flex-wrap ">
                        Detected Anomaly
                      </Text>
                      <View className="border  bg-black w-[58.79]  h-[17] rounded-[70.42] justify-center items-center">
                        <Text className="text-white text-[12.25px] ">
                          {" "}
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
