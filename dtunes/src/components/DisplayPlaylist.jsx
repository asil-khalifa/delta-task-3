import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
// import { playlistsData, assets, songsData } from "../assets/user/assets";
import { assets } from "../assets/user/assets";
import { v4 as uuid } from 'uuid'
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";
import { useEffect } from "react";
import LikesDislikes from "./LikesDislikes";

export default function DisplayPlaylist({ }) {
    const { id } = useParams();
    const { playWithId, playlistsData, songsData, track } = useContext(PlayerContext);
    // const playlistData= playlistsData[id];
    const [playlistData, setPlaylistData] = useState('');
    useEffect(() => {
        setPlaylistData(playlistsData.find(playlist => playlist._id === id))
    }, [])

    return playlistData ? (
        <>
            {/* <Navbar /> */}
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end">
                <img className="w-48 rounded" src={playlistData.image} alt="Playlist Image" />
                <div className="flex flex-col">
                    <p>Playlist</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{playlistData.name}</h2>
                    <h3>{playlistData.desc}</h3>
                    <p className="mt-1">
                        <img className="inline-block w-5" src={assets.logo} alt="dTunes" />
                        <b>  {songsData.filter(song => song.playlist === playlistData.name).length} songs  </b>
                        
                    </p>

                </div>

            </div>
            <div className="grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p><b className="mr-4">#</b>Title</p>
                <p>Likes & Dislikes:</p>
                <img className="m-auto w-4" src={assets.clock_icon} alt="Time" />

            </div>
            <hr />
            {songsData.filter(song => song.playlist === playlistData.name).map((sd, idx) => {
                return (
                    <div onClick={() => playWithId(sd._id)} key={uuid()} className={`grid grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] ${track && track._id === sd._id && 'bg-[#ffffff30]'} hover:bg-[#ffffff20] cursor-pointer`}>
                        <p className="text-white">
                            <b className="mr-4 text-[#a7a7a7]">{idx + 1}</b>
                            <img className="inline w-10 mr-5" src={sd.image} alt={sd.name} />
                            {sd.name}
                        </p>

                        <LikesDislikes songId={sd._id} likes={sd.likes} dislikes={sd.dislikes}/>

                        <p className="text-[15px] text-center">
                            {sd.duration}
                        </p>

                    </div>
                )
            })}
        </>
    ) : null
}