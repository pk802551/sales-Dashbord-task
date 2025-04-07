import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchCustomerTypeData } from "../Services/api"

export const getCustomerTypeData = createAsyncThunk("customerType/getCustomerTypeData", async () => {
  const response = await fetchCustomerTypeData()
  return response
})

const initialState = {
  data: [],
  summary: {},
  loading: false,
  error: null,
}

const customerTypeSlice = createSlice({
  name: "customerType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerTypeData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomerTypeData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.summary = action.payload.summary
      })
      .addCase(getCustomerTypeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default customerTypeSlice.reducer

