import { Status } from "../reducers/functions";
export const ScreenActions = {
  ABORT:'ABORT',
  ADD_PANEL: "ADD_PANEL",
  ARRANGE_PANELS:"ARRANGE_PANELS",
  CANCEL: "CANCEL",
  CANCEL_MOVING:"CANCEL_MOVING",
  CANCEL_SELECTION: "CANCEL_SELECTION",
  CENTER_TO_POINT: "CENTER_TO_POINT",
  CREATE_PANEL: "CREATE_PANEL",
  DELETE_CONFIRM: "DELETE_CONFIRM",
  DELETE_SELECTED_PANELS: "DELETE_SELECTED_PANELS",
  FLIP_ORIENTATION: "FLIP_ORIENTATION",
  GO_TO_ACTIVE_TABLE: "GO_TO_ACTIVE_TABLE",
  PAN_SCREEN: "PAN_SCREEN",
  PRINT: "PRINT",
  REPAINT: "REPAINT",
  SELECT_ALL: "SELECT_ALL",
  SELECT_PANEL: "SELECT_PANEL",
  SET_CURSOR:"SET_CURSOR",
  SET_CUR_COORD: "SET_CUR_COORD",
  SET_DIMENSIONS: "SET_DIMENSIONS",
  SET_PREV_STATUS: "SET_PREV_STATUS",
  SET_RATIO: "SET_RATIO",
  SET_REAL_WIDTH: "SET_REAL_WIDTH",
  SET_SCALE: "SET_SCALE",
  SET_SNAP: "SET_SNAP",
  SET_STATUS: "SET_STATUS",
  SET_TOP_LEFT: "SET_TOP_LEFT",
  START_SELECTION: "START_SELECTION",
  STOP_SELECTION: "STOP_SELECTION",
  START_MEASURING: "START_MEASURING",
  UPDATE_PLACED_DETAILS:"UPDATE_PLACED_DETAILS",
  abort: () => {
    return {
      type: ScreenActions.ABORT,
    };
  },
  addShape: shape => {
    return {
      type: ScreenActions.ADD_PANEL,
      payload: shape
    };
  },
  arrangePanels({hor,vert}){
    return {
      type: ScreenActions.ARRANGE_PANELS,
      payload:{hor,vert}
    }
  },
  cancel: () => {
    return {
      type: ScreenActions.CANCEL
    };
  },
  cancelMoving: () => {
    return {
      type: ScreenActions.CANCEL_MOVING
    };
  },
  cancelSelection: () => {
    return {
      type: ScreenActions.CANCEL_SELECTION
    };
  },
  centerToPoint: p => {
    return {
      type: ScreenActions.CENTER_TO_POINT,
      payload: p
    };
  },

  deleteConfirm: () => {
    return {
      type: ScreenActions.DELETE_CONFIRM
    };
  },
  deleteSelectedPanels: () => {
    return {
      type: ScreenActions.DELETE_SELECTED_PANELS
    };
  },
  flipOrientation: () => {
    return {
      type: ScreenActions.FLIP_ORIENTATION
    };
  },
  goToActiveTable: () => {
    return {
      type: ScreenActions.GO_TO_ACTIVE_TABLE
    };
  },
  print: ({save}) => {
    return {
      type: ScreenActions.PRINT,
      payload: save
    };
  },

  repaint: () => {
    return {
      type: ScreenActions.REPAINT
    };
  },
  selectPanels: selectedPanels => {
    return {
      type: ScreenActions.SELECT_PANEL,
      payload: selectedPanels
    };
  },
  setCursor: (cursor) => {
    return {
      type: ScreenActions.SET_CURSOR,
      payload: cursor
    };
  },
  setCurCoord: (point, screenPoint) => {
    return {
      type: ScreenActions.SET_CUR_COORD,
      payload: { point, screenPoint }
    };
  },

  setDimensions: (width, height, realWidth, topLeft) => {
    return {
      type: ScreenActions.SET_DIMENSIONS,
      payload: { width, height, realWidth, topLeft }
    };
  },

  setPrevStatus: () => {
    return {
      type: ScreenActions.SET_PREV_STATUS
    };
  },
  setRatio: ratio => {
    return {
      type: ScreenActions.SET_RATIO,
      payload: ratio
    };
  },
  setRealWidth: width => {
    return {
      type: ScreenActions.SET_REAL_WIDTH,
      payload: width
    };
  },
  setScale: (scale, anchor) => {
    return {
      type: ScreenActions.SET_SCALE,
      payload: { scale, anchor }
    };
  },
  setScreenStatus: (status = Status.FREE, params) => {
    let payload = null;
    let type = null;
    switch (status) {
      case Status.SELECT:
        type = ScreenActions.START_SELECTION;
        break;
      case Status.CREATE:
        type = ScreenActions.CREATE_PANEL;
        payload = { creator: params.creator };
        break;
      case Status.CANCEL:
        type = ScreenActions.CANCEL;
        break;
      case Status.PAN:
        type = ScreenActions.PAN_SCREEN;
        payload = params
        break;
      default:
    }
    return {
      type,
      payload
    };
  },
  setTopLeft: p => {
    return {
      type: ScreenActions.SET_TOP_LEFT,
      payload: p
    };
  },
  startMeasuring(){
    return {
      type:ScreenActions.START_MEASURING
    }
  },
  startSelection(point){
    return {
      type:ScreenActions.START_SELECTION,
      payload:point
    }
  },
  stopSelection(isSelectedPanels){
    return {
      type:ScreenActions.STOP_SELECTION,
      payload:isSelectedPanels
    }
  },
  updatePlacedDetails: () => {
    return {
      type: ScreenActions.UPDATE_PLACED_DETAILS
    };
  },
};
