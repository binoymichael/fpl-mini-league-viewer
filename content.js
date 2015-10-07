console.log('hello from content script');
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});



// content.js
// alert("Hello from your Chrome extension!");
// chrome.windows.create({url : "popup.html"});
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.greeting == "hello") {
//       var rootUrl = "http://fantasy.premierleague.com";
//       var clslinks = $('.ismStandingsTable tr td:nth-child(3) a').map(function(n,i) {return rootUrl + $(i).attr('href');});
//       var h2hLinks = $('.ismH2HStandingsTable tr td:nth-child(3) a').map(function(n,i) {return rootUrl + $(i).attr('href');});

//       var links = $.merge(clslinks, h2hLinks);
//       var maxCount = links.length < 20 ? links.length : 20

//       sendResponse(links.slice(0, maxCount));
//     }
// });