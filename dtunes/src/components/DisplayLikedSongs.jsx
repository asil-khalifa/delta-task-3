import axios from "axios"
import {v4 as uuid} from 'uuid';
import { assets } from "../assets/user/assets"
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlaylistCover from "./PlaylistCover";
import PlaylistSongHeading from "./PlaylistSongHeading";
import PlaylistSong from "./PlaylistSong";
import { PlayerContext } from "../context/PlayerContext";

const dtunesStorage = localStorage.getItem('dtunesStorage');
let loggedIn = false, user = {};

if (dtunesStorage){
    ({loggedIn, user} = JSON.parse(dtunesStorage));
}

const playlistData = {
    name: 'Liked Songs',
    desc: 'You can find the songs you liked here.',
    bgColor: '#ff0000',
    image: assets.like_icon,
}

const backendUrl = 'http://localhost:2006';

export default function DisplayLikedSongs(){
    const [likedSongs, setLikedSongs] = useState([]);
    const {track, playWithId, setSongsData, setShowNoSongs} = useContext(PlayerContext);

    async function getLikedSongs(){
        try{

            let response = await axios.get(`${backendUrl}/api/users/${user._id}/liked-songs`)

            if(response.data.success){
                setLikedSongs(response.data.likedSongs);

                //also update it in the player context so that previous and next work
                setSongsData(response.data.likedSongs);
                
                setShowNoSongs(true);
            }
            else{
                toast.warn('Some error occured in retrieving liked songs, try later!')
            }
        }catch(err){
            console.log(err);
            toast.warn('Error occured while searching for liked songs, try again!')
        }
    }

    useEffect(() => {
        if(loggedIn) getLikedSongs();
        else toast.info('Once you create an account, your liked songs will show here :)');
    }, []);

    // console.log(likedSongs);

    return(
        <>
        <PlaylistCover playlistData = {playlistData} playlistSongs={likedSongs} canEdit={false}/>
        <PlaylistSongHeading/>

        {likedSongs.map((sd, idx) => {
            return (
                <PlaylistSong key={uuid()} clickFunc={() => playWithId(sd._id)} track={track} sd={sd} idx={idx} />
            )
        })}
    </>
    )
}