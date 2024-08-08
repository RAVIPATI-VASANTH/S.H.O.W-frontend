import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import constants from "../constants.json";
import { useDispatch } from "react-redux";

import {
  setCardsCount,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
} from "../redux/roomSlice";
const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [responseMessage, setResponseMessage] = useState("");

  const [currentRoomCode, setCurrentRoomCode] = useState("");
  const handleJoinRoom = () => {
    fetch(`${constants.backendUrl}/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomCode: currentRoomCode.toString().trim() }),
    }).then((res) => {
      let status = res.status;
      res.json().then((res) => {
        console.log(status);
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
          setTimeout(() => {
            setResponseMessage("");
          }, 3000);
        }
      });
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading} className="text-6xl font-bold">
        S.H.O.W
      </h1>
      <div
        style={styles.buttonContainer}
        className="flex items-center justify-center"
      >
        <div className="flex justify-center items-center gap-2 min-w-screen px-2">
          <input
            type="text"
            maxLength={4}
            className="w-full max-w-md sm:max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter room code"
            onChange={(event) => {
              setCurrentRoomCode(event.target.value);
            }}
            value={currentRoomCode}
            style={styles.input}
          />
          <button
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
            style={styles.button}
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>
        <div className="flex justify-center items-center">
          <button
            style={styles.button}
            onClick={() => {
              navigate("/create-room");
            }}
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          >
            Create Room
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
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

export default LandingPage;
