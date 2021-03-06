var showInlineTable = function(mode) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "inline", mode: mode}, function(response) {
      console.log(response.farewell);
    });
  });

}

var mode;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('hello from background');
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == "hello") {
      chrome.pageAction.show(sender.tab.id);
      mode = request.mode;

      if (localStorage["default-setting"] == "true") {
        showInlineTable(request.mode);
      }
    }
  }
);

chrome.pageAction.onClicked.addListener(function(tab) {
  showInlineTable(mode);
});
