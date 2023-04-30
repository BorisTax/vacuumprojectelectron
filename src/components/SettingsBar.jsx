import React from 'react';
import { useSelector } from 'react-redux';
import CheckBox from './CheckBox';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';

export default function SettingsBar(props) {
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.settings)
    return <ToolBar caption={captions.title} expanded={false}>
        <CheckBox title={captions.showModule} value={props.settings.drawModule} onChange={(value) => { appActions.setDrawModule(value); }} />
        <CheckBox title={captions.deleteConfirm} value={props.settings.deleteConfirm} onChange={(value) => { appActions.setDeleteConfirm(value); }} />
    </ToolBar>
}
