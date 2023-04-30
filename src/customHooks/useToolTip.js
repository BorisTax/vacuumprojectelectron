import { useEffect } from "react";
import { isMobile } from "../reducers/functions";

export const useToolTip = (title) => {
  const toolTip = document.getElementById("tooltip");
  const onMouseOver = (e) => {
    if(isMobile()) return
    const { top:elementTop, left:elementLeft, height:elementHeight} = e.target.getBoundingClientRect();
    if (title) {
      toolTip.innerText = title;
      toolTip.style.display = "inline";
      toolTip.style.fontSize = "0.8rem"
      const {width:toolTipWidth, height:toolTipHeight} = toolTip.getBoundingClientRect()
      let top = elementTop + elementHeight + window.scrollY + 5
      let left = elementLeft + window.scrollX 
      if((left + toolTipWidth)>window.innerWidth){
              toolTip.style.right = "0px";
              toolTip.style.left = "auto";}
              else{
              toolTip.style.left = left + "px";
              toolTip.style.right = "auto"
            }
      if((elementTop + elementHeight + toolTipHeight + 5)>window.innerHeight){
              toolTip.style.bottom = "0px";
              toolTip.style.top = "auto";
              }else{
                toolTip.style.bottom = "auto";
                toolTip.style.top = top + "px";
              }
  }
}
  const onMouseLeave = () => {
    toolTip.style.display = "none";
  }
  useEffect(()=>{return ()=>{
    toolTip.style.display = "none";
  }},[])
  return { onMouseOver, onMouseLeave };
};
