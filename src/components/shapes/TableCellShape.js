import {Rectangle} from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import RectangleShape from './RectangleShape';
import TextShape from './TextShape';
export default class TableCellShape extends Shape{
    constructor(model){
        super();
        this.model={...model,topLeft:{x:-3000,y:0},bottomRight:{x:0,y:0},align:TextShape.CENTER};
        this.outerRect=new RectangleShape(new Rectangle())
        this.outerRect.setStyle(new ShapeStyle(Color.BLACK,ShapeStyle.SOLID));
        this.caption=new TextShape(this.model.text)
        this.caption.setFillStyle(Color.BLACK);
        this.screenRect={}
    }
    drawSelf(ctx, realRect, screenRect) {
        super.drawSelf(ctx,realRect, screenRect)
        this.outerRect.drawSelf(ctx, realRect, screenRect)
        this.caption.drawSelf(ctx, realRect, screenRect,this.model.font)
    }
    refresh(realRect, screenRect){
        let point={};
        switch(this.model.align){
            case TextShape.CENTER:
                point={x:(this.outerRect.model.topLeft.x+this.outerRect.model.bottomRight.x)/2,
                        y:(this.outerRect.model.topLeft.y+this.outerRect.model.bottomRight.y)/2}
                break;
            case TextShape.LEFT:
                point={x:this.outerRect.model.topLeft.x,
                    y:(this.outerRect.model.topLeft.y+this.outerRect.model.bottomRight.y)/2}    
                break;
            case TextShape.RIGHT:
                point={x:this.outerRect.model.bottomRight.x,
                    y:(this.outerRect.model.topLeft.y+this.outerRect.model.bottomRight.y)/2}    
                break;
            default:
        }
        this.caption.setPoint(point);
        this.caption.setAnchor({horizontal:this.model.align,vertical:TextShape.CENTER});
    }
    setPosition(topLeft,bottomRight){
        this.outerRect.model.topLeft={...topLeft}
        this.outerRect.model.bottomRight={...bottomRight}
        this.outerRect.model.width=bottomRight.x-topLeft.x
        this.outerRect.model.height=topLeft.y-bottomRight.y
    }
    setAlign(align){
        this.model.align=align
    }
    setText(text){
        this.caption.setText(text);
    }

    refreshModel(){

    }

}