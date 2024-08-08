import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import constants from "../constants.json";
import Header from "./Header";

function GameResults() {
  const navigate = useNavigate();
  const [completeGame, setCompleteGame] = useState({});
  const [gameWinner, setGameWinner] = useState({
    nextPlayer: "",
    gameStartsWith: "",
    isChance: false,
    playerCards: [],
    playerName: "",
  });
  const [otherPlayersList, setOtherPlayersList] = useState([]);

  const handleNewGame = () => {
    let gotoLobby = () => navigate("/lobby");
    gotoLobby();
  };

  useEffect(() => {
    let gotoLobby = () => navigate("/lobby");
    let gotoPlayground = () => navigate("/play-ground");
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
            gotoPlayground();
            break;
          case 200:
            console.log(res.message);
            var completeGame = res.completeGame;
            console.log(completeGame);
            var otherPlayers = [];
            for (var i = 0; i < completeGame.sets.length; i++) {
              let l = [];
              for (
                var j = 0;
                j < completeGame.sets[i].playerCards.length;
                j++
              ) {
                l.push(completeGame.sets[i].playerCards[j].groupId);
              }
              let firstItem = l[0];
              let signal = true;
              for (var j = 1; j < l.length; j++) {
                signal = signal & (firstItem === l[j]);
              }
              if (signal) {
                setGameWinner(completeGame.sets[i]);
              } else {
                otherPlayers.push(completeGame.sets[i]);
              }
            }
            setOtherPlayersList(otherPlayers);
            setCompleteGame(res.completeGame);
            break;
          default:
            console.log(res.message);
        }
      });
    });
  }, []);

  console.log(completeGame);
  console.log(gameWinner);
  console.log(otherPlayersList);
  return (
    <div style={styles.container} className="flex-1">
      <Header />
      <div className="flex flex-col gap-2 p-2 items-center justify-center">
        <div className="flex flex-col">
          <p className="w-64 font-semibold bg-green-200 border-l-4 border-r-4 border-green-500 text-green-700 p-4">
            Winner
          </p>
          <div>
            <p className="text-lg text-white font-mono font-semibold bg-green-500 px-4 py-2 rounded-md shadow-sm my-1">
              {gameWinner.playerName}
            </p>
            {gameWinner.playerCards.map((card) => (
              <p className="text-lg font-mono font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-md shadow-sm mb-1 border-l-2 border-r-2 border-t-2 border-b-2 border-green-700">
                {card.cardName}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="w-64 font-semibold bg-yellow-200 border-l-4 border-r-4 border-yellow-500 text-yellow-700 p-4">
            Other Players
          </p>
          {otherPlayersList.map((player) => (
            <div>
              <p className="text-lg text-white font-mono font-semibold bg-yellow-500 px-4 py-2 rounded-md shadow-sm my-1">
                {player.playerName}
              </p>
              {player.playerCards.map((card) => (
                <p className="text-lg font-mono font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-md shadow-sm mb-1 border-l-2 border-r-2 border-t-2 border-b-2 border-yellow-700">
                  {card.cardName}
                </p>
              ))}
            </div>
          ))}
        </div>
        <button
          className=" fixed bottom-4 right-4 px-6 py-2 bg-blue-500 text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out whitespace-nowrap"
          onClick={handleNewGame}
        >
          New game
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "fit",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
    flexGrow: 1,
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

export default GameResults;
