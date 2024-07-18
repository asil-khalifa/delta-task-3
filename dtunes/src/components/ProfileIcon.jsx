
export default function ProfileIcon({clickFunc = () => {}, profileColor, letter}){
    return(
        <p onClick={clickFunc} style={{backgroundColor:  profileColor}} className={`border border-green-700 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer lg:cursor-auto `}>{letter.toUpperCase()}</p>
    )
}