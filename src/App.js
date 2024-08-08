import { Provider } from "react-redux";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./redux/store.js";
import LandingPage from "./components/LandingPage";
import CreateRoom from "./components/CreateRoom";
import PlayerDetails from "./components/PlayerDetails.js";
import Lobby from "./components/Lobby.js";
import PlayGround from "./components/PlayGround.js";
import GameResults from "./components/GameResults.js";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/player-details" element={<PlayerDetails />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/play-ground" element={<PlayGround />} />
            <Route path="/game-results" element={<GameResults />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
