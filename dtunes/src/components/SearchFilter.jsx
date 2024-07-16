
export default function SearchFilter({selected=false, text}){
    if(selected){
        return <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">{text}</p>
    }
    return <p className="bg-black text-white px-4 py-1 rounded-2xl cursor-pointer">{text}</p>
}