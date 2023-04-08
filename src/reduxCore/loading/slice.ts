import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRootState {
  isAppLoading: boolean;
  isLoginLoading: boolean;
}

const initialState: IRootState = {
  isAppLoading: true,
  isLoginLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    disableLoader: (state: IRootState, action: PayloadAction<boolean>) => {
      state.isLoginLoading = false;
    },
    enableLoader: (state: IRootState, action: PayloadAction<boolean>) => {
      state.isLoginLoading = true;
    },
    enableAutoLoader: (state: IRootState,) => {
      state.isAppLoading = true;
    },
    disableAutoLoader: (state: IRootState,) => {
      state.isAppLoading = false
    }
  },
});

export const { disableLoader, enableLoader, enableAutoLoader, disableAutoLoader } = loadingSlice.actions;
export const selectLoading = (state: { loading: any }) => state.loading;
export default loadingSlice.reducer;
