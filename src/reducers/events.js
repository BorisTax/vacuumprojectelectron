import EventsActions from "../actions/EventsActions"
const initialState = {
    event: '',
    touchCount: 0,
    log:[]
}
export function eventsReducer(state = initialState, action) {
    switch(action.type){
        case EventsActions.TOUCH_DOWN:
            return {...state, event: "touchDown"}
        case EventsActions.TOUCH_UP:
            return {...state, event: "touchUp"}
        case EventsActions.TOUCH_MOVE:
            return {...state, event: "touchMove"}
        case EventsActions.TOUCH_CANCEL:
            return {...state, event: "touchCancel"}
        case EventsActions.LOG:
            state.log.push(action.payload)
            return {...state}
        default:
            return state
    }
}