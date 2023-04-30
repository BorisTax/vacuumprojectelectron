import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainContainer from './components/MainContainer';
import Confirm from './components/Confirm';
import Alert from './components/Alert';
import Spinner from './components/Spinner';
import HelpSection from './components/HelpSection';
import useActions from './customHooks/useActions';
import { captions } from './locale/ru.js';

export default function Body(){
    const showHelp = useSelector(store => store.showHelp)
    const showLoading = useSelector(store => store.showLoading)
    const showConfirm = useSelector(store => store.showConfirm)
    const showAlert = useSelector(store => store.showAlert)
    const appActions = useActions()
    useEffect(()=>{
        appActions.setLanguage(captions)
    },[])
    return <>
        <MainContainer/>
        <div id="goTop"><div></div></div>
        {showLoading?<Spinner/>:<></>}
        {showHelp?<HelpSection/>:<></>}
        {showConfirm.show?<Confirm messageKey={showConfirm.messageKey} actions={showConfirm.actions}/>:<></>}
        {showAlert.show?<Alert message={showAlert.message}/>:<></>}
        </>
}
