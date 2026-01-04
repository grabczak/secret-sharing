import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore, type TypedUseSelectorHook } from "react-redux";

import { sharingSlice } from "@/store/sharing";

const rootReducer = combineReducers({
  sharing: sharingSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore<RootState>;
