// 后台脚本
console.log('LocalStorage Labyrinth: 后台脚本已加载');

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 处理来自content script的消息
  if (request.action === 'processData') {
    // 处理数据
    sendResponse({ success: true });
  }
  return true;
});