import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/user/assets'
import SidebarItem from './SidebarItem';

export default function Sidebar({ collapsed = true }) {
    const navigate = useNavigate();

    const dtunesStorage = localStorage.getItem('dtunesStorage');
    let loggedIn = false, user = {};

    if (dtunesStorage) {
        ({ loggedIn, user } = JSON.parse(dtunesStorage));
    }

    function clickCreatePlaylist() {

        if (loggedIn) {
            return navigate('/playlists/new');
        }

        navigate('/users/new?isArtist=false&newUser=true')
    }

    function clickAddSong() {
        if (loggedIn) {
            if (user.isArtist) return navigate('/songs/new')
            return navigate('/users/new?isArtist=true&newUser=true')

        }
        navigate('/users/new?isArtist=true&newUser=true')

    }

    return (
        <div className={`w-[75%] sm:w-[50%] lg:w-[25%] h-full p-2 ${collapsed && 'hidden'} absolute lg:static lg:flex flex-col gap-2 text-white`}>
            <div className="bg-[#121212] h-[10%] rounded flex flex-col justify-around">

                <div onClick={() => navigate('/')} className="hover:bg-[#434343] flex items-center gap-3 pl-8 py-2 cursor-pointer">
                    <img className='w-6' src={assets.home_icon} alt="home" />
                    <p className='font-bold'>Home</p>
                </div>

            </div>

            <div className="bg-[#121212] h-[85%] rounded">
                <div className='p-4 flex items-center justify-between '>
                    <div className='flex items-center gap-3'>
                        <img className='w-8' src={assets.stack_icon} alt="stack" />
                        <p className='font-semibold'>Library</p>
                    </div>
                </div>

                <SidebarItem clickFunc={clickCreatePlaylist} heading='Create Playlist+' paragraph='Create once. Share with friends. Listen anywhere.' buttonText='Create Playlist' />
                {!loggedIn && <SidebarItem clickFunc={clickAddSong} heading='Publish Song' paragraph='Register with an artist account to publish your own songs!' buttonText='Create Artist Account' />}
                {loggedIn && user.isArtist && <SidebarItem clickFunc={clickAddSong} heading='Publish Songs' paragraph='As an artist, you can share your songs with the world to see!' buttonText='Publish song' />}
                {/* <SidebarItem heading='Friend 1' paragraph='Listening to Song 1' buttonText='Listen Together'/> */}

            </div>

        </div>
    )
}