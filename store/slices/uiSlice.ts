import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  selectedId: string | null;
  isTableVisible: boolean;
  zoomToPosition: [number, number, number] | null;
  zoomTrigger: number;
  isDetailModalOpen: boolean;
  detailModalId: string | null;
  baseMapStyle: string;
}

const initialState: UIState = {
  selectedId: null,
  isTableVisible: false,
  zoomToPosition: null,
  zoomTrigger: 0,
  isDetailModalOpen: false,
  detailModalId: null,
  baseMapStyle: "mapbox://styles/mapbox/streets-v12",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    toggleTable: (state) => {
      state.isTableVisible = !state.isTableVisible;
    },
    setTableVisible: (state, action: PayloadAction<boolean>) => {
      state.isTableVisible = action.payload;
    },
    setZoomToPosition: (state, action: PayloadAction<[number, number, number] | null>) => {
      state.zoomToPosition = action.payload;
      if (action.payload !== null) {
        state.zoomTrigger += 1;
      }
    },
    openDetailModal: (state, action: PayloadAction<string>) => {
      state.isDetailModalOpen = true;
      state.detailModalId = action.payload;
    },
    closeDetailModal: (state) => {
      state.isDetailModalOpen = false;
      state.detailModalId = null;
    },
    setBaseMapStyle: (state, action: PayloadAction<string>) => {
      state.baseMapStyle = action.payload;
    },
  },
});

export const {
  setSelectedId,
  toggleTable,
  setTableVisible,
  setZoomToPosition,
  openDetailModal,
  closeDetailModal,
  setBaseMapStyle
} = uiSlice.actions;
export default uiSlice.reducer;
