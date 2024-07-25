import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Song } from '../../Types/song.type';
import DrawSong from '../Song/DrawSong';
import SongComp from '../Song/SongComp';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'grey',
  '&:hover': {
    backgroundColor: 'grey',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid white',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchComponent: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false); // State to track if search has been performed
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // State to track initial load
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSearched(false);
    setInitialLoad(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearched(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/search?query=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Song[] = await response.json();
      setSearchResults(data);
      setSearched(true); // Update state to indicate search has been performed
      console.log('Searching for:', searchQuery);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }

  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleKeyPress = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  return (
    <div>
      <Search>
        <SearchIconWrapper onClick={handleSearch}>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </Search>
      <div>
        {searched && searchResults.length === 0 && (
          <p>No results found for "{searchQuery}". Try searching within quotes.</p>
        )}
        {searched && <DrawSong songs={searchResults} onSongSelect={handleSongSelect} />}
        {selectedSong && <SongComp song={selectedSong} />}
      </div>
    </div>
  );
}

export default SearchComponent;
