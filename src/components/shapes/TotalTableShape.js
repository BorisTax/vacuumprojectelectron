
import TableShape from './TableShape';
export default class TotalTableShape extends TableShape{
    constructor(model){
        super(model);
        this.model={...model};
        this.table=[]
        const header = ["№", model.captions.length, model.captions.width, model.captions.count, model.captions.module]
        this.colCount=header.length;
        this.model.list={primary:[header,...this.model.list["primary"]],secondary:this.model.list["secondary"]}

        this.refreshModel()
        this.properties=[
        ]
        this.defineProperties();
    }

}