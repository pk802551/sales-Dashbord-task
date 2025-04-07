import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchACVRangeData } from "../Services/api"

export const getACVRangeData = createAsyncThunk("acvRange/getACVRangeData", async () => {
  const response = await fetchACVRangeData()
  return response
})

const initialState = {
  data: [],
  summary: {},
  loading: false,
  error: null,
}

const acvRangeSlice = createSlice({
  name: "acvRange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getACVRangeData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getACVRangeData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.summary = action.payload.summary
      })
      .addCase(getACVRangeData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default acvRangeSlice.reducer

