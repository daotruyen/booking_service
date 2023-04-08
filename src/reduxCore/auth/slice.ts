import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRootState {
  isLoggedIn: boolean;
  loading: boolean;
  Token: string;
  RefreshToken: string;
  userId: string;
  phoneNumber: string;
  role: string;
  tokenClaims: TokenClaims;
}

export interface TokenClaims {
  aud: string;
  exp: string;
  full_name: string;
  phone_number: string;
  user_id: string;
  role: string;
}

const initialState: IRootState = {
  isLoggedIn: false,
  Token: "",
  RefreshToken: "",
  loading: false,
  userId: "",
  phoneNumber: "",
  role: "",
  tokenClaims: {} as TokenClaims,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = false;
    },

    autoLoginRequest: (state: IRootState,action: PayloadAction<any>) => {
    },
    loginSuccess: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.Token = action.payload.Token;
      state.RefreshToken = action.payload.RefreshToken;
    },
    parserToken: (state: IRootState, action: PayloadAction<any>) => {
      state.userId = action.payload.user_id;
      state.phoneNumber = action.payload.phone_number;
      state.role = action.payload.role;
      state.tokenClaims = action.payload;
    },
    logout: (state: IRootState) => {
      state.userId = "";
      state.Token = "";
      state.RefreshToken = "";
      state.isLoggedIn = false;
      state.role = "";
      state.phoneNumber = "";
      state.tokenClaims = {} as TokenClaims;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  parserToken,
  logout,
  autoLoginRequest,
} = authSlice.actions;
export const selectAuth = (state: { auth: any }) => state.auth;
export default authSlice.reducer;
