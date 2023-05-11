import messages from '../messages.js'

export const captions = { 
  "user":{"name":"Guest"},
  "about":{
    "name":"Автор: Тахмазов Борис",
    "email":"tboris1983@gmail.com"
    },
    "buttons":{
      "cancel":"Вiдмiнити",
      "logout":"Вихiд",
      "login":"Вхiд",
      "signup":"Створити акаунт",
    },
    "serverMessages":{
      [messages.NO_ERROR]: "",
      [messages.ACTIVATION_SUCCEED]: "Активацiя пройшла успiшно",
      [messages.EMAIL_SEND_ERROR]: "Помилка при вiдправцi e-mail",
      [messages.INVALID_ACTIVATION_CODE]: "Невiрний код активацiї",
      [messages.INVALID_EMAIL]: "E-mail невiрного форматe",
      [messages.INVALID_NAME]: "Им'я мiстить некоректнi символи або надто коротке",
      [messages.INVALID_PASSWORD]: "Пароль мiстить некоректнi символи або надто короткий",
      [messages.INVALID_USER_DATA]: "Невiрнi им'я, e-mail або пароль",
      [messages.LOGIN_SUCCEED]: "Вхiд здiйснено",
      [messages.NO_ACTIVATED]: "Пользователь не активирован",
      [messages.PASSWORDS_NOT_MATCH]: "Паролi не збiгаються",
      [messages.REG_SUCCEED]: "Реєстрацiя пройшла успiшно. Введiть код активацiї iз отриманого e-mail",
      [messages.SERVER_ERROR]: "Помилка сервера",
      [messages.USER_EMAIL_ALLOWED]: "E-mail вiльний",
      [messages.USER_EMAIL_EXIST]: "E-mail вже зареєстровано",
      [messages.USER_NAME_ALLOWED]: "Им'я вiльне",
      [messages.USER_NAME_EXIST]: "Им'я вже зареєстровано",
      [messages.USER_EMAIL_NOT_EXIST]: "E-mail не iснує"
    },
    "registerForm":{
      "title":"Реєстрацiя",
      "name":"Им'я (мiн. 4 символа)",
      "email":"E-Mail",
      "password":"Пароль (мiн. 6 символiв)",
      "passwordAgain":"Пароль знову",
      "login": "Вхiд",
      "cancel": "Вiдмiнити",
      "showPass": "Показати пароль",
      "checkName": "Перевiрити им'я",
      "checkEmail": "Перевiрити e-mail"
    },
    "loginForm":{
      "title":"Вхiд",
      "name":"Им'я або E-mail",
      "password":"Пароль",
      "showPass":"Показати пароль",
      "cancel": "Вiдмiнити",
      "register":"Реєстрацiя",
      "remember":"Запам'ятати"     
    },
    "activation":{
      "title":"Активацiя",
      "placeholder": "Введiть код активацiї"
    },
  "toolbars":{
    "hide":"Сгорнути",
    "unhide":"Розгорнути",
    "project":{
      "title":"Проект",
      "new":"Новий проект",
      "open":"Вiдкрити проект",
      "save":"Зберегти проект",
      "preview":"Перегляд накладної",
      "savePdf":"Зберегти накладну",
      "disabled":" (недоступно для неавторизованих користувачiв)"
    },
    "detailList":{
      "hide":"Сховати панель",
      "unhide":"Показати панель",
      "primary":"Основний список",
      "secondary":"Додатковий список",
      "add":"Добавити строку",
      "module":"Модуль",
      "length":"Довжина",
      "width":"Ширина",
      "count":"Кiль-ть",
      "delete":"Видалити строку",
      "openPath": "Завантажити форму деталi",
      "deletePath": "Видалити форму деталi",
      "place":"Помiстити деталь",
      "allCreated":"Всi деталi створенi",
      "allPlaced":"Всi деталi размiщенi",
      "placedCorrectly":"Кiль-ть размiщених деталей",
      "of":"iз" 
    },
    "info":{
      "title":"Загальна iнформацiя",
      "order":"Заказ:",
      "plan":"План:",
      "date":"Дата:",
    },
    "material":{
      "title":"Матерiал",
      "gloss":"глянцевий",
      "texture":"структурний",
      "offset":"Мiнiмальний вiдступ мiж деталями ",
      "rotate":"Деталi можна повертати",
      "norotate":"Деталi не можна повертати",
    },
    "tables":{
      "title":"Розкладки",
      "add":"Добавити",
      "delete":"Видалити",
      "of":"iз",
      "complect":"Кiль-ть комплектiв",
      "goto":"Перейти до вибраної розкладки",
      "alignVert":"Центрувати за шириною",
      "alignHor":"Центрувати за довжиною",
      "type" : "Тип стола: ",
      "small" : "Маленький",
      "big" : "Великий"
    },
    "operations":{
      "title":"Операцiї",
      "measure":"Замiрити вiльне мiсце",
      "measureStop":"Вихiд iз режимe замiрювання",
      "rotate":"Повернути панель",
      "norotate":"Не можна повернути через структурного матерiалу"
    },
    "property":{
      "title":"Властивостi деталi",
      "noselected":"Немає видiлених деталей",
      "selected":"Видiлено деталей: ",
      "margin":"Вiдступ",
      "force":"встановити примусово",
      "delete":"Видалити",
      "detailNotOnTable":"Деталь не лежить на столi!",
      "detailOffsetError":"Вiдступ мiж деталями меньше мiнiмального!",
      "detailComplectError":"Недостатня кiл-сть деталей для заданої кiл-стi комплектiв!"
    },
    "settings":{
      "title":"Налаштування",
      "showModule":"вiдображати модуль на деталi",
      "deleteConfirm":"запитувати перед видаленням",
      "allPlacedForce":"встановити примусово всi деталi"
    },
    "print":{
      "title":"Перегляд накладної"
    },
    "statusbar":{
      "move":"двигати робоче поле",
      "scale":"масштаб",
      "rotate":"повернути деталь",
      "snap":"прив'язка вкл/викл",
      "stopmeasure":"вихiд iз режима замiрювання",
      "pick1":"виберiть 1-у точку прямокутника всерединi розкладки",
      "pick2":"виберiть 2-у точку прямокутника всерединi розкладки"
    },
    "viewport":{
      "tableTitle":"Розкладка",
      "module":"Модуль",
      "length":"Довжина",
      "width":"Ширина",
      "count":"Кiль-ть",
    }
  },
  "title":"Редактор розкладки деталей",
  "messages":{
    "deletePanels":"Видалити вибранi деталi?",
    "deleteTable":"Видалити вибрану розкладку?",
    "deleteRow":"Видалити строку?",
    "deletePath":"Видалити форму деталi?",
    "changeTexture":"Деякi деталi повернутi проти текстури. Розвернути назад?",
    "newProject":"Створити новий проект?",
    "corruptedProject":"Файл не вiдповiдного формату",
    "corruptedDetailList":"Файл не вiдповiдного формату",
    "wrongPath":"Форма не вiдповiдає розмiрам деталi або файл не вiдповiдного формату",
    "logout":"Ви хочете вийти?"
  },
  "selection":{
    "crossSelect":"Partial selection",
    "fullSelect":"Full selection",
    "selectedVertexes":{
      "of":"of",
      "selected":"Points selected"
    }
  },
  "showGrid":"Show grid",
  "propBar":"Properties",
  "noPanelsSelected":"Не видiленi деталi",
  "NPanelsSelected":" panels selected",
  "deleteButton":"Delete",
  "print": {
    "reportTitle":"Накладна на передачу панелей на вакуумування",
    "date":"Дата",
    "order":"Заказ",
    "plan":"План",
    "material":"Матерiал",
    "complectCount":"Кiль-ть розкладок",
    "complect":"Комплектiв",
    "module":"Модуль",
    "length":"Довжина",
    "width":"Ширина",
    "count":"Кiль-ть",
    "total":"Загалом",
    "ext":"Додатково",
    "tableTitle":"Розкладка",
    "of": "iз",
    "tableSize":"Розмiр стола",
    "offsetLength":"Мiн. вiдступ вiд країв по довжинi",
    "offsetWidth":"Мiн. вiдступ вiд країв по ширинi",
    "offsetDetails":"Мiн. вiдступ мiж деталями"
  },
  "help":{
    "title":"Довідка",
    "hotKeys":[
    {"key":"ESC","desc":"Вiдминити операцiю"},
    {"key":"Delete","desc":"Видалити вибранi деталi"},
    {"key":"Колiщатко мишi","desc":"Масштаб +/-"},
    {"key":"Середня кнопка мишi","desc":"Пересувати рабоче поле"},
    {"key":"Права кнопка мишi","desc":"Повернути вибрану деталь при перемiщеннi"},
    ]
  }
}
