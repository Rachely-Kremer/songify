export interface Song {
    _id: string; // Mongoose ID
    songName: string;
    inPlayList: boolean;
    singerName: string;
    likes: boolean;
    views: number;
    date: number;
    songUrl: string;
    imageUrl: string;
}
