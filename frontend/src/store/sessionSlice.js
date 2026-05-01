import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: Math.random().toString(36).substring(2, 15),
  country: 'IN',
  electionType: 'general',
  userLevel: 'beginner'
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setElectionType: (state, action) => {
      state.electionType = action.payload;
    },
    setUserLevel: (state, action) => {
      state.userLevel = action.payload;
    }
  }
});

export const { setCountry, setElectionType, setUserLevel } = sessionSlice.actions;
export default sessionSlice.reducer;
