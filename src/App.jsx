import { useEffect, useState } from "react";
import SearchBar from "./Components/SearchBar/SearchBar";
import SearchResult from "./Components/SearchResult/SearchResult";
import Playlist from "./Components/Playlist/Playlist";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import {
  accessSpotify,
  getAccessToken,
  handleAuthCallback,
  search,
  savePlaylist
} from "./spotify";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [playlistKey, setPlaylistKey] = useState(0);

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

  const handleSearch = async (term) => {
    if (!accessToken) {
      return;
    }
    setHasSearched(true);
    setIsSearching(true);
    try {
      const results = await search(term, accessToken);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching for tracks:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTrack = (track) => {
    // Check if track is already in playlist
    if (playlistTracks.some(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks(prev => [...prev, track]);
  };

  const handleRemoveTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(savedTrack => savedTrack.id !== track.id));
  };

  const handleSavePlaylist = async (playlistName, trackUris) => {
    if (!accessToken) return;

    setIsSaving(true);
    try {
      const success = await savePlaylist(playlistName, trackUris, accessToken);
      if (success) {
        setPlaylistTracks([]);
        setSearchResults([]);
        setHasSearched(false);
        setPlaylistKey((k) => k + 1);
        alert('Playlist saved successfully to Spotify!');
      } else {
        alert('Failed to save playlist. Please try again.');
      }
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Failed to save playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="app-wrapper">
      <SearchBar
        key={playlistKey}
        accessToken={accessToken}
        onAccessSpotify={handleConnect}
        onSearch={handleSearch}
      />
      <div className="main-scroll">
      {accessToken && hasSearched && (
        <div className="main-content">
          {isSearching ? (
            <div className="loading">Searching...</div>
          ) : (
            <SearchResult searchRes={searchResults}
            onAddTrack={handleAddTrack} />
          )}
          <Playlist
            key={playlistKey}
            playlistTracks={playlistTracks}
            onSave={handleSavePlaylist}
            onRemove={handleRemoveTrack}
            accessToken={accessToken}
            isSaving={isSaving}
          />
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
