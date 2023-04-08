import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRootState {
  saleOffProgram: Item[];
  hotService: Item[];
  newService: Item[];
  event: Item[];
}

export interface Item {
  Id: number;
  Title: string;
  ArticleGroup: number;
  ArticleGroupName: string;
  ArticleImg: string;
  Content: string;
  IsActive: boolean;
  CreatedDate: string;
}

const initialState: IRootState = {
  saleOffProgram: [],
  hotService: [],
  newService: [],
  event: [],
};

export const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    getArticleRequest: (state: IRootState, action: PayloadAction<any>) => {},
    getArticleSaleOffProgramSuccess: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {
      state.saleOffProgram = action.payload;
    },
    getArticleHotServiceRequest: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {},
    getArticleHotServiceSuccess: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {
      state.hotService = action.payload;
    },
    getArticleEventRequest: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {},
    getArticleEventSuccess: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {
      state.event = action.payload;
    },
    getArticleNewServiceRequest: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {},
    getArticleNewServiceSuccess: (
      state: IRootState,
      action: PayloadAction<any>
    ) => {
      state.newService = action.payload;
    },
  },
});

export const {
  getArticleRequest,
  getArticleSaleOffProgramSuccess,
  getArticleHotServiceRequest,
  getArticleHotServiceSuccess,
  getArticleEventRequest,
  getArticleEventSuccess,
  getArticleNewServiceRequest,
  getArticleNewServiceSuccess,
} = articleSlice.actions;
export const selectArticle = (state: { article: any }) => state.article;
export default articleSlice.reducer;
