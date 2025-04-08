import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
 import {fetchAccountIndustry} from "../Services/api"
import axios from "axios"

// Async thunk for fetching ACV range data
export const getAccountIndustryData = createAsyncThunk(
  "accountIndustry/getData",
  async () => {
    const response = await fetchAccountIndustry();
    return response.data.result.data.result;
  }
);

const accountIndustrySlice = createSlice({
  name: "accountIndustry",
  initialState: {
    data: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountIndustryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccountIndustryData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAccountIndustryData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default accountIndustrySlice.reducer
