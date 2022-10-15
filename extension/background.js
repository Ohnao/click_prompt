const openTab = (query) => {
  if(query) {
    console.log(
      chrome
    )
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') + '?prompt=' + query });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickprompt",
    title: "画像を生成",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  openTab(info.selectionText);
});
