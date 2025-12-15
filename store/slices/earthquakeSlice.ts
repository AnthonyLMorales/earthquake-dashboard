import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEarthquakes } from "@/services/earthquakeApi";
import type { EarthquakeFeature } from "@/types/earthquake";
import type { EarthquakeData } from "@/utils/mapUtils";

interface EarthquakeState {
  data: EarthquakeData[];
  loading: boolean;
  error: string | null;
}

const initialState: EarthquakeState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchEarthquakeData = createAsyncThunk(
  "earthquakes/fetchData",
  async () => {
    const earthquakeData = await fetchEarthquakes();

    const transformedData: EarthquakeData[] = earthquakeData.features.map(
      (feature: EarthquakeFeature) => ({
        id: feature.id,
        position: feature.geometry.coordinates,
        magnitude: feature.properties.mag || 0,
        place: feature.properties.place || "Unknown",
        depth: feature.geometry.coordinates[2] || 0,
        time: feature.properties.time,
        properties: feature.properties,
      })
    );

    return transformedData;
  }
);

const earthquakeSlice = createSlice({
  name: "earthquakes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarthquakeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEarthquakeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load earthquake data";
      });
  },
});

export default earthquakeSlice.reducer;
