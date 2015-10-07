chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('hello from background');
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      chrome.pageAction.show(sender.tab.id);
      // chrome.pageAction.setIcon({tabId: sender.tab.id, path: "football48.png"});
      console.log('hello from background');
      // sendResponse({farewell: "goodbye"});
  }
);