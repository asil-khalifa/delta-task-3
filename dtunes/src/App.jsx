import { Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'

import './App.css'
// import Sidebar from './components/Sidebar'
// import Player from './components/Player'
// import Display from './components/Display'
// import { useContext } from 'react'
// import { PlayerContext } from './context/PlayerContext'
import Normal from './components/Normal'
import NormalWithContext from './components/NormalWithContext'
import OtherViewsMain from './otherViews/OtherViewsMain'
import { useContext } from 'react'

function App() {
    
    return (
        <>
            {/* <div className='h-screen bg-black'>
                {songsData.length !== 0
                    ? <>
                        <div className='h-[90%] flex'>
                            <Sidebar />
                            <Display />
                        </div>
                        <Player />
                    </> :
                    null
                }
                <audio ref={audioRef} preload='auto' src={track?track.file:''}></audio>
            </div> */}
            <Routes>
                {/* <Route path='*' element={<Normal songsData={songsData} audioRef={audioRef} track={track} />} /> */}
                {/* <Route path='*' element={<Normal/>} /> */}

                <Route path='/playlists/new/*' element={<OtherViewsMain  requestedPath='/playlists/new' />}/>
                <Route path='/songs/new/*' element={<OtherViewsMain requestedPath='/songs/new' />}/>
                <Route path='/playlists/*' element={<OtherViewsMain requestedPath='/playlists' />}/>
                <Route path='/songs/*' element={<OtherViewsMain requestedPath='/songs' />}/>
                <Route path='/users/new' element={<OtherViewsMain requestedPath='/users/new'/>}/>
                <Route path='*' element={<NormalWithContext/>} />

            </Routes>
            {/* <Normal songsData={songsData} audioRef={audioRef} track={track}/> */}
        </>
    )
}

export default App

