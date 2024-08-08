import React, { useState } from "react";
import constants from "../constants.json";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCardsCount,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
} from "../redux/roomSlice";
import Header from "./Header";
function CreateRoom() {
  const [count, setCount] = useState(4);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateRoom = () => {
    fetch(`${constants.backendUrl}/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardsCount: count }),
    }).then((res) => {
      let status = res.status;
      res.json().then((res) => {
        if (status === 200) {
          let room = res.room;
          console.log(room);
          dispatch(setCardsCount(room.cardsCount));
          dispatch(setRoomCode(room.roomCode));
          dispatch(setRoomMembers(room.roomMembers));
          dispatch(setSets(room.sets));
          dispatch(setScoreBoard(room.scoreBoard));
          localStorage.setItem("roomCode", room.roomCode);
          localStorage.setItem("cardsCount", room.cardsCount.toString());
          localStorage.setItem("roomMembers", JSON.stringify(room.roomMembers));
          localStorage.setItem("sets", JSON.stringify(room.sets));
          localStorage.setItem("scoreBoard", JSON.stringify(room.scoreBoard));
          let gotoPlayerDetails = () => navigate("/player-details");
          gotoPlayerDetails();
        } else {
          setResponseMessage(res.message);
        }
      });
    });
  };

  return (
    <div style={styles.container}>
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <p className="text-lg">How many cards are in a set?</p>
        <div className="flex justify-center items-center gap-2 p-3">
          <input
            type="number"
            value={count}
            className="w-full max-w-md sm:max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(event) => {
              setCount(Number(event.target.value));
            }}
          />
          <button
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
            onClick={handleCreateRoom}
          >
            Create
          </button>
        </div>
        {responseMessage ? (
          <p className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg animate-slide-in-out">
            {responseMessage}
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
};

export default CreateRoom;
