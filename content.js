// 内容脚本，用于与页面交互
console.log('LocalStorage Labyrinth: 内容脚本已加载');

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLocalStorageData') {
    // 获取当前页面的localStorage数据
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    sendResponse({ data });
  }
  return true;
});