import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TState = {
  threshold: number;
  shares: string[];
  secret: string;
  reconstructedSecret: string;
};

const initialState: TState = {
  threshold: 3,
  shares: ["", "", ""],
  secret: "",
  reconstructedSecret: "",
};

export const sharingSlice = createSlice({
  name: "sharing",
  initialState,
  reducers: {
    decrementShares: (state) => {
      state.shares = state.shares.slice(0, -1);
      state.threshold = Math.min(state.shares.length - 1, state.threshold);
    },
    incrementShares: (state) => {
      state.shares = [...state.shares, ""];
    },
    decrementThreshold: (state) => {
      state.threshold = state.threshold - 1;
    },
    incrementThreshold: (state) => {
      state.threshold = state.threshold + 1;
    },
    setSecret: (state, action: PayloadAction<{ secret: string }>) => {
      state.secret = action.payload.secret;
    },
    setShares: (state, action: PayloadAction<{ shares: string[] }>) => {
      state.shares = action.payload.shares;
    },
    setShare: (state, action: PayloadAction<{ index: number; share: string }>) => {
      const { index, share } = action.payload;
      state.shares = state.shares.map((s, i) => (i === index ? share : s));
    },
    clearShares: (state) => {
      state.shares = state.shares.map(() => "");
    },
    setReconstructedSecret: (state, action: PayloadAction<{ reconstructedSecret: string }>) => {
      state.reconstructedSecret = action.payload.reconstructedSecret;
    },
  },
});

export const {
  clearShares,
  decrementShares,
  decrementThreshold,
  incrementShares,
  incrementThreshold,
  setReconstructedSecret,
  setSecret,
  setShare,
  setShares,
} = sharingSlice.actions;
