export interface Song {
    _id: string; // Mongoose ID
    songName: string;
    inPlayList: boolean;
    singerName: string;
    likes: number;
    views: number;
    date: number;
    songUrl: string;
    imageUrl: string;
}
