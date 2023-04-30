import React from 'react';
import { useSelector } from 'react-redux';
import CheckBox from './CheckBox';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import Input from './Input';

export default function MaterialBar({ disabled }) {
    const appData = useSelector(store => store)
    const captions = useSelector(store => store.captions.toolbars.material)
    const mat = appData.material;
    const appActions = useActions()
    return <ToolBar caption={captions.title}>
        <Input value={mat.name} wide = {true} disabled={disabled} onChange = {(value) => {appActions.setMaterial({ ...mat, name: value })}}/>
        <CheckBox title={captions.gloss} value={mat.gloss} onChange={(value) => { appActions.setMaterial({ ...mat, gloss: value }) }} />
        <CheckBox title={captions.texture} value={mat.texture} onChange={(value) => { appActions.setMaterial({ ...mat, texture: value }) }} />
        <div>{`${captions.offset} ${appData.panelMargin}`}</div>
        <div>{mat.texture ? captions.norotate : captions.rotate}</div>
    </ToolBar>
}
