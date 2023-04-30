const UserActions = {
    SET_TOKEN: 'SET_TOKEN' ,
    LOGOUT: 'LOGOUT',
    ACTIVATE: 'ACTIVATE',
setToken: (token,remember)=>{
    return {
        type: 'SET_TOKEN',
        payload: {token,remember},
    }
},
logout:()=>{
    return {
        type: 'LOGOUT',
    }
},
activate:()=>{
    return {
        type: 'ACTIVATE',
    }
}
}

export default UserActions