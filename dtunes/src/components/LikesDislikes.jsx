import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
const backendUrl = 'http://localhost:2006'

export default function LikesDislikes({ likes, dislikes, songId }) {

    const dtunesStorage = localStorage.getItem('dtunesStorage');
    let loggedIn = false, user = {};
    if (dtunesStorage) {
        ({ loggedIn, user } = JSON.parse(dtunesStorage));
    }

    async function handleLike(e) {
        e.stopPropagation();
        if (!loggedIn) return toast.info('You have to login to like')

        const response = await axios.post(`${backendUrl}/api/songs/like`, {songId, userId:user._id })

        if (response.data.wasLiked) toast.info('Like removed, reload page to see');
        else toast.info('Like added, reload page to see');
    }

    async function handleDislike(e) {
        e.stopPropagation();
        if (!loggedIn) return toast.info('You have to login to dislike')

        const response = await axios.post(`${backendUrl}/api/songs/dislike`, {songId, userId:user._id })

        if (response.data.wasDisliked) toast.info('Dislike removed, reload page to see')
        else toast.info('Dislike added, reload page to see');
    }

    return (
        <div className="flex gap-2 mt-1">
            <button onClick={(e) => handleLike(e)} className={`bg-green-950 rounded-xl px-1`}>{likes.length} Likes</button>
            <button onClick={(e) => handleDislike(e)} className={`bg-red-950 rounded-xl px-1`}>{dislikes.length} Dislikes</button>
        </div>
    )
}