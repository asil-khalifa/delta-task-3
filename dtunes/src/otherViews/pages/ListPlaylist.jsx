import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from 'uuid';

export default function ListPlaylist({ backendUrl }) {
    const [data, setData] = useState([]);

    async function fetchPlaylists() {
        try {
            const response = await axios.get(`${backendUrl}/api/playlists`)
            if (response.data.success) {
                setData(response.data.playlists);
            }
            else {
                toast.warn('Unable to retrieve Playlists. Please reload page');
            }
        } catch (e) {
            toast.error('Error occured. Please reload page');

        }
    }

    useEffect(() => {
        fetchPlaylists();
    }, [])

    function clickBgColor(e) {
        e.preventDefault();
    }


    async function removeplaylist(id) {
        try {
            const response = await axios.delete(`${backendUrl}/api/playlists/${id}`)
            if (response.data.success) {
                toast.success('Deleted Playlist Successfully!');
                fetchPlaylists();
            }
            else {
                toast.warn('Couldn\'t delete Playlist. Try again!')
                console.log(response);
            }
        } catch (e) {
            toast.error('Error deleting Playlist. Try again!')
        }
    }

    return (
        <div>
            <p>List of Playlists:</p>
            <br />
            <div>
                <div className="sm:grid hidden grid-cols-[.5fr_1fr_2fr_1fr_.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>PLaylist Color</b>
                    <b>Delete</b>

                </div>
                <div>
                    {data.map((playlist) => {
                        return (
                            <div key={uuid()} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[.5fr_1fr_2fr_1fr_.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
                                <img className="w-12" src={playlist.image} alt={playlist.name} />
                                <p>{playlist.name}</p>
                                <p>{playlist.desc}</p>
                                <input onClick={clickBgColor} readOnly type="color" value={playlist.bgColor} />
                                <p onClick={() => removeplaylist(playlist._id)} className="text-red-500 hover:bg-red-200 active:bg-red-300 w-fit cursor-pointer">Delete</p>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    )
}