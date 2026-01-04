import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TState = {
  threshold: number;
  shares: string[];
  secret: string;
  reconstructed: string;
};

const initialState: TState = {
  threshold: 3,
  shares: ["", "", ""],
  secret: "",
  reconstructed: "",
};

export const sharingSlice = createSlice({
  name: "sharing",
  initialState,
  reducers: {
    incrementThreshold: (state) => {
      state.threshold += 1;

      if (state.threshold > state.shares.length) {
        state.shares.push("");
      }
    },
    decrementThreshold: (state) => {
      state.threshold -= 1;
    },
    incrementShares: (state) => {
      state.shares.push("");
    },
    decrementShares: (state) => {
      state.shares.pop();

      if (state.shares.length < state.threshold) {
        state.threshold -= 1;
      }
    },
    setSecret: (state, action: PayloadAction<{ secret: string }>) => {
      state.secret = action.payload.secret;
    },
    setShare: (state, action: PayloadAction<{ index: number; share: string }>) => {
      const { index, share } = action.payload;

      state.shares = state.shares.map((s, i) => (i === index ? share : s));
    },
    setShares: (state, action: PayloadAction<{ shares: string[] }>) => {
      state.shares = action.payload.shares;
    },
    clearShares: (state) => {
      state.shares = state.shares.map(() => "");
    },
    setReconstructed: (state, action: PayloadAction<{ reconstructed: string }>) => {
      state.reconstructed = action.payload.reconstructed;
    },
  },
});

export const {
  incrementThreshold,
  decrementThreshold,
  incrementShares,
  decrementShares,
  setSecret,
  setShare,
  setShares,
  clearShares,
  setReconstructed,
} = sharingSlice.actions;
