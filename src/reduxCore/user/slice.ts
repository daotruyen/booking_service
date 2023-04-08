import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRootState {
  loading: boolean;
  userId: string;
  name: string;
  birthday: string;
  sex: number;
  phone: string;
  email: string;
  address: string;
  province: {};
  district: {};
  ward: {};
  memberShip: string;
}

const initialState: IRootState = {
  loading: false,
  userId: "",
  name: "",
  birthday: "",
  sex: 0,
  phone: "",
  email: "",
  address: "",
  province: {},
  district: {},
  ward: {},
  memberShip: '',
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
    },

    getUserSuccess: (state: IRootState, action: PayloadAction<any>) => {
      state.name = action.payload.Fullname;
      state.birthday = action.payload.DateOfBirth;
      state.sex = action.payload.Gender;
      state.address = action.payload.DetailAddress;
      state.email = action.payload.Email;
      state.phone = action.payload.PhoneNumber;
      state.province = action.payload.Province;
      state.district = action.payload.District;
      state.ward = action.payload.Ward;
      state.memberShip = action.payload.MembershipClass;
    },

    updateUserRequest: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = true;
    },

    updateUserSuccess: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = false;
      state.name = action.payload.Fullname;
      state.birthday = action.payload.DateOfBirth;
      state.sex = action.payload.Gender;
      state.address = action.payload.DetailAddress;
      state.email = action.payload.Email;
      state.phone = action.payload.PhoneNumber;
      state.province = action.payload.Province;
      state.district = action.payload.District;
      state.ward = action.payload.Ward;
    },
    updateUserFail: (state: IRootState, action: PayloadAction<any>) => {
      state.loading = false;
    },
    resetUser: (state: IRootState) => {
      state.name = "";
      state.birthday = "";
      state.sex = 0;
      state.address = "";
      state.email = "";
      state.phone = "";
      state.province = {};
      state.district = {};
      state.ward = {};
    }
  },
});

export const {
  getUserRequest,
  getUserSuccess,
  updateUserRequest,
  updateUserSuccess,
  resetUser,
} = userSlice.actions;
export const selectUser = (state: { user: any }) => state.user;
export default userSlice.reducer;
