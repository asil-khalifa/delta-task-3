import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"
import LikesDislikes from "./LikesDislikes";

export default function SongItem({id, name, image, desc, likes, dislikes}){
    const {playWithId} = useContext(PlayerContext);

    return(
        <div onClick={() => playWithId(id)} className="min-w-[180px] max-w-[200px] py-2 px-3 rounded cursor-pointer hover:bg-[#ffffff30]">
            <img className="rounded" src={image} alt={name} />
            <p className="font-bold mt-2 mb-1">{name}</p>
            <p className="text-slate-200 text-sm">{desc}</p>
            <LikesDislikes songId={id} likes={likes} dislikes={dislikes}/>
        </div>
    )
}