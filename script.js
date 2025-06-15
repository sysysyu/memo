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

