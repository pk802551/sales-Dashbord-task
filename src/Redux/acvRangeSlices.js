import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
 import {fetchACVRange} from "../Services/api"
import axios from "axios"

// Async thunk for fetching ACV range data
export const getACVTypeData = createAsyncThunk(
  "acvRange/getData",
  async () => {
    const response = await fetchACVRange();
    return response.data.result.data.result;
  }
);

const acvRangeSlice = createSlice({
  name: "acvRange",
  initialState: {
    data: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getACVTypeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getACVTypeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getACVTypeData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default acvRangeSlice.reducer
