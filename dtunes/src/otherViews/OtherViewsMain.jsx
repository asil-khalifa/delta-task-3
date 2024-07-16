import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useLocation, useParams, useSearchParams } from 'react-router-dom'

import AddPlaylist from './pages/AddPlaylist'
import AddSong from './pages/AddSong'
import ListSong from './pages/ListSong'
import ListPlaylist from './pages/ListPlaylist'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import LoadingCircle from '../components/LoadingCircle';
import LoginRegisterForm from './pages/LoginRegisterForm';
import HomeButton from './components/HomeButton'
import LoginNavbar from './components/LoginNavbar';

const backendUrl = 'http://localhost:2006';

export default function OtherViewsMain({ requestedPath }) {
    
    function loginPageOption(){
        const [searchParams, setSearchParams] = useSearchParams();

        let isArtist = searchParams.get('isArtist');
        let newUser = searchParams.get('newUser');
    
        if (isArtist === 'true') isArtist = true;
        if (isArtist === 'false') isArtist = false;
        if (newUser === 'true') newUser = true;
        if (newUser === 'false') newUser = false;
        
        let activated = new Array(4).fill(false);
    
        if (!isArtist && !newUser) activated[1] = true;
        else if (isArtist && newUser) activated[2] = true;
        else if (isArtist && !newUser) activated[3] = true;
        else activated[0] = true;

        return [...activated, isArtist, newUser];
    }
    
    return (
        <div className='flex items-start min-h-screen'>
            <ToastContainer />
            {requestedPath !== '/users/new' && <Sidebar />}
            <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
                <Navbar activated={requestedPath === '/users/new'?loginPageOption():[]}/>
                
                {requestedPath === '/users/new' && <LoginNavbar activated={loginPageOption()}/>}
                <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
                    {/* <Route path='/songs/new' element={<AddSong backendUrl={backendUrl}/>} />
                    <Route path='/playlists/new' element={<AddPlaylist backendUrl={backendUrl}/>} />
                    <Route path='/playlists' element={<ListPlaylist backendUrl={backendUrl}/>} />
                    <Route path='/songs' element={<ListSong backendUrl={backendUrl}/>} /> */}

                    {requestedPath === '/playlists/new' && <AddPlaylist backendUrl={backendUrl} />}
                    {requestedPath === '/songs/new' && <AddSong backendUrl={backendUrl} />}
                    {requestedPath === '/playlists' && <ListPlaylist backendUrl={backendUrl} />}
                    {requestedPath === '/songs' && <ListSong backendUrl={backendUrl} />}
                    {requestedPath === '/users/new' && <LoginRegisterForm backendUrl={backendUrl}  activated={loginPageOption()}/>}

                </div>

                <HomeButton/>
            </div>
        </div>
    )
}