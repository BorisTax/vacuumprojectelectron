import CancelKeyHandler from "./CancelKeyHandler";
import DeleteKeyHandler from "./DeleteKeyHandler";

export const keyHandlers = [
    { ctrlKey: false, shiftKey: false, altKey: false, keyCode: 46, handler: DeleteKeyHandler },
    { ctrlKey: false, shiftKey: false, altKey: false, keyCode: 27, handler: CancelKeyHandler },
]