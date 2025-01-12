import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AssetHistoryState = {
  initialData: {
    totalValue: number;
    percentageChange: number;
    totalAssets: number;
    industries: number;
  };
  anomalyData: Record<string, any>;
  carNames: string[];
  loadingInitialData: boolean;
  loadingAnomaly: boolean;
  error: string | null;
  showAllCars: boolean;
};

const initialState: AssetHistoryState = {
  initialData: {
    totalValue: 0,
    percentageChange: 0,
    totalAssets: 0,
    industries: 0,
  },
  anomalyData: {},
  carNames: [],
  loadingInitialData: true,
  loadingAnomaly: true,
  error: null,
  showAllCars: false,
};

const assetHistorySlice = createSlice({
  name: "assetHistory",
  initialState,
  reducers: {
    setInitialData: (
      state,
      action: PayloadAction<typeof initialState.initialData>
    ) => {
      state.initialData = action.payload;
    },
    setAnomalyData: (state, action: PayloadAction<Record<string, any>>) => {
      state.anomalyData = action.payload;
    },
    setCarNames: (state, action: PayloadAction<string[]>) => {
      state.carNames = action.payload;
    },
    setLoadingInitialData: (state, action: PayloadAction<boolean>) => {
      state.loadingInitialData = action.payload;
    },
    setLoadingAnomaly: (state, action: PayloadAction<boolean>) => {
      state.loadingAnomaly = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleShowAllCars: (state) => {
      state.showAllCars = !state.showAllCars;
    },
  },
});

export const {
  setInitialData,
  setAnomalyData,
  setCarNames,
  setLoadingInitialData,
  setLoadingAnomaly,
  setError,
  toggleShowAllCars,
} = assetHistorySlice.actions;

export default assetHistorySlice.reducer;
