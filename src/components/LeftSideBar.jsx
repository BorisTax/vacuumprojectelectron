import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import useActions from "../customHooks/useActions";
import DetailListBar from "./DetailListBar";
import ProjectBar from "./ProjectBar";
import SideBarButton from "./SideBarButton";

export default function LeftSideBar(props) {
  const [visible, setVisible] = useState(true);
  const appData = useSelector(store => store)
  const captions = useSelector(store => store.captions.toolbars.detailList)
  const appActions = useActions()
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  const style = visible ? {} : {display: 'none'}
  const zIndex = props.onTop === "left"?2:1;
  return (
    <div className="left-sidebar" style={{zIndex}}>
      <SideBarButton left expanded={visible} click={() => {
              setVisible(prev => !prev)
              if(visible) props.setOnTop("left")}
              }
              />
      <div className="sidebar-content" style={style} onPointerDown={()=> props.setOnTop("left")}>
        <ProjectBar disabled={disabled} />
        <DetailListBar
          disabled={disabled}
          caption={captions.primary}
          listKey="primary"
          load={appActions.loadDetailList}
        />
        <DetailListBar
          disabled={disabled}
          caption={captions.secondary}
          listKey="secondary"
          load={appActions.loadDetailList}
        />
      </div>
    </div>
  );
}
