import React from 'react'
import './SearchBar.css'
const SearchBar = () => {
  return (
    <div className='searchBar'>
      <h1>Ja<span>mmm</span>ing</h1>
      <button className="btn">Connect to Spotify</button>
      <form className=''>
        <input type="text" className="searchInput" placeholder='Enter a song, artist, or album' />
        <button className="btn searchButton">Search</button>
      </form>
    </div>
  )
}

export default SearchBar