import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Home'
import DisplayPlaylist from './DisplayPlaylist'
import { useEffect, useRef } from 'react'
import { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Navbar from './Navbar'
import { ToastContainer } from 'react-toastify'
import DisplayLikedSongs from './DisplayLikedSongs'

// import { playlistsData } from '../assets/user/assets';

export default function Display({setCollapsedSidebar}) {
    const { playlistsData } = useContext(PlayerContext);

    const displayRef = useRef();

    const location = useLocation();

    //find playlist:
    const playlistIndex = location.pathname.indexOf('playlist');
    let bgColor, curPlaylist;

    if (playlistIndex !== -1) {
        let id = location.pathname.slice(playlistIndex + 'playlist'.length+1);
        let slashIndex = id.indexOf('/')
        if (slashIndex !== -1) {
            id = id.slice(0, slashIndex);
        }
        // bgColor = playlistsData[Number(id)].bgColor;
        curPlaylist = playlistsData.find(playlist => playlist._id === id);
        bgColor = curPlaylist.bgColor ? curPlaylist.bgColor : '#2a4365';
    }

    useEffect(() => {
        if (bgColor) {
            displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
        }
        else {
            displayRef.current.style.background = '#121212'
        }
    }, [location])

    return (
        <div ref={displayRef} className="w-[100%]  lg:w-[75%] lg:ml-0 m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto">
            <ToastContainer/>
            <Navbar setCollapsedSidebar={setCollapsedSidebar}/>
            <Routes>
                <Route path='/liked-songs' element={<DisplayLikedSongs/>}/>
                <Route path='/playlist/:id' element={<DisplayPlaylist />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </div>
    )
}