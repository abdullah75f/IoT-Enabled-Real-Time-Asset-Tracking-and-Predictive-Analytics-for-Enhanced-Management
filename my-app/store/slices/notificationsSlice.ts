import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Notification = {
  id: number;
  type: "success" | "systemError" | "alert";
  message: string;
  date: string;
};

type NotificationsState = {
  notifications: Notification[];
};

const initialState: NotificationsState = {
    // notifications: [
    //   {
    //     id: 1,
    //     type: 'success',
    //     message: 'Your operation was successful!',
    //     date: '10:00am 05/01/25',
    //   },
    //   {
    //     id: 2,
    //     type: 'systemError',
    //     message: 'Failed to fetch data from the server...',
    //     date: '10:05am 05/01/25',
    //   },
    //   {
    //     id: 3,
    //     type: 'alert',
    //     message: 'Your password will expire in 3 days.',
    //     date: '10:10am 05/01/25',
    //   },
    //   {
    //     id: 4,
    //     type: 'success',
    //     message: 'Profile updated successfully.',
    //     date: '10:15am 05/01/25',
    //   },
    //   {
    //     id: 5,
    //     type: 'alert',
    //     message: 'New version of the app is available!',
    //     date: '10:20am 05/01/25',
    //   },
    // ],
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, addNotification, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
