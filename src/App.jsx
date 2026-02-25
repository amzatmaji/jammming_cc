import React, { useEffect, useState } from "react";
import SearchBar from "./Components/SearchBar/SearchBar";
import SearchResult from "./Components/SearchResult/SearchResult";
import Playlist from "./Components/Playlist/Playlist";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import { accessSpotify, getAccessToken, handleAuthCallback } from "./spotify";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const existingToken = getAccessToken();
      if (existingToken) {
        setAccessToken(existingToken);
      }

      const params = new URLSearchParams(window.location.search);
      const hasCode = params.has("code");

      if (hasCode) {
        const token = await handleAuthCallback();
        if (token) {
          setAccessToken(token);
        }
      }
    };
    handleCallback();
  }, []);

  const handleConnect = () => {
    accessSpotify();
  };

  return (
    <div>
      <SearchBar accessToken={accessToken} onAccessSpotify={handleConnect} />
      <div className="main-content hidden">
        <SearchResult />
        <Playlist />
      </div>

      <Footer />
    </div>
  );
};

export default App;
