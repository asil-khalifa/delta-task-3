import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import DisplayPlaylist from './DisplayPlaylist'
import { useState } from 'react'
import Navbar from './Navbar'
import { ToastContainer } from 'react-toastify'
import DisplayLikedSongs from './DisplayLikedSongs'


export default function Display({setCollapsedSidebar}) {
    // const { playlistsData } = useContext(PlayerContext);

    const [bgColor, setBgColor] = useState('#121212');
    //find playlist:
    // const playlistIndex = location.pathname.indexOf('playlist');
    // let bgColor, curPlaylist;

    // if (playlistIndex !== -1) {
    //     let id = location.pathname.slice(playlistIndex + 'playlist'.length+1);
    //     let slashIndex = id.indexOf('/')
    //     if (slashIndex !== -1) {
    //         id = id.slice(0, slashIndex);
    //     }
    //     // bgColor = playlistsData[Number(id)].bgColor;
    //     curPlaylist = playlistsData.find(playlist => playlist._id === id);
    //     bgColor = curPlaylist.bgColor ? curPlaylist.bgColor : '#2a4365';
    // }

    // useEffect(() => {
    //     if (bgColor) {
    //         displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
    //     }
    //     else if (location && location.pathname === '/liked-songs'){
    //         displayRef.current.style.background = `linear-gradient(#ef476fbb, #121212)`
    //     }
    //     else {
    //         displayRef.current.style.background = '#121212'
    //     }
    // }, [location])

    return (
        <div style={{background: bgColor}} className="w-[100%]  lg:w-[75%] lg:ml-0 m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto">
            <ToastContainer/>
            <Navbar setCollapsedSidebar={setCollapsedSidebar}/>
            <Routes>
                <Route path='/liked-songs' element={<DisplayLikedSongs setBgColor={setBgColor}/>}/>
                <Route path='/playlist/:id' element={<DisplayPlaylist setBgColor={setBgColor} />} />
                <Route path='*' element={<Home setBgColor={setBgColor} />} />
            </Routes>
        </div>
    )
}