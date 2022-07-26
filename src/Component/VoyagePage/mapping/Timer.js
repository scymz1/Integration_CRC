import { useEffect, useState } from "react"

export default function GetTimer(props) {
    const [time, setTime] = useState();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval

        if(isPlaying) {
            interval = setInterval(() => {
                setTime(time=>time+step)
            }, 1000/frequency)
        }

        return () => clearInterval(interval)
    }, [isPlaying])

    useEffect(() => {
        if(time >= endTime){
            setIsPlaying(false)
        }
    }, [time, endTime])

    const updateTime = time => setTime(time)

    return {startTime, endTime, time, setTime, isPlaying, setIsPlaying, updateTime }

}