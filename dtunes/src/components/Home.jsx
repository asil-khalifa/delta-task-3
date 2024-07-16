import Navbar from "./Navbar";
// import { playlistsData, songsData } from "../assets/user/assets";
import PlaylistItem from "./PlaylistItem";
import { v4 as uuid } from 'uuid'
import SongItem from "./SongItem";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

export default function Home() {
    const { songsData, playlistsData } = useContext(PlayerContext);

    return (
        <>
            {/* <Navbar /> */}
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Playlists</h1>
                <div className="flex overflow-auto">
                    {playlistsData.map((ad) => <PlaylistItem key={uuid()} name={ad.name} desc={ad.desc} image={ad.image} id={ad._id} />)}
                </div>
            </div>

            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Songs:</h1>
                <div className="flex overflow-auto">
                    {songsData.map((sd) => <SongItem key={uuid()} name={sd.name} desc={sd.desc} image={sd.image} id={sd._id} likes={sd.likes} dislikes={sd.dislikes} />)}
                </div>
            </div>
        </>
    )
}
