import React from 'react';
import { useSelector } from 'react-redux';
import ToolBar from './ToolBar';

export default function PrintPreviewBar(){
    const captions = useSelector(store => store.captions.toolbars.print)
        return (
        <ToolBar caption={captions.title} expandable={false}>
            <iframe id="print-frame" name="print-frame" title="print-frame"
            onLoad={
                function(e){
                    const frame = e.target
                    frame.style.width = '100%';
                    frame.style.height = '700px'
                    frame.style.display = 'block';
                    frame.scrollIntoView({behavior:"smooth"})
                }
            }
            />
        </ToolBar>
        );
    }

