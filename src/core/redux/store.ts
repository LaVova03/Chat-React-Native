import { configureStore } from "@reduxjs/toolkit";
import allReducer from "./slices/AllSlice";

const store = configureStore({
  reducer: {
    data: allReducer,
  },
});

export default store;
