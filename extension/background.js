chrome.contextMenus.create({
  "title": "選択中の文字列で生成",
  "type": "normal",
  "contexts": ["selection"],
  "onclick": copytext()
});