import React, { useState } from "react";
import constants from "../constants.json";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCardsCount,
  setCurrentPlayer,
  setRoomCode,
  setRoomMembers,
  setScoreBoard,
  setSets,
  setGame,
} from "../redux/roomSlice";
import io from "socket.io-client";
import Header from "./Header";
const socket = io.connect(constants.backendUrl);

function PlayGround() {
  const room = useSelector((state) => state.room);
  const [processedCardsList, setProcessedCardsList] = useState([]);
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [currentSelectedCard, setCurrentSelectedCard] = useState({
    cardName: "",
  });
  const [isChance, setIsChance] = useState(false);
  const [currentChance, setCurrentChance] = useState("");
  const [response, setResponse] = useState("");
  const [cardsCountRequired, setCardsCountRequired] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadGameData = () => {
    let gotoLobby = () => navigate("/lobby");
    let localRoom = {
      roomCode: localStorage.getItem("roomCode"),
      cardsCount: Number(localStorage.getItem("cardsCount")),
      roomMembers: JSON.parse(localStorage.getItem("roomMembers")),
      sets: JSON.parse(localStorage.getItem("roomMembers")),
      scoreBoard: JSON.parse(localStorage.getItem("scoreBoard")),
      currentPlayer: localStorage.getItem("currentPlayer"),
    };
    fetch(`${constants.backendUrl}/get-game-update`, {
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
        switch (status) {
          case 400:
            gotoLobby();
            break;
          case 401:
            gotoLobby();
            break;
          case 200:
            let game = res.game;
            dispatch(setGame(game));
            if (game.gameStartsWith === game.playerName) {
              setCardsCountRequired(room.cardsCount);
            } else {
              setCardsCountRequired(room.cardsCount + 1);
            }
            setProcessedCardsList(sortCardsByName([...game.playerCards]));
            setIsChance(game.isChance);
            setCurrentChance(res.currentChance);
            break;
          default:
            console.log(res.message);
        }
      });
    });
  };

  const getCompleteGame = () => {
    let gotoLobby = () => navigate("/lobby");
    let localRoom = {
      roomCode: localStorage.getItem("roomCode"),
      cardsCount: Number(localStorage.getItem("cardsCount")),
      roomMembers: JSON.parse(localStorage.getItem("roomMembers")),
      sets: JSON.parse(localStorage.getItem("roomMembers")),
      scoreBoard: JSON.parse(localStorage.getItem("scoreBoard")),
      currentPlayer: localStorage.getItem("currentPlayer"),
    };
    fetch(`${constants.backendUrl}/get-complete-game-data`, {
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
        switch (status) {
          case 400:
            gotoLobby();
            break;
          case 401:
            gotoLobby();
            break;
          case 403:
            console.log(res.message);
            loadGameData();
            break;
          case 200:
            let gotoGameResults = () => navigate("/game-results");
            gotoGameResults();
            break;
          default:
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
    socket.emit("join_play_ground", {
      roomCode: localRoom.roomCode,
      playerName: localRoom.currentPlayer,
    });
    loadGameData();
    getCompleteGame();
  };

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

  function sortCardsByName(cardsArray) {
    return cardsArray.sort((a, b) => {
      if (a.cardName < b.cardName) {
        return -1;
      }
      if (a.cardName > b.cardName) {
        return 1;
      }
      return 0;
    });
  }

  useEffect(() => {
    socket.on("send_to_next_player_response", (data) => {
      console.log("send to next player reponse invoke");
      loadGameData();
    });

    socket.on("join_play_ground_response", (data) => {
      console.log("load game data play gorund reponse ");
      loadGameData();
    });

    socket.on("send_and_declare_show_response", (data) => {
      console.log(" send_and_declare_show_response invokes");
      getCompleteGame();
    });
  }, [socket]);

  const handleCardSelect = (event) => {
    setCurrentSelectedCard(JSON.parse(event.target.value));
    setIsCardSelected(true);
  };

  const sendToNextplayer = () => {
    console.log("sendto next player invoked");
    socket.emit("send_to_next_player", {
      roomCode: room.roomCode,
      card: currentSelectedCard,
      playerName: room.game.playerName,
      nextPlayer: room.game.nextPlayer,
    });
    loadGameData();
    setCurrentSelectedCard({ cardName: "" });
    setIsCardSelected(false);
  };

  const declareShow = () => {
    console.log("hello declare show invoked");
    let localRoom = {
      roomCode: localStorage.getItem("roomCode"),
      cardsCount: Number(localStorage.getItem("cardsCount")),
      roomMembers: JSON.parse(localStorage.getItem("roomMembers")),
      sets: JSON.parse(localStorage.getItem("roomMembers")),
      scoreBoard: JSON.parse(localStorage.getItem("scoreBoard")),
      currentPlayer: localStorage.getItem("currentPlayer"),
    };
    socket.emit("send_and_declare_show", {
      roomCode: localRoom.roomCode,
      card: currentSelectedCard,
      playerName: room.game.playerName,
      nextPlayer: room.game.nextPlayer,
    });
    setCurrentSelectedCard({ cardName: "" });
    setIsCardSelected(false);
    getCompleteGame();
    fetch(`${constants.backendUrl}/get-error-reponse`, {
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
        switch (status) {
          case 200:
            setResponse(res.message);
            setTimeout(() => {
              setResponse("");
            }, 2500);
            break;
          case 400:
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
      <div className="flex flex-col gap-2 p-2 items-center justify-center">
        <p
          // className="text-lg font-mono font-semibold text-black  px-4 py-2 "
          className="w-64 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        >
          Playing as - {room.game.playerName}
        </p>
        <div className="flex flex-col gap-1 justify-center items-start">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Your cards
          </span>
          {processedCardsList.map((card, index) => (
            <label
              key={index}
              style={{
                backgroundColor: card.colorCode,
              }}
              className="flex justify-center items-center gap-2 text-lg font-mono font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-md shadow-sm hover:cursor-pointer"
            >
              <input
                name={room.game.playerName}
                disabled={!isChance}
                className={
                  "w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                }
                value={JSON.stringify(card)}
                onClick={handleCardSelect}
                checked={currentSelectedCard.cardName === card.cardName}
                type="radio"
              />
              <p>{card.cardName}</p>
            </label>
          ))}
        </div>

        <button
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
          disabled={!isCardSelected}
          onClick={sendToNextplayer}
        >
          Send to - {room.game.nextPlayer}
        </button>
        <p
          // className="text-lg font-mono font-semibold text-white bg-secondary px-4 py-2 rounded-md shadow-sm"
          className="w-64 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        >
          Current Chance - {currentChance}
        </p>
        <button
          className="px-6 py-2 bg-green-500 text-white font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
          onClick={declareShow}
        >
          Send and Declare SHOW
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

export default PlayGround;
