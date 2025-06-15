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
