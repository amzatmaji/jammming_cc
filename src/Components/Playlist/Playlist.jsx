import { useState } from "react";
import "./Playlist.css";

const Playlist = ({ playlistTracks, onSave, onRemove, accessToken, isSaving }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isSaving) return;
    const trackUris = playlistTracks.map((track) => track.uri);
    if (!playlistName.trim() || !trackUris.length || !accessToken) return;
    onSave(playlistName.trim(), trackUris);
  };

  return (
    <div className="playlist">
      <form onSubmit={handleSave}>
        <input
          value={playlistName}
          onChange={handlePlaylistNameChange}
          type="text"
          placeholder="Playlist Name"
          disabled={isSaving}
        />
        <button
          type="submit"
          disabled={!playlistTracks.length || !accessToken || !playlistName.trim() || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save to Spotify'}
        </button>
      </form>
      <div className="playlist-list">
        {playlistTracks.map((track) => (
          <div key={track.id} className="track">
            <img src={track.albumArt} alt={track.album} />
            <div className="track-info">
              <h3>{track.name}</h3>
              <p>{track.artist} | {track.album}</p>
            </div>
            <button type="button" onClick={() => onRemove(track)}>-</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
