document.addEventListener("DOMContentLoaded", () => {
  const tabHeader = document.getElementById("tab-header");
  const tabContentContainer = document.getElementById("tab-content-container");
  const addTabBtn = document.getElementById("add-tab");
  const addMemoBtn = document.getElementById("add-memo");
  const historyModal = document.getElementById("history-modal");
  const closeHistoryBtn = document.getElementById("close-history");
  const openHistoryBtn = document.getElementById("open-history");
  const colorPicker = document.getElementById("bg-color-picker");

  let tabs = JSON.parse(localStorage.getItem("tabs")) || [];
  let activeTab = null;

  // ---- 初期化 ----
  function init() {
    if (tabs.length === 0) {
      tabs.push({ name: "タブ1", color: "#2196f3" });
      saveTabs();
    }
    renderTabs();
    switchTab(0);
  }

  // ---- タブを保存 ----
  function saveTabs() {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }

  // ---- タブ描画 ----
  function renderTabs() {
    tabHeader.innerHTML = "";
    tabs.forEach((tab, index) => {
      const tabBtn = document.createElement("div");
      tabBtn.className = "tab";
      tabBtn.textContent = tab.name;
      tabBtn.style.background = tab.color;
      tabBtn.dataset.index = index;
      if (index === activeTab) tabBtn.classList.add("active");

      // 削除ボタン
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("このタブを削除しますか？")) {
          tabs.splice(index, 1);
          saveTabs();
          renderTabs();
          switchTab(0);
        }
      };
      tabBtn.appendChild(delBtn);

      // 移動ボタン（↑↓）
      if (index > 0) {
        const upBtn = document.createElement("button");
        upBtn.textContent = "⬆️";
        upBtn.onclick = (e) => {
          e.stopPropagation();
          [tabs[index], tabs[index - 1]] = [tabs[index - 1], tabs[index]];
          saveTabs();
          renderTabs();
          switchTab(index - 1);
        };
        tabBtn.appendChild(upBtn);
      }
      if (index < tabs.length - 1) {
        const downBtn = document.createElement("button");
        downBtn.textContent = "⬇️";
        downBtn.onclick = (e) => {
          e.stopPropagation();
          [tabs[index], tabs[index + 1]] = [tabs[index + 1], tabs[index]];
          saveTabs();
          renderTabs();
          switchTab(index + 1);
        };
        tabBtn.appendChild(downBtn);
      }

      tabBtn.onclick = () => {
        switchTab(index);
      };
      tabHeader.appendChild(tabBtn);
    });
  }

  // ---- タブ切り替え ----
  function switchTab(index) {
    activeTab = index;
    renderTabs();
    renderTabContent();
    updateColorPicker();
  }

  // ---- タブ背景色変更 ----
  colorPicker.onchange = () => {
    if (activeTab !== null) {
      tabs[activeTab].color = colorPicker.value;
      saveTabs();
      renderTabs();
      renderTabContent();
    }
  };

  function updateColorPicker() {
    if (tabs[activeTab]) {
      colorPicker.value = tabs[activeTab].color;
    }
  }

  // ---- タブコンテンツ描画 ----
  function renderTabContent() {
    const key = `memos-tab${activeTab}`;
    const memos = JSON.parse(localStorage.getItem(key)) || [];
    tabContentContainer.innerHTML = "";

    const content = document.createElement("div");
    content.className = "tab-content";
    content.style.background = lightenColor(tabs[activeTab].color, 40);

    memos.forEach((memo, idx) => {
      const entry = document.createElement("div");
      entry.className = "memo-entry";

      const input = document.createElement("input");
      input.type = "text";
      input.value = memo;
      input.oninput = () => {
        memos[idx] = input.value;
        localStorage.setItem(key, JSON.stringify(memos));
      };

      const checkBtn = document.createElement("button");
      checkBtn.textContent = "✅";
      checkBtn.onclick = () => {
        memos.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(memos));
        saveToHistory(memo);
        renderTabContent();
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => {
        memos.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(memos));
        renderTabContent();
      };

      entry.appendChild(input);
      entry.appendChild(checkBtn);
      entry.appendChild(delBtn);
      content.appendChild(entry);
    });

    tabContentContainer.appendChild(content);
  }

  // ---- メモ追加 ----
  addMemoBtn.onclick = () => {
    const key = `memos-tab${activeTab}`;
    const memos = JSON.parse(localStorage.getItem(key)) || [];
    memos.push("");
    localStorage.setItem(key, JSON.stringify(memos));
    renderTabContent();
  };

  // ---- 履歴保存 ----
  function saveToHistory(text) {
    const key = `history-tab${activeTab}`;
    const history = JSON.parse(localStorage.getItem(key)) || {};
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (!history[ym]) history[ym] = [];
    history[ym].push(text);
    localStorage.setItem(key, JSON.stringify(history));
  }

  // ---- 履歴表示 ----
  openHistoryBtn.onclick = () => {
    const container = document.getElementById("history-content");
    const key = `history-tab${activeTab}`;
    const history = JSON.parse(localStorage.getItem(key)) || {};
    container.innerHTML = "";

    Object.keys(history)
      .sort()
      .reverse()
      .forEach((month) => {
        const group = document.createElement("div");
        group.className = "history-month";

        const title = document.createElement("h3");
        title.textContent = `${month}（${history[month].length}件）`;
        group.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "history-grid";

        history[month].forEach((text) => {
          const item = document.createElement("div");
          item.className = "history-item";
          item.textContent = `📝 ${text}`;
          grid.appendChild(item);
        });

        group.appendChild(grid);
        container.appendChild(group);
      });

    historyModal.classList.remove("hidden");
  };

  closeHistoryBtn.onclick = () => {
    historyModal.classList.add("hidden");
  };

  // ---- タブ追加 ----
  addTabBtn.onclick = () => {
    const name = prompt("新しいタブ名を入力してください：");
    if (name) {
      tabs.push({ name, color: "#2196f3" });
      saveTabs();
      renderTabs();
      switchTab(tabs.length - 1);
    }
  };

  // ---- 色を薄くするユーティリティ関数 ----
  function lightenColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `rgb(${R},${G},${B})`;
  }

  init();
});
