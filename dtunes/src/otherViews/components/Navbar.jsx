
export default function Navbar({pageHeading='Creation Panel', activated}){
    if (activated){
        if (activated[0]) pageHeading='User Registration';
        else if (activated[1]) pageHeading='User Login';
        else if (activated[2]) pageHeading='Artist Registration';
        else if (activated[3]) pageHeading='Artist Login';

    }
    return(
        <div className="Navbar w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg">
            <p className="text-blue-800 text-3xl text-center">{pageHeading}</p>
        </div>
    )
}