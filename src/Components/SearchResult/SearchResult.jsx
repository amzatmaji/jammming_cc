import React from 'react'
import './SearchResult.css'
import albumImg from '../../assets/album.jpg'

const SearchResult = () => {
  return (
    <div className='searchResult'>
      <h1>Results</h1>
      <div className="tracklist">
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
        <div className="track">
          <img src={albumImg} alt="" />
          <div className="track-info">
            <h3>Song Name</h3>
            <p>Artist Name | Album Name</p>
          </div>
          <button>+</button>
        </div>
      </div> 

    </div>
  )
}

export default SearchResult