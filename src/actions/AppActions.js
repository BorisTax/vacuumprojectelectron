export const AppActions = {
  SET_LANGUAGE: "SET_LANGUAGE",
  REQUEST_LANGUAGE: "REQUEST_LANGUAGE",
  SHOW_HELP: "SHOW_HELP",
  SHOW_CONFIRM: "SHOW_CONFIRM",
  SHOW_ALERT: "SHOW_ALERT",
  setLanguage(captions) {
    return {
      type: AppActions.SET_LANGUAGE,
      payload: captions,
    };
  },
  requestLanguage(lang) {
    return (dispatch) => {
      fetch("/lang", {
        method: "POST",
        body: JSON.stringify({ lang: lang }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((capt) => dispatch(AppActions.setLanguage(capt)))
        .catch((e) => {
          console.error(e);
        });
    };
  },
  showHelp(show) {
    return {
      type: AppActions.SHOW_HELP,
      payload: show,
    };
  },
  showConfirm(show, messageKey = "", actions = []) {
    return {
      type: AppActions.SHOW_CONFIRM,
      payload: { show, messageKey, actions },
    };
  },
  showAlert(show, message) {
    return {
      type: AppActions.SHOW_ALERT,
      payload: { show, message },
    };
  },
  blink() {
    const form = document.querySelector(".modal-container > .toolbar-modal");
    const oldColor = form.style.backgroundColor;
    var count = 0;
    const int = setInterval(() => {
      if (form.style.backgroundColor === oldColor)
        form.style.backgroundColor = "red";
      else form.style.backgroundColor = oldColor;
      if (++count > 3) {
        clearInterval(int);
        form.style.backgroundColor = oldColor;
      }
    }, 10);
  },
};
