import React from 'react';
import StatusBar from './StatusBar.jsx';
import ViewPortContainer from './ViewPortContainer';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';

export default function MainContainer(){
    return <div className={'main-container'}>
           <LeftSideBar />
           <RightSideBar />
            <div className={'viewport-container'}>
                <ViewPortContainer/>
                <StatusBar/>
            </div>
    </div>
}

