import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from 'uuid';

export default function ListSong({ backendUrl }) {
    const [data, setData] = useState([]);

    async function fetchSongs() {
        try {
            const response = await axios.get(`${backendUrl}/api/songs`)
            if (response.data.success) {
                setData(response.data.songs);
            }
            else {
                toast.warn('Unable to retrieve songs. Please reload page');
            }
        } catch (e) {
            toast.error('Error occured. Please reload page');

        }
    }

    useEffect(() => {
        fetchSongs();
    }, [])

    async function removeSong(id) {
        try {
            const response = await axios.delete(`${backendUrl}/api/songs/${id}`)
            if (response.data.success) {
                toast.success('Deleted Song Successfully!');
                fetchSongs();
            }
            else {
                toast.warn('Couldn\'t delete song. Try again!')
            }
        } catch (e) {
            toast.error('Error deleting song. Try again!')
        }
    }
    return (
        <div>
            <p>List of Songs:</p>
            <br />
            <div>
                <div className="sm:grid hidden grid-cols-[.5fr_1fr_2fr_1fr_.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Playlist</b>
                    <b>Duration</b>
                    <b>Delete</b>

                </div>
                <div>
                    {data.map((song, idx) => {
                        return (
                            <div key={uuid()} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[.5fr_1fr_2fr_1fr_.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
                                <img className="w-12" src={song.image} alt={song.name} />
                                <p>{song.name}</p>
                                <p>{song.playlist}</p>
                                <p>{song.duration}</p>
                                <p onClick={() => removeSong(song._id)} className="text-red-500 hover:bg-red-200 active:bg-red-300 w-fit cursor-pointer">Delete</p>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    )
}