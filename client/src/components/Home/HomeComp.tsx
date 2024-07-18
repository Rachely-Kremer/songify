import SongComp from '../Song/SongComp';
import DrawSong from '../Song/DrawSong';
import './home.css';

const HomeComp = () => {
    return (
        <div className="home-container">
            <h1>.שמע את זה. רואים את זה. חיה את זה</h1>
            <DrawSong songs={[]} />
            <SongComp />

        </div>
    )
}
export default HomeComp;