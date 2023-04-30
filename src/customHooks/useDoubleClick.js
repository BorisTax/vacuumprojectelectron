import { useRef } from "react";

export default function useDoubleClick(eventHandlers, onDoubleClick){
    const clickCount = useRef(0)
    const time = useRef() 
    return (e)=>{
        if(clickCount.current === 0) {
            time.current = performance.now();
            clickCount.current++
            }
            else{
                if((performance.now() - time.current) < 200) {
                    onDoubleClick(e)
                }
                clickCount.current = 0
            }
        eventHandlers.onClick(e)
    }
}