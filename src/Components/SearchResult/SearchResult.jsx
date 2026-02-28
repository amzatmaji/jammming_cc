import './SearchResult.css'

const SearchResult = ({ searchRes, onAddTrack }) => {
  const tracks = Array.isArray(searchRes) ? searchRes : [];
  return (
    <div className="searchResult">
      <h1>Results</h1>
      <div className="tracklist">
        {tracks.map((track) => (
          <div key={track.id} className="track">
            <img src={track.albumArt} alt="" />
            <div className="track-info">
              <h3>{track.name}</h3>
              <p>{track.artist} | {track.album}</p>
            </div>
            <button type="button" onClick={() => onAddTrack(track)}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult