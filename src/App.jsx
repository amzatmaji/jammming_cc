import React from "react";
import SearchBar from "./Components/SearchBar/SearchBar";
import SearchResult from "./Components/SearchResult/SearchResult";
import Playlist from "./Components/Playlist/Playlist";
import "./App.css";
import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
    <div>
      <SearchBar />
      <div className="main-content">
        <SearchResult />
        <Playlist />
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
