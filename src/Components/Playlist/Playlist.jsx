import React from "react";
import "./Playlist.css";
import albumImg from "../../assets/album.jpg";
const Playlist = () => {
  return (
    <div className="playlist">
      <form>
        <input type="text" placeholder="Playlist Name" />
        <button>Save to Spotify</button>
      </form>
      <div className="playlist-list">
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>-</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>-</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>-</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>-</button>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
