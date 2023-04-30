import React, { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import ToolBar from './ToolBar';

export default function Log(){
    const status = useSelector(store => store.status)
    const prevStatus = useSelector(store => store.prevStatus)
    const event = useSelector(store => store.events.event)
    const log = useSelector(store => store.events.log)
    const logs = log.map((event, i) => <p>{i};{event}; prev:{prevStatus}</p>)
        return <div className={"log"}>
            <ToolBar noTitle={true} wide={true}>
               {logs}
            </ToolBar>
        </div>
}
