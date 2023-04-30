import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import InformationBar from "./InformationBar";
import InstrumentsBar from "./InstrumentsBar";
import MaterialBar from "./MaterialBar";
import PropertyBar from "./PropertyBar";
import SettingsBar from "./SettingsBar";
import SideBarButton from "./SideBarButton";
import TablesBar from "./TablesBar";

export default function RightSideBar(props) {
  const [visible, setVisible] = useState(true);
  const appData = useSelector(store => store)
  const selectedPanels = appData.panels.filter(p => p.state.selected)
  if (appData.status === Status.CREATE) selectedPanels.push(appData.curShape);
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  const style = visible ? {} : { display: 'none' }
  const zIndex = props.onTop === "right"?2:1;
  return (
    <div className="right-sidebar" style={{zIndex}}>
      <div className="sidebar-content" style={style} onPointerDown={()=>props.setOnTop("right")}>
        <InformationBar disabled={disabled} />
        <MaterialBar disabled={disabled} />
        <TablesBar disabled={disabled} />
        <InstrumentsBar
          disabled={disabled}
          selectedPanels={selectedPanels}
        />
        <PropertyBar
          selectedPanels={selectedPanels}
          panelMargin={appData.panelMargin}
        />
        <SettingsBar
          disabled={disabled}
          settings={{ drawModule: appData.drawModuleInCaption, deleteConfirm: appData.deleteConfirm }}
        />
      </div>
      <SideBarButton right expanded={visible} click={() => {
              setVisible(prev => !prev)
              if(visible) props.setOnTop("right")}
              }
              />
    </div>
  );
}
