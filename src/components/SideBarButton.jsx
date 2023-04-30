import React from "react"
import { useSelector } from "react-redux"

export default function SideBarButton({ left, right, expanded, click }) {
    let arrow
    if (left) arrow = expanded ? "arrowLeft" : "arrowRight"
    if (right) arrow = expanded ? "arrowRight" : "arrowLeft"
    const captions = useSelector(store => store.captions.toolbars.detailList)
    const caption = expanded ? captions.hide : captions.unhide
    return <div className='sidebar-button toolbar noselect' onClick={() => click()}>
        <div className={arrow}></div>
        <span className="sidebar-button-caption">{caption}</span>
        <div className={arrow}></div>
    </div>
}
