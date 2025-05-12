import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeofenceState {
  points: { latitude: number; longitude: number }[];
}

const initialState: GeofenceState = {
  points: [],
};

const geofenceSlice = createSlice({
  name: "geofence",
  initialState,
  reducers: {
    setGeofencePoints: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }[]>
    ) => {
      state.points = action.payload;
    },
    clearGeofence: (state) => {
      state.points = [];
    },
  },
});

export const { setGeofencePoints, clearGeofence } = geofenceSlice.actions;
export default geofenceSlice.reducer;
