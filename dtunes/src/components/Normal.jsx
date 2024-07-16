import Sidebar from "./Sidebar"
import Display from './Display'
import Player from "./Player"
import { useContext, useState } from "react";
// import PlayerContextProvider from '../context/PlayerContext.jsx';
import { PlayerContext } from "../context/PlayerContext";
//Props:
// { songsData, audioRef, track }

//trying importing here:
// let backendUrl = 'http://localhost:2006';

export default function Normal() {
    const { audioRef, track, songsData } = useContext(PlayerContext);

    //sets collapsed to true; has effect only in less than large devices
    const [collapsedSidebar, setCollapsedSidebar] = useState(true);

    return (
        // <PlayerContextProvider backendUrl={backendUrl}>
            <div className='h-screen bg-black'>
                {songsData.length !== 0
                    ? <>
                        {/* <Sidebar/> */}
                        <div className='h-[90%] flex'>
                            <Sidebar collapsed={collapsedSidebar}/>
                            <Display setCollapsedSidebar={setCollapsedSidebar}/>
                        </div>
                        <Player />
                    </> :
                    null
                }
                <audio ref={audioRef} preload='auto' src={track ? track.file : ''}></audio>
            </div>
        // </PlayerContextProvider>

    )
}
