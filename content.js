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

var loadPreviousTransfers = function(teamId) {
  $.ajax({
    url: rootUrl + "/entry/" + teamId + "/transfers/history/",
    type: "get",
    dataType: "",
    success: function(data) {

      var $html = $(data);

      var $div = $('#mlth' + teamId);
      $t = $($html.find('table.ismTable')[0]);
      if ($t.find('th:first').text() == 'Date') {
        $t.find('th:first').remove();
        $t.find('td:first-child').remove();
        $t.find('tr').slice(6).remove()

        $div.append($t);
      }
    }
  });
}


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
      var points = $gameweekPoints.find('.ism-scoreboard-panel__points').text().match(/\d+/)[0];



      var $team = $html.find('#ismPitchView');

      var $section1 = $('<div class="miniLeagueTeam"></div>');
      $section1.html($teamName);
      $section1.append($gameweekPoints);
      $section1.append($team);

      var $overallpoints = $html.find('.ismModHead:contains("Points/Rankings")');
      var $overallpointsContainer = $overallpoints.parent();
      $overallpointsContainer.find('dd,dt').slice(4).remove();
      var $section4 = $('<div class="miniLeagueFinance"></div>');
      $section4.html($overallpointsContainer);

      var $cup = $html.find('.ismModHead:contains("Transfers & Finance")');
      var $section2 = $('<div class="miniLeagueFinance"></div>');
      $section2.html($cup.parent());

      var $section3 = $('<div id="mlth' + teamId + '" class="miniLeagueTransferHistory"></div>')

      var $div = $('#ml' + teamId);
      $div.attr('data-gwpoints', points);
      $div.append($section1);
      $div.append($section2);
      $div.append($section4);
      $div.append($section3);

      loadPreviousTransfers(teamId);
    }
  });

};

var posSort = function() {
  var $wrapper = $('.miniLeagueSection');

  $wrapper.find('.mlTeamContainer').sort(function (a, b) {
      return +a.dataset.position - +b.dataset.position;
  })
  .appendTo( $wrapper );
};

var gwSort = function() {
  var $wrapper = $('.miniLeagueSection');

  $wrapper.find('.mlTeamContainer').sort(function (a, b) {
      return +b.dataset.gwpoints - +a.dataset.gwpoints;
  })
  .appendTo( $wrapper );
};

// TODO: pagination
var manipulateClassicDom = function() {
  console.log("classic dom");
  var clslinks = $('.ismStandingsTable tr td:nth-child(3) a');
  var standingsTableDiv = $('#ism');
  var miniLeagueSection = $('<section class="miniLeagueSection"></section>');
  var $spacerdiv = $('<div class="miniLeagueSpacer"><h3>Mini League View</h3><a id="posSortButton">Sort on Current Standings</a> | <a id="gwSortButton">Sort on Gameweek Points</a></div>');
  standingsTableDiv.append($spacerdiv);
  $('#posSortButton').click(posSort);
  $('#gwSortButton').click(gwSort);
  standingsTableDiv.append(miniLeagueSection);

  $.each(clslinks, function(index, value) {
    var clsLink = $(value).attr('href');
    var teamId = clsLink.match(/\d+/)[0];
    var $div = $('<div class="mlTeamContainer" id="ml' + teamId + '" data-position="'+ index + '"></div>');

    loadTeamIntoDiv(teamId, rootUrl + clsLink);
    miniLeagueSection.append($div);
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
