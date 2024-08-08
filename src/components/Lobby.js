import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCardsCount,
  setCurrentPlayer,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
} from "../redux/roomSlice";
import constants from "../constants.json";
import io from "socket.io-client";
import Header from "./Header";
const socket = io.connect(constants.backendUrl);

function Lobby() {
  const room = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(false);
  const handleReady = () => {
    let signal = isReady;
    setIsReady((state) => !state);
    socket.emit("update_ready", {
      roomCode: room.roomCode,
      playerName: room.currentPlayer,
      isReady: !signal,
    });
    let roomMembers = [];
    for (var i = 0; i < room.roomMembers.length; i++) {
      let player = { ...room.roomMembers[i] };
      if (player.playerName === room.currentPlayer) {
        player.isReady = !signal;
      }
      roomMembers.push(player);
    }
    dispatch(setRoomMembers(roomMembers));
    fetch(`${constants.backendUrl}/get-room-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomCode: room.roomCode,
        playerName: room.currentPlayer,
      }),
    }).then((res) => {
      let status = res.status;
      res.json().then((res) => {
        if (status === 200) {
          let room = res.room;
          dispatch(setCardsCount(room.cardsCount));
          dispatch(setRoomCode(room.roomCode));
          dispatch(setRoomMembers(room.roomMembers));
          dispatch(setSets(room.sets));
          dispatch(setScoreBoard(room.scoreBoard));
          dispatch(setCurrentPlayer(res.currentPlayer));
          localStorage.setItem("roomCode", room.roomCode);
          localStorage.setItem("cardsCount", room.cardsCount.toString());
          localStorage.setItem("roomMembers", JSON.stringify(room.roomMembers));
          localStorage.setItem("sets", JSON.stringify(room.sets));
          localStorage.setItem("scoreBoard", JSON.stringify(room.scoreBoard));
          localStorage.setItem("currentPlayer", res.currentPlayer);
          let signal = true;
          for (var i = 0; i < room.roomMembers.length; i++) {
            signal = signal & room.roomMembers[i].isReady;
          }
          if (signal && room.roomMembers.length > 2) {
            let gotoPlayGround = () => navigate("/play-ground");
            gotoPlayGround();
          }
        } else {
          console.log(res.message);
        }
      });
    });
  };

  const joinGame = () => {
    let localRoom = {
      roomCode: localStorage.getItem("roomCode"),
      cardsCount: Number(localStorage.getItem("cardsCount")),
      roomMembers: JSON.parse(localStorage.getItem("roomMembers")),
      sets: JSON.parse(localStorage.getItem("roomMembers")),
      scoreBoard: JSON.parse(localStorage.getItem("scoreBoard")),
      currentPlayer: localStorage.getItem("currentPlayer"),
    };
    socket.emit("join_room", {
      roomCode: localRoom.roomCode,
      playerName: localRoom.currentPlayer,
    });
  };

  useEffect(() => {
    let signal = false;
    for (var i = 0; i < room.roomMembers.length; i++) {
      if (room.currentPlayer === room.roomMembers[i].playerName) {
        signal = room.roomMembers[i].isReady;
        break;
      }
    }
    setIsReady(signal);
  }, [room]);

  useEffect(() => {
    let gotoHome = () => navigate("/");
    let localRoom = {
      roomCode: localStorage.getItem("roomCode"),
      cardsCount: Number(localStorage.getItem("cardsCount")),
      roomMembers: JSON.parse(localStorage.getItem("roomMembers")),
      sets: JSON.parse(localStorage.getItem("roomMembers")),
      scoreBoard: JSON.parse(localStorage.getItem("scoreBoard")),
      currentPlayer: localStorage.getItem("currentPlayer"),
    };
    if (!localRoom.roomCode) {
      gotoHome();
    } else {
      fetch(`${constants.backendUrl}/verify-player-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomCode: localRoom.roomCode,
          playerName: localRoom.currentPlayer,
        }),
      }).then((res) => {
        let status = res.status;
        res.json().then((res) => {
          let room = res.room;
          switch (status) {
            case 410:
              dispatch(setCardsCount(0));
              dispatch(setRoomCode(""));
              dispatch(setRoomMembers([]));
              dispatch(setSets([]));
              dispatch(setScoreBoard([]));
              localStorage.setItem("roomCode", "");
              localStorage.setItem("cardsCount", (0).toString());
              localStorage.setItem("roomMembers", JSON.stringify([]));
              localStorage.setItem("sets", JSON.stringify([]));
              localStorage.setItem("scoreBoard", JSON.stringify([]));
              console.log(res.message);
              gotoHome();
              break;
            case 411:
              dispatch(setCardsCount(room.cardsCount));
              dispatch(setRoomCode(room.roomCode));
              dispatch(setRoomMembers(room.roomMembers));
              dispatch(setSets(room.sets));
              dispatch(setScoreBoard(room.scoreBoard));
              dispatch(setCurrentPlayer(""));
              localStorage.setItem("roomCode", room.roomCode);
              localStorage.setItem("cardsCount", room.cardsCount.toString());
              localStorage.setItem(
                "roomMembers",
                JSON.stringify(room.roomMembers)
              );
              localStorage.setItem("sets", JSON.stringify(room.sets));
              localStorage.setItem(
                "scoreBoard",
                JSON.stringify(room.scoreBoard)
              );
              localStorage.setItem("currentPlayer", "");
              let gotoPlayerDetails = () => navigate("/player-details");
              gotoPlayerDetails();
              console.log(res.message);
              break;
            case 200:
              dispatch(setCardsCount(room.cardsCount));
              dispatch(setRoomCode(room.roomCode));
              dispatch(setRoomMembers(room.roomMembers));
              dispatch(setSets(room.sets));
              dispatch(setScoreBoard(room.scoreBoard));
              dispatch(setCurrentPlayer(res.currentPlayer));
              localStorage.setItem("roomCode", room.roomCode);
              localStorage.setItem("cardsCount", room.cardsCount.toString());
              localStorage.setItem(
                "roomMembers",
                JSON.stringify(room.roomMembers)
              );
              localStorage.setItem("sets", JSON.stringify(room.sets));
              localStorage.setItem(
                "scoreBoard",
                JSON.stringify(room.scoreBoard)
              );
              localStorage.setItem("currentPlayer", res.currentPlayer);
              console.log(res.message);
              joinGame();
              break;
            default:
              console.log(res.message);
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    socket.on("room_update", (data) => {
      let room = data.room;
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
      if (data.isGameStart) {
        let gotoPlayGround = () => navigate("/play-ground");
        gotoPlayGround();
      }
      let signal = true;
      for (var i = 0; i < room.roomMembers.length; i++) {
        signal = signal & room.roomMembers[i].isReady;
      }
      if (signal && room.roomMembers.length > 2) {
        let gotoPlayGround = () => navigate("/play-ground");
        gotoPlayGround();
      }
    });
  }, [socket]);

  return (
    <div style={styles.container}>
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center gap-2 p-2">
        <p className="text-lg font-mono font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-md shadow-sm">
          Room Code : {room.roomCode}
        </p>
        <button
          type="button"
          onClick={handleReady}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
        >
          {isReady ? "Set to Un-Ready" : "Set to Ready"}
        </button>
        <p className="block text-sm font-medium text-gray-700 mb-1 px-2">
          Game suto-starts once all players are ready and count more than two.
        </p>
        <div className="flex-1 flex flex-col justify-start items-center gap-2">
          {room.roomMembers.map((player, index) => (
            <p
              key={index}
              className={
                player.isReady
                  ? "w-64 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md "
                  : "w-64 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-md "
              }
            >
              {player.playerName} - {player.isReady ? `Ready` : `Unready`}
            </p>
          ))}
        </div>
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

export default Lobby;
