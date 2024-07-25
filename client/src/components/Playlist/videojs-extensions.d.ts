import videojs from 'video.js';

declare module 'video.js' {
  export interface Player {
    playlist: (playlist: videojs.PlaylistItem[]) => void;
    playlistUi: () => void;
  }
}

declare module 'videojs-playlist' {
  import videojs from 'video.js';
  const videojsPlaylist: (player: videojs.Player, playlist: videojs.PlaylistItem[]) => void;
  export default videojsPlaylist;
}

declare module 'videojs-playlist-ui' {
  import videojs from 'video.js';
  const videojsPlaylistUi: (player: videojs.Player) => void;
  export default videojsPlaylistUi;
}
