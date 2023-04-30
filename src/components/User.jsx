import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import useActions from '../customHooks/useActions';
import Language from './Language';

export default function User() {
    const appActions = useActions()
    const user = useSelector(store => store.user)
    const captions = useSelector(store => store.captions)
    const serverMessages = useSelector(store => store.captions.serverMessages)
    const inputRef = useRef()
    const [inputText, setInputText] = useState("")
    const logout = () => {
        appActions.showConfirm(true, 'logout', [{ caption: "OK", onClick: appActions.logout }]);
    }
    const activate = (name, code) => {
        fetch('/activate',
            {
                method: 'POST', headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, code })
            })
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    appActions.setToken(res.token)
                    setInputText("")
                }
                else {
                    appActions.showAlert(true, serverMessages[res.message])
                    setInputText("")
                }
            })
            .catch(e => { console.error(e); });
    }
    const activateBlock = !user.activated ? <form onSubmit={(e) => { e.preventDefault(); activate(user.name, inputRef.current.value) }}>
                                                <input required ref={inputRef} type="text" value = {inputText} placeholder={captions.activation.placeholder} onChange = {(e)=>setInputText(e.target.value)}/>
                                                <button type="Submit">{">>"}</button>
                                            </form> : <></>
    const links = !user.token ? <>
        <NavLink to="/login"><span className="link">{captions.buttons.login}</span></NavLink>
        <NavLink to="/register"><span className="link">{captions.buttons.signup}</span></NavLink>
    </>
        : <>{activateBlock}<NavLink to='/' onClick={logout}><span className="link">{captions.buttons.logout}</span></NavLink></>
    return <div className="profile-panel noselect">
        <Language/>
        {user.name ? user.name : ''}

        {links}
    </div>
}