import React from 'react';
import { useSelector } from 'react-redux';
import DetailRow from './DetailRow';

export default function DetailList({ disabled, listKey, active, setActive }) {
    const appData = useSelector(store => store)
    const captions = useSelector(store => store.captions.toolbars.detailList)
    
    const headerCaptions = ["№", captions.module, captions.length, captions.width, captions.count]
    const header = headerCaptions.map(h => <div key={h} className='detail-list-caption'>{h}</div>)
    header.push(<div id={"big_ok"} key={"big_ok"}></div>)
    const details = appData.detailList[listKey].flatMap((detail, index) => 
                        <DetailRow active={active.row===index}
                                    setActive={(param) => setActive(param)}
                                    disabled={disabled} 
                                    key={index} 
                                    rowIndex={index} 
                                    detail={detail} 
                                    listKey={listKey}/>)
    return <div className="detail-list">
        {header}
        {details}
    </div>

}
