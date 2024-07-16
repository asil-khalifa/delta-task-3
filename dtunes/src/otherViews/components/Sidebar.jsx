import { NavLink } from "react-router-dom"
import { assets } from "../assets/artist/assets"
import SidebarButtons from "./SidebarButtons"

export default function Sidebar() {

    const dtunesStorage = localStorage.getItem('dtunesStorage');
    let loggedIn = false, user = {};

    if (dtunesStorage){
        ({loggedIn, user} = JSON.parse(dtunesStorage));
    }

    return (
        <div className="bg-[#00013a] min-h-screen pl-[4vw]">
            <a href="/"><img className="mt-5 w-[max(7.5vw,60px)] sm:w-[max(100px,10vw)] sm:block" src={assets.logo} alt="logo" /></a>
            <div className="flex flex-col gap-5 mt-10">
                {loggedIn && user.isArtist && <SidebarButtons title='Add Song' toLink='/songs/new' imageSrc={assets.add_song} alt='add songs'/>}
                <SidebarButtons title='List songs' toLink='/songs' imageSrc={assets.song_icon} alt='List songs'/>
                <SidebarButtons title='Add Playlist' toLink='/playlists/new' imageSrc={assets.add_playlist} alt='add playlists'/>
                <SidebarButtons title='List Playlists' toLink='/playlists' imageSrc={assets.playlist_icon} alt='list playlists'/>

            </div>
        </div>
    )
}