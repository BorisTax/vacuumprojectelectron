import UserActions from "../actions/UserActions";
import jwtDecode from "jwt-decode";

export function userReducer(state, action) {
  var user = state.user
  switch (action.type) {
    case UserActions.SET_TOKEN:
      if (action.payload.token) {
        let expires;
        if (action.payload.remember === true)
          expires = `;expires=Tue, 19 Jan 2099 00:00:00 GMT`;
        else expires = "";
        document.cookie = `token=${action.payload.token}${expires}`;
        user = jwtDecode(action.payload.token)
        user.token = action.payload.token;
      } else {
        user.name = "";
        user.activated = false
      }
      return {result: true, newState: {...state, user}};

    case UserActions.LOGOUT:
      document.cookie = "token=";
      return {result: true, newState: {...state, user:{}}};

    case UserActions.ACTIVATE:
      user.activated = true
      return {result: true, newState: {...state, user}};

    default:
      return {result: false};
  }
}
