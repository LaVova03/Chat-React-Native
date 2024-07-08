import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataItem {
  id: number;
  name: string;
  description: string;
  date: string;
}

interface DataState {
  data: DataItem[];
  flag: boolean;
}

const initialState: DataState = {
  data: [],
  flag: false,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateDataItem(state, action: PayloadAction<DataItem>) {
      state.data = [action.payload];
    },
    setFlag(state) {
      state.flag = !state.flag;
    },
  },
});

export const { updateDataItem, setFlag } = dataSlice.actions;
export default dataSlice.reducer;
