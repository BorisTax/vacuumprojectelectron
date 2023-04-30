import React from 'react';
import ToolBar from './ToolBar';
import Counter from './Counter';
import CheckBox from './CheckBox';
import useActions from '../customHooks/useActions';
import ToolButton from './ToolButton';
import TextBox from './TextBox';
import { useSelector } from 'react-redux';

export default function PropertyBar(props) {
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.property)
    const deleteConfirm = useSelector(store => store.deleteConfirm)
    let panel;
    let message = '';
    let marginSpan = <></>
    let forcePlaceInput = <></>
    if (props.selectedPanels.length === 0) {
        panel = captions.noselected
    }
    if (props.selectedPanels.length > 0) {
        panel = props.selectedPanels[0].caption
        const setValue = (value) => {
            for (let p of props.selectedPanels) {
                p.setMargin(value);
            }
            appActions.updateState()
        }
        marginSpan = <span style={{ display: "flex", alignItems: "center" }}>
            {captions.margin}
            <Counter value={props.selectedPanels[0].model.margin} min={0} max={props.panelMargin / 2} setValue={setValue} />
        </span>

        forcePlaceInput = !props.selectedPanels[0].state.canBePlaced || props.selectedPanels[0].model.placedForce ? <CheckBox title={captions.force}
            value={props.selectedPanels[0].model.placedForce}
            onChange={(value) => {
                props.selectedPanels[0].setPlacedForce(value);
                appActions.updateState()
            }}
        /> : forcePlaceInput
    }
    if (props.selectedPanels.length > 1) {
        panel = `${captions.selected} ${props.selectedPanels.length}`
    }
    if (props.selectedPanels.length === 1) {
        message = props.selectedPanels[0].state.message?captions[props.selectedPanels[0].state.message]:""
    }
    const deleteButton = props.selectedPanels.length > 0 ? <ToolButton icon="delete" title={captions.delete} onClick={() => { deleteConfirm ? appActions.deleteConfirm() : appActions.deleteSelectedPanels() }} /> : <></>
    return <ToolBar caption={captions.title}>
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
            <span style={{ fontSize: "medium" }}>{panel}</span>
            {marginSpan}
            {forcePlaceInput}
            {deleteButton}
            <TextBox text={message} extClass = {["textbox-wrap"]}/>
        </div>
    </ToolBar>
}
