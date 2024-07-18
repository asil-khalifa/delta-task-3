import { createContext, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/user/assets";
import axios, { all } from 'axios';
import { toast } from 'react-toastify'
import { useLocation } from "react-router-dom";

function shuffleArray(arr) {
    'Shuffles array AND RETURNS'

    arr = [...arr];
    for (let i = arr.length; i > 0; i--) {
        let randIndex = Math.floor(Math.random() * i);

        let temp = arr[i - 1];
        arr[i - 1] = arr[randIndex];
        arr[randIndex] = temp;
    }
    return arr;
}


export const PlayerContext = createContext();

export default function PlayerContextProvider({ children, backendUrl }) {
    const audioRef = useRef();
    const seekBgRef = useRef();
    const seekBarRef = useRef();

    const [track, setTrack] = useState({});
    const [playing, setPlaying] = useState(false);

    const [time, setTime] = useState({
        current: {
            second: 0,
            minute: 0,
        },
        total: {
            second: 0,
            minute: 0,
        }

    });

    //api:
    const [songsData, setSongsData] = useState([]);
    const [playlistsData, setPlaylistsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState({
        term: '',
        filter: 'songs',
    });

    const curLocation = useLocation();
    const [withinPlaylist, setWithinPlaylist] = useState(false);

    //See Normal.jsx, this helps to override songsData being empty 
    const [showNoSongs, setShowNoSongs] = useState(false);

    async function getSongs() {
        let response;
        try {
            response = await axios.get(`${backendUrl}/api/songs`)
            if (response.data.success) {
                let songsAvailable = response.data.songs;
                // shuffleArray(songsAvailable);

                //search:
                if (searchQuery.term && searchQuery.filter === 'songs') {
                    //lowercase both
                    songsAvailable = songsAvailable.filter(song => song.name.toLowerCase().indexOf(searchQuery.term) !== -1)

                    if (!songsAvailable.length) setShowNoSongs(true);
                    else setShowNoSongs(false);
                }

                try {
                    // within a playlist:
                    let playlistIndex = curLocation.pathname.indexOf('playlist');
                    if (playlistIndex !== -1) {
                        let playlistId = curLocation.pathname.slice(playlistIndex + 'playlist'.length + 1);
                        //remove any unwanted extra stuff
                        let extraSlashIndex = playlistId.indexOf('/');
                        if (extraSlashIndex !== -1) {
                            playlistId = playlistId.slice(0, extraSlashIndex)
                        }

                        let playlistData = playlistsData.find(p => p._id === playlistId);
                        if(playlistData){
                            songsAvailable = songsAvailable.filter(song => playlistData.songs.find(sId => sId === song._id))
                        }

                    }
                    else {
                        setWithinPlaylist(false);
                    }
                } catch (err) {
                    console.log('Error filtering songs for playlist:', err);
                }

                setSongsData(songsAvailable);

                //Only if track is not set, set it to the first available song
                if (!Object.keys(track).length) {
                    setTrack(t => {
                        if (songsAvailable) return songsAvailable[0];
                    })
                }
            }
            else {
                toast.warn('Couldn\'t get songs. Please Reload!')
                console.log(response);
            }
        } catch (err) {
            toast.error('Error occured while getting songs. Please Reload!')
            console.log(response);
            console.log(err);
        }
    }

    useEffect(() => {
        getSongs();
    }, [curLocation])

    async function getPlaylists() {
        let response;
        try {
            response = await axios.get(`${backendUrl}/api/playlists`)
            if (response.data.success) {
                setPlaylistsData(response.data.playlists);
            }
            else {
                toast.warn('Couldn\'t get playlists. Please Reload!')
                console.log(response);
            }
        } catch (err) {
            toast.error('Error occured while getting playlists. Please Reload!')
            console.log(err);
        }
    }

    async function getUsers(){
        try{

            const response = await axios.get(`${backendUrl}/api/users`);
            if(response.data.success){
                const allUsers = response.data.users;
                //if searching for users, filter by both username and name
                if (searchQuery.filter === 'users'){
                    const filteredUsers = allUsers.filter(user => {
                        //search query is already lowercased

                        const name = user.name.toLowerCase();
                        const username = user.username.toLowerCase();

                        return name.indexOf(searchQuery.term)!== -1 ||
                        username.indexOf(searchQuery.term)!== -1
                    })
                    setUsersData(filteredUsers)
                }
                else{
                    setUsersData(allUsers);
                }
            }
            else{
                toast.warn('Some error occured while retrieving users')
                console.log(response);
            }
        }catch(err){
            toast.error('Some error occured while retrieving users')
            console.log(response);
        }
    }

    useEffect(() => {
        getSongs();
        getUsers();
    }, [searchQuery])

    useEffect(() => {
        getSongs();
        getPlaylists();
        getUsers();
    }, [])

    function handleSearch(term=undefined, filter=undefined) {

        if(term !== undefined){

            setSearchQuery(sq => {
                return { ...sq, term: term.toLowerCase() }
            })
        }

        if (filter !== undefined){

            setSearchQuery(sq => {
                return { ...sq, filter };
            })
        }

    }

    async function play() {
        try {
            //if songs data have not yet been filtered, but in playlist: 
            if (curLocation.pathname.indexOf('playlist') !== -1 && !withinPlaylist) getSongs();
            const result = await audioRef.current.play()
            setPlaying(true);
        } catch (err) {
            setPlaying(false);
        }

    }

    function pause() {
        audioRef.current.pause();
        setPlaying(false);
    }

    function seekAudio(e) {
        try {
            const { x: X, y: Y, width } = seekBgRef.current.getBoundingClientRect()
            const fractionTime = (e.clientX - X) / width;
            audioRef.current.currentTime = fractionTime * audioRef.current.duration;
        }
        catch (err) {
            console.log(err);
        }
    }

    const contextValue = {
        audioRef,
        seekBgRef,
        seekBarRef,
        track, setTrack,
        playing, setPlaying,
        time, setTime,
        play, pause,
        seekAudio,
        playWithId,
        previous, next,
        songsData, setSongsData,
        playlistsData,
        searchQuery, handleSearch,
        showNoSongs, setShowNoSongs,
        usersData, setUsersData,

    }

    async function playWithId(id) {
        await setTrack(songsData.find(song => song._id === id))
        // play();
    }

    async function previous() {
        songsData.map((song, idx) => {
            if (song._id === track._id && idx > 0) {
                setTrack(songsData[idx - 1]);
                // play();
            }
        })
    }

    async function next() {
        songsData.map((song, idx) => {
            if (song._id === track._id && idx < songsData.length - 1) {
                setTrack(songsData[idx + 1]);
            }
        })
    }

    //Play song upon change in track:
    useEffect(() => {
        try {
            if (track) {
                play()
            }
        } catch (err) {
            console.log(err);
        }
    }, [track]);

    //first time pause song:
    useEffect(() => {
        pause();
    }, []);

    // console.log('track:',track, 'isplaying:', playing);

    useEffect(() => {
        const audio = audioRef.current;
        audio.ontimeupdate = () => {
            try {

                seekBarRef.current.style.width = `${audio.currentTime / audio.duration * 100}%`
                setTime({
                    current: {
                        second: Math.floor(audio.currentTime % 60),
                        minute: Math.floor(audio.currentTime / 60),
                    },
                    total: {
                        second: Math.floor(audio.duration % 60),
                        minute: Math.floor(audio.duration / 60),
                    }
                })
            } catch (err) {
                console.log('ontimeUpdate error:', err);
            }

        }
    }, [audioRef])

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    )
}
