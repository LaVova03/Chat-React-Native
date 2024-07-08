// src/redux/reducers.ts
import { combineReducers } from "@reduxjs/toolkit";
import allReducer from "./slices/AllSlice";

const rootReducer = combineReducers({
  data: allReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
