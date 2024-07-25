import { Song } from "./song.type";


export interface Playlist {
  name: string;
  _id: string;
  songs: Song[];
  numberPlaylist: string;
}
