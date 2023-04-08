import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IRootState {
  loading: boolean;
  loadingUpdate: boolean;
  schedule?: any[];
}

const initialState: IRootState = {
  schedule: [],
  loading: false,
  loadingUpdate: false,
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    getScheduleSuccess: (
      state: IRootState,
      action: PayloadAction<any>,
    ) => {    
      state.schedule = action.payload;
      state.loading = false;
    },
    getScheduleRequest: (
      state: IRootState,
      action: PayloadAction<any>,
    ) => {
      state.loading = true
    },
    putScheduleRequest: (
      state: IRootState,
      action: PayloadAction<any>,
    ) => {
      state.loadingUpdate = true
    },
    putScheduleSuccess: (
      state: IRootState,
    ) => {
      state.loadingUpdate = false
    },
  },
});

export const {
  getScheduleSuccess,
  getScheduleRequest,
  putScheduleRequest,
  putScheduleSuccess,
} = scheduleSlice.actions;
export const selectSchedule = (state: { schedule: any }) => state.schedule;
export default scheduleSlice.reducer;
