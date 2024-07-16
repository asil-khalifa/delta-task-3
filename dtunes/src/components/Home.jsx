import Navbar from "./Navbar";
// import { playlistsData, songsData } from "../assets/user/assets";
import PlaylistItem from "./PlaylistItem";
import { v4 as uuid } from 'uuid'
import SongItem from "./SongItem";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/user/assets";

export default function Home() {
    const { songsData, playlistsData, track } = useContext(PlayerContext);

    const dtunesStorage = localStorage.getItem('dtunesStorage');
    let loggedIn = false, user = {};

    if (dtunesStorage) {
        ({ loggedIn, user } = JSON.parse(dtunesStorage));
    }

    return (
        <>
            {/* <Navbar /> */}
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Playlists</h1>
                <div className="flex overflow-auto">
                    {/* liked songs: */}
                    <PlaylistItem key={uuid()} likedSongs={true} image={assets.like_icon} name='Liked Songs' desc='Find all songs you liked here' />
                    {/* All playlists */}
                    {playlistsData.map((ad) => {
                        if (ad.isPublic || !ad.isPublic && loggedIn && user.playlists.find(pId => pId === ad._id)) {
                            return <PlaylistItem key={uuid()} name={ad.name} desc={ad.desc} image={ad.image} id={ad._id} />
                        }
                    })}
                </div>
            </div>

            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Songs:</h1>
                <div className="flex flex-wrap justify-evenly overflow-auto">
                    {songsData.map((sd) => <SongItem key={uuid()} name={sd.name} desc={sd.desc} image={sd.image} id={sd._id} likes={sd.likes} dislikes={sd.dislikes} currentlyPlaying={track._id && track._id === sd._id} />)}
                </div>
            </div>
        </>
    )
}
