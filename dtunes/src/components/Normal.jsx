import Sidebar from "./Sidebar"
import Display from './Display'
import Player from "./Player"
import { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";


export default function Normal() {
    const { audioRef, track, songsData } = useContext(PlayerContext);

    //sets collapsed to true; has effect only in less than large devices
    const [collapsedSidebar, setCollapsedSidebar] = useState(true);

    return (
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
    )
}
