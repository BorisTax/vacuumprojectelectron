import { useDispatch } from "react-redux";
import { getActions } from "../actions/actions";

export default function useActions(){
    return getActions(useDispatch())
}