import * as React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import QueueMusicOutlinedIcon from '@mui/icons-material/QueueMusicOutlined';
import HomeIcon from '@mui/icons-material/Home';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { RiSearchLine, RiSearchFill } from 'react-icons/ri';
import SearchComponent from '../Search/SearchComponent';
import Popular from '../Popular';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import HomeComp from '../Home/HomeComp';
import PlaylistComp from '../Playlist/PlaylistComp';
import ChatIcon from '@mui/icons-material/Chat';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ChatComp from '../Chat/Chat';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  // width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // transition: theme.transitions.create(['width', 'margin'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    // width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

type IconState = {
  icon: React.ReactElement;
  activeIcon: React.ReactElement;
  isActive: boolean;
};

type IconsStateType = {
  Home: IconState;
  Search: IconState;
  Playlist: IconState;
  GameChat: IconState;
  Popular: IconState;
};

type IconName = keyof IconsStateType;

const HomeComponent = React.memo(HomeComp);
const SearchComponentMemo = React.memo(SearchComponent);
const PlaylistComponentMemo = React.memo(PlaylistComp);
const GameChatComponentMemo = React.memo(ChatComp);
const PopularComponentMemo = React.memo(Popular);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true); // Set default to open
  const [currentComponent, setCurrentComponent] = React.useState<IconName>('Home');
  const navigate = useNavigate();

  const [iconsState, setIconsState] = React.useState<IconsStateType>({
    Home: { icon: <HomeOutlinedIcon />, activeIcon: <HomeIcon />, isActive: true },
    Search: { icon: <RiSearchLine />, activeIcon: <RiSearchFill />, isActive: false },
    Playlist: { icon: <QueueMusicOutlinedIcon />, activeIcon: <QueueMusicIcon />, isActive: false },
    GameChat: { icon: <ChatOutlinedIcon />, activeIcon: <ChatIcon />, isActive: false },
    Popular: { icon: <LocalFireDepartmentOutlinedIcon />, activeIcon: <LocalFireDepartmentIcon />, isActive: false },
  });

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleIconClick = (iconName: IconName) => {
    setCurrentComponent(iconName);
    setIconsState(prevState => {
      const newState = { ...prevState };
      for (const key in newState) {
        newState[key as IconName].isActive = key === iconName;
      }
      return newState;
    });
    navigate(iconName.toLowerCase());
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {Object.entries(iconsState).map(([text, { icon, activeIcon, isActive }]) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => handleIconClick(text as IconName)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  color: theme.palette.text.primary,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: theme.palette.text.primary,
                  }}
                >
                  {isActive ? activeIcon : icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, color: theme.palette.text.primary }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default, borderRadius: '8px' }}>
        <DrawerHeader />
        {currentComponent === 'Home' && <HomeComponent />}
        {currentComponent === 'Search' && <SearchComponentMemo />}
        {currentComponent === 'Playlist' && <PlaylistComponentMemo />}
        {currentComponent === 'GameChat' && <GameChatComponentMemo />}
        {currentComponent === 'Popular' && <PopularComponentMemo />}
      </Box>
    </Box>
  );
}
