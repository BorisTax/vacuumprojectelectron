import {createStore,applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import { rootReducer } from '../reducers'
window.actions=[]
const actionList=(store)=>(next)=>(action)=>{window.actions.push(action.type);return next(action)}

export const store = createStore(rootReducer,applyMiddleware(thunk,actionList));