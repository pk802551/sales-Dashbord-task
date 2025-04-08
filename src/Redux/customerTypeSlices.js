import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomerType } from "../Services/api";

export const getCustomerTypeData = createAsyncThunk(
  "customerType/getData",
  async () => {
    const response = await fetchCustomerType();
    return response.data.result.data.result;
  }
);

const customerTypeSlice = createSlice({
  name: "customerType",
  initialState: {
    data: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerTypeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerTypeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCustomerTypeData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerTypeSlice.reducer;
