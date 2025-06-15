let tabCount = 1;

document.getElementById('add-tab').addEventListener('click', () => {
  const newTabId = tabCount++;
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.tab = newTabId;
  tab.textContent = `タブ${newTabId}`;
  document.getElementById('tab-header').appendChild(tab);

  const content = document.createElement('div');
  content.className = 'tab-content';
  content.dataset.tab = newTabId;
  document.getElementById('tab-content-container').appendChild(content);

  switchTab(newTabId);
});

document.getElementById('tab-header').addEventListener('click', (e) => {
  if (e.target.classList.contains('tab')) {
    const tabId = e.target.dataset.tab;
    switchTab(tabId);
  }
});

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.dataset.tab === tabId);
  });
}

document.getElementById('add-memo').addEventListener('click', () => {
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;

  const memo = document.createElement('div');
  memo.className = 'memo-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'メモを入力';

  const check = document.createElement('button');
  check.textContent = '✔';
  check.onclick = () => {
    // 履歴機能が後で追加される
    memo.remove();
  };

  memo.appendChild(input);
  memo.appendChild(check);
  activeTab.appendChild(memo);
});
// 履歴保存
function saveToHistory(tabId, content) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const historyKey = `history-tab${tabId}`;

  let history = JSON.parse(localStorage.getItem(historyKey)) || {};

  if (!history[monthKey]) {
    history[monthKey] = [];
  }

  history[monthKey].push(content);
  localStorage.setItem(historyKey, JSON.stringify(history));
}

// チェックボタンの処理に履歴保存を追加
check.onclick = () => {
  const content = input.value.trim();
  if (content !== '') {
    const tabId = activeTab.dataset.tab;
    saveToHistory(tabId, content);
  }
  memo.remove();
};

// 履歴表示
document.getElementById('open-history').addEventListener('click', () => {
  const activeTabId = document.querySelector('.tab.active').dataset.tab;
  const historyKey = `history-tab${activeTabId}`;
  const history = JSON.parse(localStorage.getItem(historyKey)) || {};

  const historyContainer = document.getElementById('history-content');
  historyContainer.innerHTML = '';

  Object.keys(history).sort().reverse().forEach(month => {
    const group = document.createElement('div');
    group.className = 'history-month';

    const title = document.createElement('h3');
    title.textContent = `${month}（${history[month].length}件）`;
    group.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'history-grid';

    history[month].forEach(text => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.textContent = `📝 ${text}`;
      grid.appendChild(item);
    });

    group.appendChild(grid);
    historyContainer.appendChild(group);
  });

  document.getElementById('history-modal').classList.remove('hidden');
});

// 履歴モーダルを閉じる
document.getElementById('close-history').addEventListener('click', () => {
  document.getElementById('history-modal').classList.add('hidden');
});
function createTab(tabId) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.dataset.tab = tabId;
  tab.draggable = true;
  tab.innerHTML = `
    タブ${tabId}
    <span class="tab-actions">
      <button class="delete-tab">🗑️</button>
      <button class="move-tab">≡</button>
    </span>
  `;

  addDragEvents(tab); // ドラッグ処理追加

  return tab;
}
document.getElementById('add-tab').addEventListener('click', () => {
  const newTabId = tabCount++;
  const tab = createTab(newTabId);
  document.getElementById('tab-header').appendChild(tab);

  const content = document.createElement('div');
  content.className = 'tab-content';
  content.dataset.tab = newTabId;
  document.getElementById('tab-content-container').appendChild(content);

  switchTab(newTabId);
});
document.getElementById('tab-header').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-tab')) {
    const tab = e.target.closest('.tab');
    const tabId = tab.dataset.tab;

    // タブと中身を削除
    tab.remove();
    const content = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
    if (content) content.remove();

    // アクティブタブ切り替え
    const firstTab = document.querySelector('.tab');
    if (firstTab) switchTab(firstTab.dataset.tab);
  }

  // 通常のタブ切り替え
  if (e.target.classList.contains('tab')) {
    switchTab(e.target.dataset.tab);
  }
});
function addDragEvents(tab) {
  tab.addEventListener('dragstart', () => {
    tab.classList.add('dragging');
  });

  tab.addEventListener('dragend', () => {
    tab.classList.remove('dragging');
  });

  tab.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.tab.dragging');
    const header = document.getElementById('tab-header');
    const tabs = Array.from(header.children);
    const after = tabs.find(t => {
      const box = t.getBoundingClientRect();
      return e.clientX < box.left + box.width / 2;
    });
    if (after) {
      header.insertBefore(dragging, after);
    } else {
      header.appendChild(dragging);
    }
  });
}
document.getElementById('bg-color-picker').addEventListener('change', (e) => {
  const color = e.target.value;
  const tabId = document.querySelector('.tab.active').dataset.tab;
  const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
  const content = document.querySelector(`.tab-content[data-tab="${tabId}"]`);

  // タブとリストに背景色適用（タブは濃く、リストは薄め）
  tab.style.backgroundColor = color;
  content.style.backgroundColor = lighten(color, 0.4);
});

// パステルカラーを少し明るくする
function lighten(color, factor) {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) + 255 * factor));
  const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) + 255 * factor));
  const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) + 255 * factor));
  return `rgb(${r}, ${g}, ${b})`;
}

