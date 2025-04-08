import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTeam } from "../Services/api";

export const getTeamData = createAsyncThunk(
  "team/getData",
  async () => {
    const response = await fetchTeam();
    return response.data.result.data.result;
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState: {
    data: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeamData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeamData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getTeamData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default teamSlice.reducer;
