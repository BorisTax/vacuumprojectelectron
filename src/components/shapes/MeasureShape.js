import Geometry,{Rectangle} from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import {PropertyTypes} from "./PropertyData";
import RectangleShape from './RectangleShape';
import TextShape from './TextShape';
export default class MeasureShape extends Shape{
    constructor(model){
        super();
        this.model={...model,topLeft:{x:-3000,y:0},bottomRight:{x:0,y:0},vertical:true,active:false};
        this.model.origWidth=this.model.width
        this.model.origLength=this.model.length
        this.model.position={x:-10000,y:0}
        this.state.canBePlaced=true;
        this.innerRect=new RectangleShape(new Rectangle())
        this.outerRect=new RectangleShape(new Rectangle())
        this.innerRect.setStyle(new ShapeStyle(Color.BLACK,ShapeStyle.SOLID));
        this.outerRect.setStyle(new ShapeStyle(Color.BLACK,ShapeStyle.DASH));
        this.captionShape=new TextShape()
        this.state.selected=true;
        this.captionShape.setFillStyle(Color.BLACK);
        this.screenRect={}
        this.properties=[
            {type:PropertyTypes.STRING,labelKey:"name",public:true},
            {type:PropertyTypes.STRING,labelKey:"dimensions",public:true},
            {type:PropertyTypes.VERTEX,labelKey:"position"},
            {type:PropertyTypes.BOOL,labelKey:"orientation"},
        ]
        this.defineProperties();
    }
    drawSelf(ctx, realRect, screenRect) {
        super.drawSelf(ctx,realRect, screenRect)
        this.outerRect.drawSelf(ctx, realRect, screenRect)
        if(this.state.selected||this.state.highlighted){this.innerRect.getStyle().setWidth(2)}else{this.innerRect.getStyle().setWidth(1)}
        this.innerRect.drawSelf(ctx, realRect, screenRect)
        this.captionShape.drawSelf(ctx, realRect, screenRect)
    }
    refresh(realRect, screenRect){
        let color=Color.BLACK
        this.innerRect.setColor(color);
        this.outerRect.setColor(color);
        const point={x:(this.innerRect.model.topLeft.x+this.innerRect.model.bottomRight.x)/2,
                    y:(this.innerRect.model.topLeft.y+this.innerRect.model.bottomRight.y)/2}
        this.captionShape.setPoint(point);
        this.captionShape.setColor(color);

        const captionAngle=this.model.length>this.model.width?0:-Math.PI/2;
        this.captionShape.rotate(captionAngle);
        const fitRect={}
        fitRect.width=Geometry.realToScreenLength(this.model.length,realRect.width,screenRect.width)
        fitRect.height=this.model.width>100?Geometry.realToScreenLength(this.model.width,realRect.width,screenRect.width):Geometry.realToScreenLength(this.model.width+this.model.margin,realRect.width,screenRect.width)
        
        this.captionShape.setFitRect(fitRect);
    }
    setCaption(){
        this.caption=`   ${this.innerRect.model.width}x${this.innerRect.model.height}   `;
        this.captionShape.setText(this.caption);
    }
    setPosition(pos){
        this.model.position={...pos}
        this.refreshModel()
    }
    getPosition(){
       return this.model.position
    }
    setTableId(id){
        this.model.tableId=id;
    }
    getTableId(id){
        return this.model.tableId;
    }
    getId(){
        return this.model.id;
    }
    getMarkers(){
        let list=[];
        return list;
    }
    flipOrientation(){

    }
    refreshModel(){
        this.setCaption();
        this.model.topLeft={x:this.model.position.x,y:this.model.position.y}
        this.model.bottomRight={x:this.model.position.x+this.model.length,y:this.model.position.y-this.model.width}
        const midX=(this.model.bottomRight.x-this.model.topLeft.x)/2
        const midY=(this.model.topLeft.y-this.model.bottomRight.y)/2
        let tl={x:this.model.position.x+this.model.margin,y:this.model.position.y-this.model.margin}
        let br={x:this.model.bottomRight.x-this.model.margin,y:this.model.bottomRight.y+this.model.margin}
        this.outerRect.setCorners(this.model.topLeft,this.model.bottomRight);
        if(this.model.length<this.model.margin*2) {
            tl.x=this.model.topLeft.x+midX
            br.x=tl.x
        }
        if(this.model.width<this.model.margin*2) {
            tl.y=this.model.topLeft.y-midY
            br.y=tl.y
        }
        this.innerRect.setCorners(tl,br);
    }
    isPointInside(p){
        return (p.x>=this.outerRect.model.topLeft.x)&&(p.x<=this.outerRect.model.topLeft.x+this.outerRect.model.width)&&(p.y<=this.outerRect.model.topLeft.y)&&(p.y>=this.outerRect.model.topLeft.y-this.outerRect.model.height);
    }
    getDistance(point) {

    }
    isInRect(topLeft,bottomRight){
        return {cross:false,full:false};    
    }
    toString(){
        return "Rectangle";
    }
    getDescription(){
        return 'Rectangle';
    }
}