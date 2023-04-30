import React from "react";
import { useSelector } from "react-redux";
import { Status } from "../reducers/functions";
import useActions from "../customHooks/useActions";
import DetailListBar from "./DetailListBar";

export default function LeftSideBar() {
  const appData = useSelector(store => store)
  const captions = useSelector(store => store.captions.toolbars.detailList)
  const appActions = useActions()
  const disabled = (appData.status === Status.MEASURE || appData.status === Status.PAN)
  return (
    <div className="left-sidebar">
      <div className="sidebar-content">
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
