import Footer from "@/components/footer";
import { View, Text, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "@/store/slices/notificationsSlice";
import { Notification } from "@/store/slices/notificationsSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const notificationsData = useSelector(
    (state: any) => state.notifications.notifications
  );
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await fetch("https://your-api-url.com/notifications");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch notifications");
  //       }
  //       const data = await response.json();
  //       dispatch(setNotifications([...notificationsData, ...data]));
  //     } catch (error: any) {
  //       console.error("Error fetching notifications:", error);

  //       // Optionally, you could update the state to include a system error notification:
  //       const currentNotifications = notificationsData;
  //       dispatch(
  //         setNotifications([
  //           ...currentNotifications,
  //           {
  //             id: Date.now(),
  //             type: "systemError",
  //             message: `System Error: ${error.message}`,
  //             date: new Date().toLocaleString(),
  //           },
  //         ])
  //       );
  //     }
  //   };
  //   fetchNotifications();
  // }, [dispatch, notificationsData]);

  const renderNotification = ({ item }: { item: Notification }) => {
    let iconName = "";
    let iconColor = "";
    if (item.type === "success") {
      iconName = "check-circle"; 
      iconColor = "green";
    } else if (item.type === "systemError") {
      iconName = "error"; 
      iconColor = "red";
    } else if (item.type === "alert") {
      iconName = "warning"; 
      iconColor = "yellow";
    }

    return (
      <View>
        <View className=" self-center border border-[#e9ebed] ] mt-2 w-full mb-4"></View>
        <View className="flex-row items-start gap-4 h-[80px] ml-4 w-8/12">
          <MaterialIcons
            name={iconName as any}
            size={24}
            color={iconColor}
            className="self-start"
          ></MaterialIcons>
          <Text className="text-[16px]">{item.message}</Text>
        </View>
        <Text className="text-[12px] text-gray-500">{item.date}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 mt-[40]">
      <View className="flex-1">
        <View className="flex-row justify-between ml-[21] w-11/12">
          <Text className="font-bold text-[18px]">
            My Notifications & Alerts
          </Text>
          <MaterialIcons name="notifications" size={24} color="black" />
        </View>

        <FlatList
          data={notificationsData}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          className="mt-4 "
        ></FlatList>
      </View>

      <Footer />
    </View>
  );
}
