import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomCode: "",
  cardsCount: 4,
  roomMembers: [],
  sets: [],
  scoreBoard: [],
  currentPlayer: "",
  isGameStart: false,
  game: {},
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomCode: (state, action) => {
      state.roomCode = action.payload;
    },
    setCardsCount: (state, action) => {
      state.cardsCount = action.payload;
    },
    setRoomMembers: (state, action) => {
      state.roomMembers = [...action.payload];
    },
    setSets: (state, action) => {
      state.sets = [...action.payload];
    },
    setScoreBoard: (state, action) => {
      state.scoreBoard = [...action.payload];
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    setIsGameStart: (state, action) => {
      state.isGameStart = action.payload;
    },
    setGame: (state, action) => {
      state.game = { ...action.payload };
    },
  },
});

export const {
  setCardsCount,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
  setCurrentPlayer,
  setIsGameStart,
  setGame,
} = roomSlice.actions;
export default roomSlice.reducer;
