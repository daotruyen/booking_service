import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRootState {
  loading: boolean;
  data: any[];
  newNotification: number;
}

const initialState: IRootState = {
  loading: false,
  data: [],
  newNotification: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNotificationRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
    },
    getNotificationSuccess: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = false;
      state.newNotification = action.payload.NewNotiCount;
      state.data = action.payload.Notifications;
    },
    getNewNotification: (state: IRootState, action: PayloadAction<any>) => {
      state.newNotification = action.payload.newNotification;
    },
  },
});

export const {
  getNotificationSuccess,
  getNotificationRequest,
  getNewNotification,
} = notificationSlice.actions;
export const selectNotification = (state: { notification: any }) =>
  state.notification;
export default notificationSlice.reducer;
