import { useContext } from 'react'
import { assets } from '../assets/user/assets'
import { PlayerContext } from '../context/PlayerContext'

export default function Player() {
    const { seekBgRef, seekBarRef, playing, play, pause, track, time, seekAudio, previous, next } = useContext(PlayerContext);
    const zeroFormat = { current: time.current.second < 10, total: time.total.second < 10 }
    return track ? (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
            <div className="hidden md:flex items-center gap-4">
                <img className="w-12" src={track.image} alt="Song Image" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}...</p>
                </div>
            </div>

            <div className='flex items-center md:hidden'>
                <img className="w-10" src={track.image} alt="Song Image" />
            </div>

            <div className='flex flex-col items-center gap-1 m-auto'>
                <div className='flex gap-4'>
                    <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt="shuffle" />
                    <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="previous" />
                    {playing
                        ? <img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="pause" />
                        : <img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="play" />
                    }
                    <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="next" />
                    <img className='w-4 cursor-pointer' src={assets.loop_icon} alt="loop" />
                </div>
                <div className='flex items-center gap-4'>
                    <p>{time.current.minute}:{zeroFormat.current && '0'}{time.current.second}</p>
                    <div onClick={seekAudio} ref={seekBgRef} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                        <hr ref={seekBarRef} className='h-2 border-none w-0 bg-blue-600 rounded-full' />

                    </div>
                    <p>{time.total.minute}:{zeroFormat.total && '0'}{time.total.second}</p>
                </div>
            </div>

        </div>
    ) : null
}