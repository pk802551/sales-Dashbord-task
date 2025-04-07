import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchAccountIndustryData } from "../Services/api"

export const getAccountIndustryData = createAsyncThunk("accountIndustry/getAccountIndustryData", async () => {
  const response = await fetchAccountIndustryData()
  return response
})

const initialState = {
  data: [],
  summary: {},
  loading: false,
  error: null,
}

const accountIndustrySlice = createSlice({
  name: "accountIndustry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountIndustryData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAccountIndustryData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.summary = action.payload.summary
      })
      .addCase(getAccountIndustryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default accountIndustrySlice.reducer

