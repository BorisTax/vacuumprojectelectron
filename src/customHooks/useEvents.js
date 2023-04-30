
export default function useEvents(isMobile, eventHandlers){
    if(isMobile) return {
        onPointerMove: (e) => { eventHandlers.onPointerMove(e) },
        onPointerDown: (e) => { eventHandlers.onPointerDown(e) },
        onPointerUp: (e) => { eventHandlers.onPointerUp(e) },
        onPointerLeave: (e) => { eventHandlers.onPointerLeave(e) },
        onPointerEnter: (e) => { eventHandlers.onPointerEnter(e) },
        onPointerCancel: (e) => { eventHandlers.onPointerUp(e) },
    }
    else
    return {
        onMouseMove: (e) => { eventHandlers.onPointerMove(e) },
        onMouseDown: (e) => { eventHandlers.onPointerDown(e) },
        onMouseUp: (e) => { eventHandlers.onPointerUp(e) },
        onMouseLeave: (e) => { eventHandlers.onPointerLeave(e) },
        onMouseEnter: (e) => { eventHandlers.onPointerEnter(e) },
    }
}