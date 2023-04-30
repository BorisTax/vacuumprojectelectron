const EventsActions = {
    TOUCH_DOWN: 'TOUCH_DOWN',
    TOUCH_UP: 'TOUCH_UP',
    TOUCH_MOVE: 'TOUCH_MOVE',
    TOUCH_CANCEL: 'TOUCH_CANCEL',
    LOG: 'LOG',
touchDown: ()=>{
    return {
        type: 'TOUCH_DOWN',
        payload: {},
    }
},
touchUp:(touchCount = 0)=>{
    return {
        type: 'TOUCH_UP',
        payload: touchCount
    }
},
touchMove:()=>{
    return {
        type: 'TOUCH_MOVE',
    }
},
touchCancel:()=>{
    return {
        type: 'TOUCH_CANCEL',
    }
},
log:(data)=>{
    return {
        type: 'LOG',
        payload: data
    }
}
}

export default EventsActions