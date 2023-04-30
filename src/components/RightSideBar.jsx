import React from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import InformationBar from "./InformationBar";
import InstrumentsBar from "./InstrumentsBar";
import MaterialBar from "./MaterialBar";
import PropertyBar from "./PropertyBar";
import SettingsBar from "./SettingsBar";
import TablesBar from "./TablesBar";

export default function RightSideBar() {
  const appData = useSelector(store => store)
  const selectedPanels = appData.panels.filter(p => p.state.selected)
  if (appData.status === Status.CREATE) selectedPanels.push(appData.curShape);
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  return (
    <div className="right-sidebar">
      <div className="sidebar-content">
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
    </div>
  );
}
