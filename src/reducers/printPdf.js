//import { changeDpiDataUrl } from "changedpi";
import jsPDF from "jspdf";
import TextShape from "../components/shapes/TextShape";
import TotalTableShape from "../components/shapes/TotalTableShape";
import Geometry from "../utils/geometry";

export function printToPDF(state, save) {
    const doc = new jsPDF('p', 'px', 'a4');
    doc.setFont('Courier');
    doc.setFontSize(20);
    var canv = document.createElement('canvas')
    const pixels = 11.81 / 3
    const scale = 1
    var canvWidth = 297 * pixels * scale
    var canvHeight = 210 * pixels * scale
    var canvPortWidth = 210 * pixels * scale
    var canvPortHeight = 297 * pixels * scale
    const ratio = canvWidth / canvHeight
    var screenRect = { topLeft: { x: 0, y: 0 }, bottomRight: { x: canvWidth, y: canvHeight }, width: canvWidth, height: canvHeight }
    canv.setAttribute("width", canvPortWidth)
    canv.setAttribute("height", canvPortHeight)
    // canv.style.width=`${canvWidth}px`
    // canv.style.height=`${canvHeight}px`
    var ctx = canv.getContext('2d')
    var tableCount = 0;
    const totalTableShape = makeTotalTableShape(state);
    const widthMargin = 50
    const heightMargin = 100
    const tableFitRect = {
        width: canvPortWidth - widthMargin,
        height: canvPortHeight - heightMargin,
    }
    var font;
    var titleShape = []
    const complectCount = state.tables.reduce((sum, t) => sum + t.model.multiply, 0)
    const date = state.information.currentDate.split("-").reverse().join(".");
    titleShape.push(new TextShape(state.captions.print.reportTitle));
    titleShape.push(new TextShape(`${state.captions.print.date}: ${date}`));
    titleShape.push(new TextShape(`${state.captions.print.order}: ${state.information.order}`));
    titleShape.push(new TextShape(`${state.captions.print.plan}: ${state.information.plan}`));
    titleShape.push(new TextShape(`${state.captions.print.material}:  ${state.material.name}`));
    titleShape.push(new TextShape(`${state.captions.print.complectCount}:  ${complectCount}`));
    //titleShape.reverse()
    let h;
    for (font = 20; font > 2; font--) {
        h = 0;
        let w = 0;
        for (const title of titleShape) {
            title.setAnchor({ horizontal: TextShape.LEFT })
            const { width, height } = title.getTextRect(ctx, `${font}px serif`)
            h += height;
            if (w < width) w = width;
        }
        var { totalColWidth, totalRowHeight } = totalTableShape.getDimensions(ctx, font);
        if (tableFitRect.height > (totalRowHeight + h) && tableFitRect.width > (Math.max(totalColWidth, w))) {
            break;
        }
    }
    ctx.clearRect(0, 0, canvPortWidth, canvPortHeight);

    var topLeft = { x: -300, y: 100 }
    var realWidth = 6000
    var realHeight = realWidth / ratio;
    var realTotalColWidth = Geometry.screenToRealLength(totalColWidth, realWidth, canvWidth)
    realWidth = realTotalColWidth - topLeft.x;
    realHeight = realWidth / ratio;
    var realRect = { topLeft, bottomRight: { x: topLeft.x + realWidth, y: topLeft.y - realHeight }, width: realWidth, height: realHeight }
    h = 0;
    var height;
    for (const title of titleShape) {
        title.setAnchor({ horizontal: TextShape.LEFT });
        ({ height } = title.getTextRect(ctx, `${font}px serif`))
        h += height;
        title.setPoint(Geometry.screenToReal(widthMargin, h, screenRect.width, screenRect.height, realRect.topLeft, realRect.bottomRight))
        title.drawSelf(ctx, realRect, screenRect, font)
    }
    h += height;
    totalTableShape.model.topLeft = Geometry.screenToReal(widthMargin, h, screenRect.width, screenRect.height, realRect.topLeft, realRect.bottomRight)
    totalTableShape.drawSelf(ctx, realRect, screenRect, tableFitRect, font);
    var imgData = canv.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 10);

    canv.setAttribute("width", canvWidth)
    canv.setAttribute("height", canvHeight)
    ctx.scale(1 / scale, 1 / scale)
    for (let t of state.tables) {
        tableCount++;
        ctx.clearRect(0, 0, canvWidth, canvHeight);
        topLeft = { ...t.outerRect.model.topLeft }
        realWidth = 6000
        realHeight = realWidth / ratio;
        realRect = { topLeft, bottomRight: { x: topLeft.x + realWidth, y: topLeft.y - realHeight }, width: realWidth, height: realHeight };
        ({ totalColWidth } = t.table.getDimensions(ctx, "20px serif"))
        realTotalColWidth = Geometry.screenToRealLength(totalColWidth, realWidth, canvWidth)
        topLeft.y += 500
        topLeft.x -= 100
        realWidth = t.outerRect.model.bottomRight.x + realTotalColWidth - topLeft.x;
        realHeight = realWidth / ratio;

        realRect = { topLeft, bottomRight: { x: topLeft.x + realWidth, y: topLeft.y - realHeight }, width: realWidth, height: realHeight }
        titleShape = []
        var footerShape = []
        const date = state.information.currentDate.split("-").reverse().join(".");
        titleShape.push(new TextShape(`${state.captions.print.date}: ${date}`));
        titleShape.push(new TextShape(`${state.captions.print.order}: ${state.information.order}`));
        titleShape.push(new TextShape(`${state.captions.print.plan}: ${state.information.plan}`));
        titleShape.push(new TextShape(`${state.captions.print.material}:  ${state.material.name}`));
        const complect = t.model.multiply > 1 ? `  ${state.captions.print.complect} - ${t.model.multiply}` : ''
        titleShape.push(new TextShape(`${state.captions.print.tableTitle} ${tableCount} ${state.captions.print.of} ${state.tables.length} ${complect}`));
        footerShape.push(new TextShape(`${state.captions.print.tableSize}: ${t.model.length}x${t.model.width}  `));
        footerShape.push(new TextShape(`${state.captions.print.offsetLength}: ${state.tableMarginLength}мм`));
        footerShape.push(new TextShape(`${state.captions.print.offsetWidth}: ${state.tableMarginWidth}мм`));
        footerShape.push(new TextShape(`${state.captions.print.offsetDetails}: ${state.panelMargin}мм`));
        titleShape.reverse()
        h = 0;
        for (const title of titleShape) {
            title.setAnchor({ horizontal: TextShape.LEFT })
            var { height: titleHeight } = title.getTextRect(ctx, "20px serif")
            h += titleHeight;
            title.setPoint({ x: t.outerRect.model.topLeft.x, y: t.outerRect.model.topLeft.y + Geometry.screenToRealLength(h, realRect.width, screenRect.width) })
            title.drawSelf(ctx, realRect, screenRect, 20)
        }
        t.drawSelf(ctx, realRect, screenRect, true, 0, 20)

        for (let p of state.panels) {
            if (p.getTableId() === t.getId()) {
                p.state.selected = false;
                p.state.highlighted = false;
                if (p.state.canBePlaced || p.model.placedForce) p.drawSelf(ctx, realRect, screenRect, true)
            }
        }
        //ctx.scale(scale,scale)
        h = 0;
        for (const footer of footerShape) {
            footer.setAnchor({ horizontal: TextShape.LEFT });
            ({ height } = footer.getTextRect(ctx, "20px serif"))
            h += height;
            footer.setPoint({ x: t.outerRect.model.topLeft.x, y: t.outerRect.model.bottomRight.y - Geometry.screenToRealLength(h, realRect.width, screenRect.width) })
            footer.drawSelf(ctx, realRect, screenRect, 20)
        }
        imgData = canv.toDataURL('image/png');
        //let dataUrlWithDpi = changeDpiDataUrl(imgData, 300)
        doc.addPage([], 'l')
        doc.addImage(imgData, 'PNG', 10, 10);

    }
    if(save) {
        const fileName = `${state.information.plan} - ${state.material.name}.pdf`
        doc.save(fileName);
        }
        else
        window.open(doc.output('bloburl'), 'print-frame');
}


function makeTotalTableShape(state) {
    const pList = { primary: {}, secondary: {} }
    for (const panel of state.panels) {
        if (panel.state.canBePlaced || panel.model.placedForce) {
            const id = panel.getId()
            const listKey = panel.model.listKey
            if (pList[listKey][id]) {
                pList[listKey][id].count += panel.model.multiply;
            } else {
                pList[listKey][id] = {
                    id,
                    length: panel.model.origLength,
                    width: panel.model.origWidth,
                    count: panel.model.multiply,
                    module: panel.model.module ? panel.model.module : ""
                }
            }
        }
    }

    const list = { primary: [], secondary: [] }
    for (const listKey of ["primary", "secondary"]) {
        let totalCount = 0
        for (const key in pList[listKey]) {
            list[listKey].push([
                pList[listKey][key].id,
                pList[listKey][key].length,
                pList[listKey][key].width,
                pList[listKey][key].count,
                pList[listKey][key].module,
            ])
            totalCount += pList[listKey][key].count
        }
        if (totalCount > 0) list[listKey].push(["", state.captions.print.total, "", totalCount, ""])
    }
    return new TotalTableShape({
        topLeft: { x: 0, y: 0 },
        list, captions: state.captions.print
    })
}