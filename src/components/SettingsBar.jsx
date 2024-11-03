import React from 'react';
import { useSelector } from 'react-redux';
import CheckBox from './CheckBox';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';

export default function SettingsBar(props) {
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.settings)
    return <ToolBar caption={captions.title} expanded={false}>
        <CheckBox title={captions.showModule} value={props.settings.drawModuleInCaption} onChange={(value) => { appActions.setDrawModule(value); }} />
        <CheckBox title={captions.deleteConfirm} value={props.settings.deleteConfirm} onChange={(value) => { appActions.setDeleteConfirm(value); }} />
        <CheckBox title={captions.allPlacedForce} value={props.settings.allPlacedForce} onChange={(value) => { appActions.setAllPlacedForce(value); }} />
    </ToolBar>
}
