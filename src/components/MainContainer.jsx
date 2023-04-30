import React, { useState } from 'react';
import PrintPreviewBar from './PrintPreviewBar';
import Header from './Header';
import StatusBar from './StatusBar.jsx';
import ViewPortContainer from './ViewPortContainer';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';

export default function MainContainer(){
    const [onTop, setOnTop] = useState("left")
    return <div className={'main-container'}>
        <Header/>
        <StatusBar/>
        <div>
           <LeftSideBar onTop = {onTop} setOnTop = {setOnTop}/>
           <RightSideBar onTop = {onTop} setOnTop = {setOnTop}/>
            <div className={'viewport-container'}>
                <ViewPortContainer/>
                <PrintPreviewBar />
            </div>
        </div>
    </div>
}

