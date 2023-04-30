export default class TouchManager{
    touches = []
    prevDiff = -1
    addTouchEvent(event){
        this.touches.push(event)
    }
    removeTouchEvent(pointerId){
        const index = this.touches.findIndex((event) => event.pointerId === pointerId);
        if(index >= 0) this.touches.splice(index, 1);
        this.prevDiff = -1
    }
    setPoint(pointerId, point){
        const index = this.touches.findIndex((event) => event.pointerId === pointerId);
        if(index >= 0) this.touches[index].curPoint = point
    }
    getTouchCount(){
        return this.touches.length
    }
}