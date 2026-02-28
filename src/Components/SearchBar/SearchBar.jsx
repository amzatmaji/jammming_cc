import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onAccessSpotify, accessToken, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim() && accessToken) {
      onSearch(searchTerm);
    }
  }
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div className="searchBar">
      <h1>
        Ja<span>mmm</span>ing
      </h1>
      {!accessToken ? (
        <button type="button" onClick={onAccessSpotify} className="btn">
          Connect to Spotify
        </button>
      ) : (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="searchInput"
            placeholder="Enter a song, artist, or album"
            onChange={handleChange}
          />
          <button type="submit" className="btn searchButton">Search</button>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
