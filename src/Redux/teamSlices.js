import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchTeamData } from "../Services/api"

export const getTeamData = createAsyncThunk("team/getTeamData", async () => {
  const response = await fetchTeamData()
  return response
})

const initialState = {
  data: [],
  summary: {},
  loading: false,
  error: null,
}

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeamData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getTeamData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.summary = action.payload.summary
      })
      .addCase(getTeamData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default teamSlice.reducer

