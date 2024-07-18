import { useParams } from "react-router-dom";
import { assets } from "../assets/user/assets";
import { v4 as uuid } from 'uuid'
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";
import { useEffect } from "react";
import PlaylistSong from "./PlaylistSong";
import PlaylistSongHeading from './PlaylistSongHeading'
import PlaylistCover from "./PlaylistCover";

export default function DisplayPlaylist({ }) {
    const { id } = useParams();
    const { playWithId, playlistsData, songsData, track, setShowNoSongs } = useContext(PlayerContext);

    const [playlistData, setPlaylistData] = useState('');

    // let playlistSongs;
    const [playlistSongs, setPlaylistSongs] = useState([]);

    useEffect(() => {
        setPlaylistData(playlistsData.find(playlist => playlist._id === id))
    }, [])

    useEffect(() => {
        try {

            let ps = songsData.filter(song => {
                // console.log(song._id === playlistData.songs[0], song._id, playlistData.songs[0], playlistData.songs.find(sId => sId === song._id))
                return playlistData.songs.find(sId => sId === song._id)
            })

            setPlaylistSongs(ps);
            // console.log('ps', playlistSongs);

        } catch (err) {
        }
    }, [playlistData])

    // if (!playlistSongs.length) setShowNoSongs(true);

    useEffect(() => {
        setShowNoSongs(true);
    }, [playlistSongs])
    // console.log('plyalistData', typeof(playlistData));
    
    const dtunesStorage = localStorage.getItem('dtunesStorage');
    let loggedIn = false, user = {};

    if (dtunesStorage){
        ({loggedIn, user} = JSON.parse(dtunesStorage));
    }
    
    const canEdit = (loggedIn && user.playlists.find(pId => pId === playlistData._id))?true:false;

    return playlistData && playlistSongs ? (
        <>
            <PlaylistCover playlistData={playlistData} playlistSongs={playlistSongs} canEdit={canEdit}/>
            <PlaylistSongHeading />

            {playlistSongs.map((sd, idx) => {
                return (
                    <PlaylistSong key={uuid()} clickFunc={() => playWithId(sd._id)} track={track} sd={sd} idx={idx} />
                )
            })}
        </>
    ) : null
}