import { configureStore } from "@reduxjs/toolkit";
import roomSlice from "./roomSlice";
// import registerReducer from "./registerSlice";
// import loginReducer from "./loginSlice";
// import documentsReducer from "./documentsSlice";

const store = configureStore({
  reducer: {
    room: roomSlice,
  },
});

export default store;
