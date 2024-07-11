import { useState, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Song } from '../../Types/song.type';


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

export default function SearchComponent() {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearch = useCallback(async () => {
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
      console.log('Searching for:', searchQuery);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, [searchQuery]);


  const handleKeyPress = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

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
        {searchResults.map((song) => (
          <div key={song._id}>
            <h4>{song.songName}</h4>
            <p>{song.singerName}</p>
            <p>{song.likes} Likes</p>
            <p>{song.views} Views</p>
            <p>{new Date(song.date).toLocaleDateString()}</p>
            <audio controls src={song.songUrl}></audio>
            <img src={song.imageUrl} alt={song.songName} style={{ width: '100px', height: '100px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
