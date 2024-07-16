import { useNavigate } from "react-router-dom"

export default function PlaylistItem({ id, image, name, desc }) {
    const navigate = useNavigate();
    return (
        //Old className property: min-w-[180px]
        <div onClick={() => navigate(`/playlist/${id}`)} className="min-w-[180px] max-w-[200px] py-2 px-3 rounded cursor-pointer hover:bg-[#ffffff30] ">
            <img className="rounded" src={image} alt={name} />
            <p className="font-bold mt-2 mb-1">{name}</p>
            <p className="text-slate-200 text-sm">{desc}</p>
        </div>
    )
}