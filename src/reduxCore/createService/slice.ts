import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  UserId: string;
  PhoneNumber: string;
  Fullname: string;
  Email: string;
  Gender: number;
  DateOfBirth: string;
  Province: string;
  District: string;
  Ward: string;
  DetailAddress: string;
  MembershipClass: string;
  Roles: string;
  valueInfo?: string;
}

export interface IRootState {
  loading: boolean;
  data: User[];
  service: any[];
  purchase: any[];
  products: any[];
  spaServices: any[];
  mySpas: any[];
}

const initialState: IRootState = {
  loading: false,
  data: [],
  service: [],
  purchase: [],
  products: [],
  spaServices: [],
  mySpas: [],
};

export const createServiceSlice = createSlice({
  name: "createService",
  initialState,
  reducers: {
    getUserRequest: (state: IRootState, action: PayloadAction<string>) => {
      state.loading = true;
    },
    getUserSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.data = action.payload;
    },

    getServiceRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
      state.service = [];
    },
    getServiceSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.service = action.payload;
    },

    getPurchaseRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
      state.purchase = [];
    },
    getPurchaseSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.purchase = action.payload;
    },

    getProductRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
    },
    getProductSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.products = action.payload;
    },

    getSpaServicesRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
    },
    getSpaServicesSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.spaServices = action.payload;
    },

    getLocationMySpasRequest: (state: IRootState) => {
      state.mySpas = [];
    },
    getLocationMySpasSuccess: (state: IRootState, action: PayloadAction<any[]>) => {
      state.mySpas = action.payload;
    }
  },
});

export const {
  getUserRequest,
  getUserSuccess,
  getServiceRequest,
  getServiceSuccess,
  getPurchaseRequest,
  getPurchaseSuccess,
  getProductRequest,
  getProductSuccess,
  getSpaServicesRequest,
  getSpaServicesSuccess,
  getLocationMySpasRequest,
  getLocationMySpasSuccess,
} = createServiceSlice.actions;
export const selectCreateService = (state: { createService: any }) =>
  state.createService;
export default createServiceSlice.reducer;
