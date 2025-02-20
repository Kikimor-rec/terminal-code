// scripts/terminal.mjs

/**
 * Класс TerminalInterface отвечает за имитацию терминала Базы Грета в Foundry VTT.
 * Здесь реализовано открытие диалога, вывод текста с анимацией, обработка ввода и меню.
 */
export class TerminalInterface {
  /**
   * Открывает терминал, если он ещё не открыт.
   */
  static openTerminal() {
    // Если диалог уже открыт, не открываем повторно
    if (document.getElementById("terminal-dialog")) {
      console.log("[TerminalInterface] Терминал уже открыт.");
      return;
    }
    console.log("[TerminalInterface] openTerminal() вызван.");
    new Dialog({
      title: "ТЕРМИНАЛ БАЗЫ ГРЕТА", // Заголовок диалога (переведён)
      content: `
        <style>
          /* Стили для терминала */
          #terminal-dialog .dialog-buttons { display: none !important; }
          #terminal-dialog .dialog-content { padding: 0 !important; }
          #terminal-dialog { background-color: #000 !important; border: 2px solid #00ff00; }
          .terminal-font { background-color: #000; color: #00ff00; font-family: "Courier New", Courier, monospace; }
          #content { padding: 10px; height: 300px; overflow-y: auto; border-bottom: 1px solid #00ff00; white-space: pre-wrap; }
          @keyframes flicker { 0% { opacity: 1; } 50% { opacity: 0.95; } 100% { opacity: 1; } }
          #content { animation: flicker 2s infinite; }
          #lower { padding: 10px; height: 300px; overflow-y: auto; white-space: pre-wrap; border-top: 1px solid #00ff00; }
          .fallout-menu .menu-item { margin: 4px 0; }
          .fallout-menu .selected { background-color: #00ff00; color: #000; }
          input.login-input { border: 1px solid #00ff00; background: #000; color: #00ff00; font-family: monospace; font-size: 14px; margin: 4px 0; width: 100%; box-sizing: border-box; }
          .cursor { display: inline-block; width: 8px; background-color: #00ff00; margin-left: 2px; animation: blink 1s infinite; }
          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        </style>
        <div id="content" class="terminal-font"></div>
        <div id="lower" class="terminal-font"></div>
      `,
      buttons: {},
      default: null,
      render: (html) => {
        console.log("[TerminalInterface] Диалог отрисован.");
        const contentDiv = html.find("#content")[0];
        const lowerDiv = html.find("#lower")[0];

        // Вывод ASCII-графики
        const asciiArtLines = [

         "  ██████╗ ███╗   ███╗███╗   ██╗██╗ ██████╗ ██████╗ ███╗   ███╗",
         " ██╔═══██╗████╗ ████║████╗  ██║██║██╔════╝██╔═══██╗████╗ ████║",
         " ██║   ██║██╔████╔██║██╔██╗ ██║██║██║     ██║   ██║██╔████╔██║",
         " ██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║     ██║   ██║██║╚██╔╝██║",
         " ╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║╚██████╗╚██████╔╝██║ ╚═╝ ██║",
          " ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝",
          "*********************************************",
          "**********ВСЁ ДЛЯ НАС - ВСЁ ДЛЯ ВАС**********",
          "*********************************************",
          "╔═══╗╔══╗╔═══╗╔══╗───╔══╗╔═══╗╔═══╗╔════╗╔══╗",
          "║╔══╝║╔╗║╚══╗║║╔╗║───║╔═╝║╔═╗║║╔══╝╚═╗╔═╝║╔╗║",
          "║╚══╗║╚╝║─╔═╝║║╚╝║───║║──║╚═╝║║╚══╗──║║──║╚╝║",
          "║╔═╗║║╔╗║─╚═╗║║╔╗║───║║──║╔══╝║╔══╝──║║──║╔╗║",
          "║╚═╝║║║║║╔══╝║║║║║───║║──║║───║╚══╗──║║──║║║║",
          "╚═══╝╚╝╚╝╚═══╝╚╝╚╝───╚╝──╚╝───╚═══╝──╚╝──╚╝╚╝"
        ];

        TerminalInterface.printLines(contentDiv, asciiArtLines, 10, () => {
          const loadingLines = [
            "> Инициализация систем...",
            "> Запуск основных протоколов...",
            "> Проверка жизненно важных систем...",
            "> Калибровка алгоритмов...",
            "> Добро пожаловать в интерфейс БАЗЫ ГРЕТА.",
            "> [ВНИМАНИЕ] Обнаружены аномальные данные. Начните диагностику немедленно."
          ];
          TerminalInterface.printLines(contentDiv, loadingLines, 25, () => {
            TerminalInterface.showLoginForm(contentDiv, lowerDiv);
          });
        });
      }
    }, {
      id: "terminal-dialog",
      width: 850,
      height: 700,
      resizable: true
    }).render(true);
  }

  /**
   * Функция выводит массив строк с заданной скоростью. После завершения вызывает onDone.
   */
  static printLines(div, linesArray, speed, onDone) {
    let lineIndex = 0;
    let charIndex = 0;
    const interval = setInterval(() => {
      const currentLine = linesArray[lineIndex];
      if (!currentLine) {
        clearInterval(interval);
        if (onDone) onDone();
        return;
      }
      if (charIndex < currentLine.length) {
        div.innerHTML += currentLine[charIndex];
        charIndex++;
      } else {
        div.innerHTML += "\n";
        lineIndex++;
        charIndex = 0;
      }
      div.scrollTop = div.scrollHeight;
    }, speed);
  }

  /**
   * Выводит переданный текст по символам с заданной скоростью.
   */
  static printText(div, text, speed, onDone) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        div.innerHTML += text[i];
        i++;
      } else {
        clearInterval(interval);
        if (onDone) onDone();
      }
      div.scrollTop = div.scrollHeight;
    }, speed);
  }

  /**
   * Отображает форму авторизации.
   */
  static showLoginForm(contentDiv, lowerDiv) {
    lowerDiv.innerHTML = `
      <div>Авторизация требуется для доступа к системам:</div>
      <input class="login-input" id="loginName" placeholder="Имя пользователя">
      <input class="login-input" id="loginPass" placeholder="Пароль" type="password">
      <div>Нажмите Enter...</div>
    `;
    const loginName = lowerDiv.querySelector("#loginName");
    const loginPass = lowerDiv.querySelector("#loginPass");
    const handleEnter = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        const user = loginName.value.trim();
        const pass = loginPass.value.trim();
        if (user === "admin" && pass === "password") {
          lowerDiv.innerHTML = "";
          TerminalInterface.printText(contentDiv, "\n> Успешная аутентификация...\n", 20, () => {
            TerminalInterface.startFalloutMenu(contentDiv, lowerDiv);
          });
        } else {
          TerminalInterface.printText(contentDiv, "\n> Неверное имя пользователя или пароль.\n", 20);
        }
      }
    };
    loginName.addEventListener("keydown", handleEnter);
    loginPass.addEventListener("keydown", handleEnter);
    loginName.focus();
  }

  /**
   * Инициализирует главное меню терминала с несколькими пунктами, включая подробное меню сотрудников.
   */
  static startFalloutMenu(contentDiv, lowerDiv) {
    const mainMenu = {
      label: "Главное меню",
      items: [
        { label: "Лог данных", action: () => TerminalInterface.cmdLogs(contentDiv) },
        { label: "Журнал", action: () => TerminalInterface.cmdJournal(contentDiv) },
        {
          label: "Личные дела",
          submenu: {
            label: "Сотрудники",
            items: [
              {
                label: "Исследовательский и технический персонал",
                submenu: {
                  label: "Исследователи и техники",
                  items: [
                    { label: "Доктор А. Эдем", action: () => TerminalInterface.cmdEdem(contentDiv) },
                    { label: "Хинтон (Синтетик)", action: () => TerminalInterface.cmdHinton(contentDiv) },
                    { label: "Доктор З. Зиглер", action: () => TerminalInterface.cmdZigler(contentDiv) },
                    { label: "В. Собел", action: () => TerminalInterface.cmdSobol(contentDiv) },
                    { label: "Доктор Кавагути", action: () => TerminalInterface.cmdKawaguti(contentDiv) },
                    { label: "Докторр Дженсен", action: () => TerminalInterface.cmdJensen(contentDiv) },
                    { label: "E. Демар,", action: () => TerminalInterface.cmdDemar(contentDiv) },
                    { label: "Назад", back: true }
                  ]
                }
              },
              {
                label: "Служба безопасности",
                submenu: {
                  label: "Сотрудники службы безопасности",
                  items: [
                    {
                      label: "2-й лейтенант Каплан",
                      submenu: {
                        label: "Каплан и его взвод",
                        items: [
                          { label: "Сержант Андерхилл", action: () => TerminalInterface.cmdAnderhill(contentDiv) },
                          { label: "2-й лейтенант Ланге", action: () => TerminalInterface.cmdLange(contentDiv) },
                          { label: "Сержант Вальдес", action: () => TerminalInterface.cmdValdes(contentDiv) },
                          { label: "Назад", back: true }
                        ]
                      }
                    },
                    {
                      label: "Отряд 'Зигзаг'",
                      submenu: {
                        label: "Отряд 'Зигзаг'",
                        items: [
                          { label: "Сержант Янг", action: () => TerminalInterface.cmdYang(contentDiv) },
                          { label: "Капрал Ксавье", action: () => TerminalInterface.cmdXavier(contentDiv) },
                          { label: "Капрал Новиков", action: () => TerminalInterface.cmdNovikov(contentDiv) },
                          { label: "Капрал Резник ", action: () => TerminalInterface.cmdReznik(contentDiv) },
                          { label: "Рядовой Танака", action: () => TerminalInterface.cmdTanaka(contentDiv) },
                          { label: "Рядовой Педро", action: () => TerminalInterface.cmdPedro(contentDiv) },
                          { label: "Рядовой Олсон", action: () => TerminalInterface.cmdOlson(contentDiv) },
                          { label: "Назад", back: true }
                        ]
                      }
                    },
                    {
                      label: "Отряд 'Сидж'",
                      submenu: {
                        label: "Отряд 'Сидж'",
                        items: [
                          { label: "Сержант Абара", action: () => TerminalInterface.cmdAbara(contentDiv) },
                          { label: "Санитар 3-го класса Брукман", action: () => TerminalInterface.cmdBrookman(contentDiv) },
                          { label: "Капрал Иванович", action: () => TerminalInterface.cmdIvanovich(contentDiv) },
                          { label: "Капрал Кадир", action: () => TerminalInterface.cmdKadir(contentDiv) },
                          { label: "Капрал Франко", action: () => TerminalInterface.cmdFranco(contentDiv) },
                          { label: "Рядовой Глокнер", action: () => TerminalInterface.cmdGlokner(contentDiv) },
                          { label: "Рядовой Уивер", action: () => TerminalInterface.cmdUiver(contentDiv) },
                          { label: "Назад", back: true }
                        ]
                      }
                    },
                    { label: "Назад", back: true }
                  ]
                }
              },
              { label: "Назад", back: true }
            ]
          }
        },
        { label: "Диагностика", action: () => TerminalInterface.cmdDiagnostics(contentDiv) },
        { label: "Перезагрузка", action: () => TerminalInterface.cmdReset(contentDiv) },
        { label: "Выгрузка зашифрованных данных", action: () => TerminalInterface.cmdExtract(contentDiv) },
        { label: "Эвакуация", action: () => TerminalInterface.cmdEvac(contentDiv) },
        { label: "Выход", exit: true }
      ]
    };

    let menuStack = [mainMenu];
    let selectedIndex = 0;
    lowerDiv.innerHTML = "";
    lowerDiv.classList.add("fallout-menu");

    const renderMenu = () => {
      const current = menuStack[menuStack.length - 1];
      lowerDiv.innerHTML = "";
      const title = document.createElement("div");
      title.innerText = `[${current.label}]`;
      lowerDiv.appendChild(title);
      current.items.forEach((item, i) => {
        const line = document.createElement("div");
        line.classList.add("menu-item");
        if (i === selectedIndex) {
          line.classList.add("selected");
          line.textContent = "> " + item.label;
        } else {
          line.textContent = "  " + item.label;
        }
        lowerDiv.appendChild(line);
      });
    };

    const menuKeyHandler = (ev) => {
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        selectedIndex = Math.max(0, selectedIndex - 1);
        renderMenu();
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        const cur = menuStack[menuStack.length - 1];
        selectedIndex = Math.min(cur.items.length - 1, selectedIndex + 1);
        renderMenu();
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        const cur = menuStack[menuStack.length - 1];
        const item = cur.items[selectedIndex];
        if (!item) return;
        if (item.submenu) {
          menuStack.push(item.submenu);
          selectedIndex = 0;
          renderMenu();
          return;
        }
        if (item.back) {
          if (menuStack.length > 1) {
            menuStack.pop();
            selectedIndex = 0;
            renderMenu();
          }
          return;
        }
        if (item.exit) {
          TerminalInterface.printText(contentDiv, "\n> Завершение сеанса...\n", 20);
          document.removeEventListener("keydown", menuKeyHandler);
          return;
        }
        if (item.action) {
          item.action();
        }
      }
    };

    document.addEventListener("keydown", menuKeyHandler);
    renderMenu();
  }

  // Функции вывода логов и журнала
  static cmdLogs(div) {
    const text = `
ЛОГИ:
- 2467: Пользователь 'admin' вошёл в систему.
- 2468: Пользователь 'admin' запустил диагностику.
- 2471: [ОШИБКА] Аномальные сигналы обнаружены.
- 2472: Пользователь 'sdfg#$%WD36' активировал протокол блокировки. Пожалуйста, подтвердите статус и перезапустите ретранслятор вручную.
- 2473: [СБОЙ] Потеря внешнего соединения.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdJournal(div) {
    const text = `
ЖУРНАЛ:
- 03.01.2525: Неисправность Планетарного Ретраслятора. Персонал оповещен.
- 03.01.2525: Персонал приступил к ремонту. 
- 03.02.2525: Неисправность Планетарного Ретраслятора. Персонал оповещен.
- 03.02.2025: Персонал приступил к ремонту. 
- 03.03.2525: Неисправность Планетарного Ретраслятора. Персонал оповещен.
- 03.03.2525: Персонал приступил к ремонту. Система оповещния о неисправности выключена.
- 23.05.2525: Обнаружен всплес сигналов. Источник не опознана.
- 24.05.2525: Активирован Карантинный блок базы Грета.
- 06.06.2525: Сбой связи. Помехи на всех частотах.
- 06.06.2525: Уведомление о чрезвычайной ситуации на базе Грета.
- 06.06.2525: Активироан протокол Альфа. Рекомендация переместить персонал на Базу Герон.
- 11.06.2525: Реактор базы Герон. Статус "ТРЕВОГА".
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  // Функции для сотрудников исследовательского и технического персонала

  static cmdEdem(div) {
    const text = `
[Доктор А. Эдем]:
- Роль: Специалист, Руководитель миссии.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdHinton(div) {
    const text = `
[Хинтон (Синтетик)]:
- Роль: Научный сотрудник.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdZigler(div) {
    const text = `
[Доктор З. Зиглер]:
- Роль: Экзобиолог.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdSobol(div) {
    const text = `
[В. Собел]:
- Роль: Ведущий инженер.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdKawaguti(div) {
    const text = `
[Доктор Кавагути]:
- Роль: Планетолог.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdJensen(div) {
    const text = `
[Докторр Дженсен]:
- Роль: Геолог.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdDemar(div) {
    const text = `
[E. Демар]:
- Роль: Механик.
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  // Функции для сотрудников службы безопасности

  static cmdAnderhill(div) {
    const text = `
[Сержант Андерхилл]:
- Роль: Сержант взвода.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdLange(div) {
    const text = `
[2-й лейтенант Ланге]:
- Роль: Пилот.
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdValdes(div) {
    const text = `
[Сержант Вальдес]:
- Роль: Техник взвода.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdYang(div) {
    const text = `
[Сержант Янг]:
- Роль: Командир отряда (Отряд "Зигзаг").
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdXavier(div) {
    const text = `
[Капрал Ксавье]:
- Роль: Водитель БТР.
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdNovikov(div) {
    const text = `
[Капрал Новиков]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdReznik(div) {
    const text = `
[Капрал Резник]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdTanaka(div) {
    const text = `
[Рядовой Танака]:
- Роль: Техник Механик.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdPedro(div) {
    const text = `
[Рядовой Педро]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdOlson(div) {
    const text = `
[Рядовой Олсон]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdAbara(div) {
    const text = `
[Сержант Абара]:
- Роль: Командир отряда (Отряд "Сидж").
Данные о последнем местоположении: - База: Грета.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdBrookman(div) {
    const text = `
[Санитар 3-го класса Брукман]:
- Роль: Взводный медик.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdIvanovich(div) {
    const text = `
[Капрал Иванович]:
- Роль: Водитель БТР.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdKadir(div) {
    const text = `
[Капрал Кадир]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdFranco(div) {
    const text = `
[Капрал Франко]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdGlokner(div) {
    const text = `
[Рядовой Глокнер]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdUiver(div) {
    const text = `
[Рядовой Уивер]:
- Роль: Член отряда.
Данные о последнем местоположении: - База: Герон.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  // Функции диагностики, перезагрузки, выгрузки и эвакуации (оставлены без изменений)

  static cmdDiagnostics(div) {
    const text = `
Диагностика:
- Сеть: НЕСТАБИЛЬНО.
- Сервер: КРИТИЧЕСКОЕ СОСТОЯНИЕ.
- Данные: ЧАСТИЧНО УТЕРЯНЫ.
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdReset(div) {
    const text = `
> Система перезагружается...
> Проверка резервной копии...
> Проверка работоспобности систем...
> Перезагрузка не возможна. Сбой Систем...
> Пожайлуста инициализируйте ручную перезагрузку систем согласно протоколу B-24-58-657
`;
    TerminalInterface.printText(div, "\n" + text + "\n", 20);
  }

  static cmdExtract(div) {
    const intro = `
[ПРЕДУПРЕЖДЕНИЕ]
Выгружая эти данные, вы подтверждаете наличие соответствующего уровня допуска и обязуетесь доставить административному сотруднику компнаии OMNICOMю В противном случе компания OMNICOM оставляет за собой право использовать любые методы для возвращения данных.
> Начало выгрузки зашифрованных данных...
`;
    TerminalInterface.printText(div, intro, 15, () => {
      const bar = document.createElement("div");
      div.appendChild(bar);
      let progress = 0;
      const total = 50;
      const intv = setInterval(() => {
        progress++;
        bar.textContent = `[${"#".repeat(progress)}${" ".repeat(total - progress)}]`;
        if (progress >= total) {
          clearInterval(intv);
          TerminalInterface.printText(div, "\n> Выгрузка завершена.\n", 15);
        }
      }, 100);
    });
  }

  static cmdEvac(div) {
    const text = `
EVACUATION:
> Протокол активирован.//
> Пытаюсь установить свзяь с ближайшим кораблем компании.//
`;
    TerminalInterface.printText(div, text, 20, () => {
      const bar = document.createElement("div");
      div.appendChild(bar);
      let progress = 0;
      const total = 50;
      const intv = setInterval(() => {
        progress++;
        bar.textContent = `[${"#".repeat(progress)}${" ".repeat(total - progress)}]`;
        if (progress >= total) {
          clearInterval(intv);
          TerminalInterface.printText(div, "\n[ОШИБКА]: Ретранслятор не отвечает.\n", 15);
        }
      }, 70);
    });
  }
}
