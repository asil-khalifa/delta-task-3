import { useEffect, useState } from "react";
import { assets } from "../assets/artist/assets";
import axios from 'axios';
import { toast } from "react-toastify";
import { v4 as uuid } from 'uuid';
import Navbar from "../components/Navbar";

export default function AddSong({ backendUrl }) {
    const [image, setImage] = useState(false);
    const [song, setSong] = useState(false);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [playlist, setPlaylist] = useState('None');
    const [playlistList, setPlaylistList] = useState([]);

    async function submitHandler(e) {
        if (e) e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('playlist', playlist);

            // const response = await axios.post(`${backendUrl}/api/songs`, formData);

            const response = await toast.promise(
                axios.post(`${backendUrl}/api/songs`, formData),
                {
                    pending: 'Uploading... Please wait',
                }
            )
            console.log(response);

            if (response.data.success) {
                toast.success('Song added!');

                setName('');
                setDesc('');
                setPlaylist('');
                setSong(false);
                setImage(false);

            }
            else {
                toast.warn('Song not Added. Please Retry!')
            }

        } catch (err) {
            console.log(err);
            toast.error('Some Error occured. Please Retry!')
        }
    }

    async function getPlaylists() {
        try {
            const response = await axios.get(`${backendUrl}/api/playlists`)
            if (response.data.success) {
                setPlaylistList(response.data.playlists);
            }
            else {
                toast.warn('Coudn\'t receive playlists list. Reload page!')
                console.log(response);
            }
        }
        catch (err) {
            toast.error('Error getting playlists list. Please Reload')
            console.log(response);

        }
    }

    useEffect(() => {
        getPlaylists();
    }, []);

    return (
        <>
        <Navbar pageHeading="Publish New Song"/>
        <form onSubmit={submitHandler} className="flex flex-col items-start gap-8 text-gray-600" action="">
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <p>Upload Song</p>
                    <input onChange={e => setSong(e.target.files[0])} type="file" id="song" name="song" accept="audio/*" hidden />
                    <label htmlFor="song">
                        <img className="w-24 cursor-pointer" src={song ? assets.upload_added : assets.upload_song} alt="Upload song" />
                    </label>

                </div>
                <div className="flex flex-col gap-4">
                    <p>Upload Image</p>
                    <input onChange={e => setImage(e.target.files[0])} type="file" id="image" name="image" accept='image/*' hidden />
                    <label htmlFor="image">
                        <img className="w-24 cursor-pointer" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Image" />
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Name:</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className="bg-transparent focus:bg-blue-100 outline-green-600 border-2 border-gray-400 hover:border-green-500 p-2.5 w-[max(40vw,250px)]" placeholder="Song Name" type="text" />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Description:</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} className="bg-transparent focus:bg-blue-100 outline-green-600 border-2 border-gray-400 hover:border-green-500 p-2.5 w-[max(40vw,250px)]" placeholder="Song Description" type="text" />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Playlist:</p>
                <select onChange={(e) => setPlaylist(e.target.value)} value={playlist} className="bg-transparent outline-green-600 border-2 border-gray-400 hover:border-green-500 p-2" name="playlist" id="playlist">
                    <option value={'None'}>None</option>
                    <option value="testplaylist">Test Playlist</option>
                    {playlistList.map(playlist => <option key={uuid()} value={playlist.name}>{playlist.name}</option>)}
                </select>

            </div>

            <button className="text-base bg-green-600 hover:bg-green-700 active:bg-green-800 text-white cursor-pointer px-6 py-3 rounded-full" type="submit">Add</button>
        </form>
        </>
    )
}