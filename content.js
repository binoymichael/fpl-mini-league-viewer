console.log('hello from content script');
var mode = "";
var rootUrl = "http://fantasy.premierleague.com";


var manipulateH2hDom = function() {
  // include links near table headers
  // add the teams
  // load them one by one. 
  // add retry logic to team fetch script to handle heavy traffic situations
  // add extra info
};


var loadTeamIntoDiv = function(teamId, fullLink) {
  $.ajax({
    url: fullLink,
    type: "get",
    dataType: "",
    success: function(data) {
      // $('#loader').hide();
      var $html = $(data);
      var $teamName = $html.find('.ismTabHead');
      var $gameweekPoints = $($html.find('.ism-team-scoreboard__section')[0]);
      var $team = $html.find('#ismPitchView');

      var $section1 = $('<section id="ismsection" class="ismPrimaryNarrow ismSB"></section>');
      $section1.html($teamName);
      $section1.append($gameweekPoints);
      $section1.append($team);

      var $div = $('#' + teamId);
      $div.append($section1);

      // var $div = $('<div></div>');


      // var $section1 = $('<section id="ismsection" class="ismPrimaryNarrow"></section>');
      // $section1.html($teamName);
      // $section1.append($team);

      // var $cup = $html.find('.ismModHead:contains("Transfers & Finance")');
      // var $section2 = $('<section id="finance" style="width:227px; float:right;"></section>');
      // $section2.html($cup.parent());

      // $div.append($section1);
      // $div.append($section2);

      // $('#ism').append($div);
      
    }
  });

};

// TODO: pagination
var manipulateClassicDom = function() {
  console.log("classic dom");
  var clslinks = $('.ismStandingsTable tr td:nth-child(3) a');
  var standingsTableSection = $('section.ismPrimaryWide');
  $.each(clslinks, function(index, value) {
    var clsLink = $(value).attr('href');
    var teamId = clsLink.match(/\d+/)[0];
    var $div = $('<div id="' + teamId + '"></div>');

    loadTeamIntoDiv(teamId, rootUrl + clsLink);
    standingsTableSection.append($div);
  });
};

var startInlineManipulations = function(mode) {
// Question how do I get mode properly here?
  console.log(mode);

  // TODO: Switch on mode
  if (mode == 'h2h') {
    manipulateH2hDom();
  } else {
    manipulateClassicDom();
  }

};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "hello") {
      var clslinks = $('.ismStandingsTable tr td:nth-child(3) a').map(function(n,i) {return rootUrl + $(i).attr('href');});
      var h2hLinks = $('.ismH2HStandingsTable tr td:nth-child(3) a').map(function(n,i) {return rootUrl + $(i).attr('href');});

      var links = $.merge(clslinks, h2hLinks);
      var maxCount = links.length < 20 ? links.length : 20

      sendResponse(links.slice(0, maxCount));
    } else if (request.action == 'inline') {
      startInlineManipulations(request.mode);
    }
});

// Start the show!
mode = $('.ismH2HStandingsTable').length != 0 ? "h2h" : "classic"
chrome.runtime.sendMessage({action: "hello", mode: mode}, function(response) {
  console.log(response.farewell);
});
