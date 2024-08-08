import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import constants from "../constants.json";
import { setCurrentPlayer } from "../redux/roomSlice";
import { useNavigate } from "react-router-dom";
import {
  setCardsCount,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
} from "../redux/roomSlice";
import Header from "./Header";

function PlayerDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const room = useSelector((state) => state.room);
  const [playerName, setPlayerName] = useState("");
  const [response, setResponse] = useState("");
  const [playerCardsSet, setPlayerCardsSet] = useState(() => {
    let l = [];
    for (var i = 0; i < room.cardsCount; i++) {
      l.push(`Card - ${i + 1}`);
    }
    return l;
  });
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    let gotoHome = () => navigate("/");
    let gotoLobby = () => navigate("/lobby");
    localStorage.setItem("currentPlayer", "");
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
              gotoLobby();
              break;
            default:
              console.log(res.message);
          }
        });
      });
    }
  }, []);

  const handlePlayerName = (event) => {
    setPlayerName(event.target.value);
    if (!isTouched) {
      let l = [];
      for (var i = 0; i < room.cardsCount; i++) {
        l.push(`${event.target.value} Card - ${i + 1}`);
      }
      setPlayerCardsSet(l);
    }
  };

  const handleCardName = (event, index) => {
    setIsTouched(true);
    let l = [...playerCardsSet];
    l[index] = event.target.value;
    setPlayerCardsSet(l);
  };

  const joinGame = () => {
    let gotoHome = () => navigate("/");
    let gotoLobby = () => navigate("/lobby");
    fetch(`${constants.backendUrl}/join-game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: playerName,
        playerCardsSet: playerCardsSet,
        roomCode: room.roomCode,
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
          case 200:
            dispatch(setCardsCount(room.cardsCount));
            dispatch(setRoomCode(room.roomCode));
            dispatch(setRoomMembers(room.roomMembers));
            dispatch(setSets(room.sets));
            dispatch(setScoreBoard(room.scoreBoard));
            dispatch(setCurrentPlayer(res.playerName));
            localStorage.setItem("currentPlayer", res.playerName);
            localStorage.setItem("roomCode", room.roomCode);
            localStorage.setItem("cardsCount", room.cardsCount.toString());
            localStorage.setItem(
              "roomMembers",
              JSON.stringify(room.roomMembers)
            );
            localStorage.setItem("sets", JSON.stringify(room.sets));
            localStorage.setItem("scoreBoard", JSON.stringify(room.scoreBoard));
            gotoLobby();
            break;
          case 400:
            setResponse(res.message);
            setTimeout(() => {
              setResponse("");
            }, 3000);
            console.log(res.message);
            break;
          default:
            console.log(res.message);
        }
      });
    });
  };

  return (
    <div style={styles.container}>
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <label className="flex flex-col justify-center items-start">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Player Name
          </span>
          <input
            className="w-full max-w-md sm:max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={playerName}
            maxLength={10}
            onChange={handlePlayerName}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Cards List
          </span>
          {playerCardsSet.map((card, index) => (
            <input
              value={card}
              className="w-full max-w-md sm:max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              key={index}
              maxLength={25}
              onChange={(event) => {
                handleCardName(event, index);
              }}
            ></input>
          ))}
        </label>
        <button
          className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
          onClick={joinGame}
        >
          Join Game
        </button>
        {response ? (
          <p className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg animate-slide-in-out">
            {response}
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

export default PlayerDetails;
