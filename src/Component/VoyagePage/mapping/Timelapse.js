import { useTimer } from "./Timer"

function Timelapse() {
    const timer = Timer({
        startTime: 0,
        endTime: 100,
        step: 1,
        frequency: 24
    })

    const timerData = timer.time;

    
}