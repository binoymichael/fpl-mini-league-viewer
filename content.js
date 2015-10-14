console.log('hello from content script');
var mode = "";
var rootUrl = "http://fantasy.premierleague.com";

var popupShow = function (e) {
    console.log('popup');
    var target = '#' + ($(this).attr('data-popupbox'));
    $(target).show();
};

var popupHide = function () {
    console.log('popdown');
    var target = '#' + ($(this).attr('data-popupbox'));
    if (!($(this).hasClass("show"))) {
        $(target).hide();
    }
};

var toggleClassicView = function(e) {
  e.preventDefault();
  var $this = $(this);
  if ($this.text() == 'Show') {
    $this.text('Hide');
    $('#mlSortControls').show();
    $('.miniLeagueSection').show();
  } else {
    $this.text('Show');
    $('#mlSortControls').hide();
    $('.miniLeagueSection').hide();
  }
};

var toggleH2HClassicView = function(e) {
  e.preventDefault();
  var $this = $(this);
  if ($this.text() == 'Show') {
    $this.text('Hide');
    $('#mlSortControls').show();
    $('.miniLeagueSectionH2H').show();
  } else {
    $this.text('Show');
    $('#mlSortControls').hide();
    $('.miniLeagueSectionH2H').hide();
  }
};

var toggleH2HThisWeekView = function(e) {
  e.preventDefault();
  var $this = $(this);
  if ($this.text() == 'Show') {
    $this.text('Hide');
    $('#thisGwH2HMiniLeague').show();
  } else {
    $this.text('Show');
    $('#thisGwH2HMiniLeague').hide();
  }

};

var toggleH2HNextWeekView = function(e) {
  e.preventDefault();
  var $this = $(this);
  if ($this.text() == 'Show') {
    $this.text('Hide');
    $('#nextGwH2HMiniLeague').show();
  } else {
    $this.text('Show');
    $('#nextGwH2HMiniLeague').hide();
  }

};

var manipulateH2hDom = function() {
  console.log("h2h dom");

  $('.ismWrapper').css("width", "1300px");
  $('.ismWrapper').css("min-height", "1600px");

  var clslinks = $('.ismH2HStandingsTable tr td:nth-child(3) a');
  var standingsTableDiv = $('.ismH2HStandingsTable');

  var miniLeagueSection = $('<section class="miniLeagueSectionH2H"></section>');

  var $spacerdiv = $('<div class="miniLeagueSpacerH2H"><h3 style="display: inline;"><img src="' + chrome.extension.getURL("football16.png") + '"/>  Classic View</h3> | <a id="toggleH2HClassicView" href="#">Show</a> <div id="mlSortControls" style="margin-top:30px"><a id="posSortButton" href="#">Sort on Current Standings</a> | <a id="gwSortButton" href="#">Sort on Gameweek Points</a></div></div>');

  standingsTableDiv.after($spacerdiv);

  $('#toggleH2HClassicView').click(toggleH2HClassicView);
  $('#posSortButton').click(posSortH2H);
  $('#gwSortButton').click(gwSortH2H);
  $('#mlSortControls').hide();

  $spacerdiv.after(miniLeagueSection);

  $thisGwH2HTable = $('table.ismTable.ismH2HFixTable:first');
  $thisGwH2HMiniLeagueTable = $('<table id="thisGwH2HMiniLeague"></table>');

  $.each($thisGwH2HTable.find('tr'), function(index, matchRow) {
    var homeTeamName = $(matchRow).find('a:first').text();
    var awayTeamName = $(matchRow).find('a:last').text();
    var homeTeamId = $(matchRow).find('a:first').attr('href').match(/\d+/)[0];
    var awayTeamId = $(matchRow).find('a:last').attr('href').match(/\d+/)[0];

    $(matchRow).attr('data-popupbox', 'mlh2h-tgw-popup-' + index);
    $(matchRow).hover(popupShow, popupHide);



    $matchTr = $('<tr class="mlh2h-team-row"><td class="mlh2h-team-box" id="ml-h2h-tgw-'+ homeTeamId +'"></td>' + 
      '<td><table><tr id="h2hmid-tgw-' + homeTeamId + '"></tr>' + 
      '<tr class="mlh2h"><td align="center"><h3>' + homeTeamName + '</h3><h3>vs</h3><h3>' + awayTeamName + '</h3></td></tr>' +
      '<tr id="h2hmid-tgw-' + awayTeamId + '"></tr></table></td>' +
      '<td class="mlh2h-team-box" id="ml-h2h-tgw-' + awayTeamId + '"></td></tr>')

    $matchTrPopUp = $('<tr class="mlh2h-team-row"><td class="mlh2h-team-box" id="ml-h2h-tgw-pop'+ homeTeamId +'"></td>' + 
      '<td><table><tr id="h2hmid-tgw-pop' + homeTeamId + '"></tr>' + 
      '<tr class="mlh2h"><td align="center"><h3>' + homeTeamName + '</h3><h3>vs</h3><h3>' + awayTeamName + '</h3></td></tr>' +
      '<tr id="h2hmid-tgw-pop' + awayTeamId + '"></tr></table></td>' +
      '<td class="mlh2h-team-box" id="ml-h2h-tgw-pop' + awayTeamId + '"></td></tr>')

    $thisGwH2HPopUpTable = $('<table class="mlPopTeamH2H" id="mlh2h-tgw-popup-' + index +'"></table>');
    $thisGwH2HPopUpTable.append($matchTrPopUp);
    $(matchRow).append($thisGwH2HPopUpTable);
    $thisGwH2HMiniLeagueTable.append($matchTr);
  });

  var $thisWeekSpacerdiv = $('<div class="miniLeagueSpacerH2H"><h3 style="display: inline;"><img src="' + chrome.extension.getURL("football16.png") + '"/>  This Week H2H View</h3> | <a id="toggleH2HThisWeekView" href="#">Show</a></div>');

  $thisGwH2HTable.after($thisWeekSpacerdiv);
  $thisWeekSpacerdiv.after($thisGwH2HMiniLeagueTable);
  $('#toggleH2HThisWeekView').click(toggleH2HThisWeekView);
  $thisGwH2HMiniLeagueTable.hide();


  $nextGwH2HTable = $('table.ismTable.ismH2HFixTable:last');
  $nextGwH2HMiniLeagueTable = $('<table id="nextGwH2HMiniLeague"></table>');
  $.each($nextGwH2HTable.find('tr'), function(index, matchRow) {
    var homeTeamName = $(matchRow).find('a:first').text();
    var awayTeamName = $(matchRow).find('a:last').text();
    var homeTeamId = $(matchRow).find('a:first').attr('href').match(/\d+/)[0];
    var awayTeamId = $(matchRow).find('a:last').attr('href').match(/\d+/)[0];


    $(matchRow).attr('data-popupbox', 'mlh2h-ngw-popup-' + index);
    $(matchRow).hover(popupShow, popupHide);

    $matchTr = $('<tr class="mlh2h-team-row"><td class="mlh2h-team-box" id="ml-h2h-ngw-'+ homeTeamId +'"></td>' + 
      '<td><table><tr id="h2hmid-ngw-' + homeTeamId + '"></tr>' + 
      '<tr class="mlh2h"><td align="center"><h3>' + homeTeamName + '</h3><h3>vs</h3><h3>' + awayTeamName + '</h3></td></tr>' +
      '<tr id="h2hmid-ngw-' + awayTeamId + '"></tr></table></td>' +
      '<td class="mlh2h-team-box" id="ml-h2h-ngw-' + awayTeamId + '"></td></tr>');

    $matchTrPopUp = $('<tr class="mlh2h-team-row"><td class="mlh2h-team-box" id="ml-h2h-ngw-pop'+ homeTeamId +'"></td>' + 
      '<td><table><tr id="h2hmid-ngw-pop' + homeTeamId + '"></tr>' + 
      '<tr class="mlh2h"><td align="center"><h3>' + homeTeamName + '</h3><h3>vs</h3><h3>' + awayTeamName + '</h3></td></tr>' +
      '<tr id="h2hmid-ngw-pop' + awayTeamId + '"></tr></table></td>' +
      '<td class="mlh2h-team-box" id="ml-h2h-ngw-pop' + awayTeamId + '"></td></tr>')

    $nextGwH2HPopUpTable = $('<table class="mlPopTeamH2H" id="mlh2h-ngw-popup-' + index +'"></table>');
    $nextGwH2HPopUpTable.append($matchTrPopUp);
    $(matchRow).append($nextGwH2HPopUpTable);
    $nextGwH2HMiniLeagueTable.append($matchTr);
    // console.log(matchRow);
  });
  $nextGwH2HTable.after($nextGwH2HMiniLeagueTable);


  var $nextWeekSpacerdiv = $('<div class="miniLeagueSpacerH2H"><h3 style="display: inline;"><img src="' + chrome.extension.getURL("football16.png") + '"/>  Next Week H2H View</h3> | <a id="toggleH2HNextWeekView" href="#">Show</a></div>');

  $nextGwH2HTable.after($nextWeekSpacerdiv);
  $nextWeekSpacerdiv.after($nextGwH2HMiniLeagueTable);
  $('#toggleH2HNextWeekView').click(toggleH2HNextWeekView);
  $nextGwH2HMiniLeagueTable.hide();


  $.each(clslinks, function(index, value) {
    var clsLink = $(value).attr('href');
    var teamId = clsLink.match(/\d+/)[0];
    $(value).attr('data-popupbox', 'mlcp' + teamId);
    $(value).hover(popupShow, popupHide);

    var $div = $('<div class="mlTeamContainerH2H" id="ml' + teamId + '" data-position="'+ index + '"></div>');
    var $pop = $('<div class="mlPopTeam" id="mlcp' + teamId + '"></div>');
    $(value).parent().append($pop);

    miniLeagueSection.append($div);
    loadTeamIntoDiv("H2H", teamId, rootUrl + clsLink);
  });

  miniLeagueSection.hide();
};

var loadPreviousTransfers = function(teamId) {
  $.ajax({
    url: rootUrl + "/entry/" + teamId + "/transfers/history/",
    type: "get",
    dataType: "",
    success: function(data) {

      var $html = $(data);

      var $div = $('#mlth' + teamId);
      var $pop = $('#mlth-pop' + teamId);
      var $div2 = $('#mlth-h2h-tgw-' + teamId);
      var $popdiv2 = $('#mlth-h2h-tgw-pop' + teamId);
      var $div3 = $('#mlth-h2h-ngw-' + teamId);
      var $popdiv3 = $('#mlth-h2h-ngw-pop' + teamId);
      $t = $($html.find('table.ismTable')[0]);
      if ($t.find('th:first').text() == 'Date') {
        $t.find('th:first').remove();
        $t.find('td:first-child').remove();
        $t.find('tr').slice(6).remove()

        $div.append($t.clone());
        $pop.append($t.clone())
        $div2.append($t.clone());
        $popdiv2.append($t.clone());
        $div3.append($t.clone());
        $popdiv3.append($t.clone());
      }
    }
  });
}


var loadTeamIntoDiv = function(mode, teamId, fullLink) {
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
      var $popSection3 = $('<div id="mlth-pop' + teamId + '" class="miniLeagueTransferHistory"></div>')

      var $div = $('#ml' + teamId);
      $div.attr('data-gwpoints', points);
      $div.append($section1.clone());
      $div.append($section2.clone());
      $div.append($section4.clone());
      $div.append($section3.clone());

      var $pop = $('#mlcp' + teamId);
      $pop.append($section1.clone());
      $pop.append($section2.clone());
      $pop.append($section4.clone());
      $pop.append($popSection3.clone());

      if (mode == "H2H") {
        var $div2 = $('<div></div>');
        $div2.append($section1.clone());

        var $h2hsection4 = $('<div class="miniLeagueFinanceH2H"></div>');
        $h2hsection4.html($overallpointsContainer);

        var $h2hsection2 = $('<div class="miniLeagueFinanceH2H"></div>');
        $h2hsection2.html($cup.parent());

        var $h2hsection3 = $('<div id="mlth-h2h-tgw-' + teamId + '" class="miniLeagueTransferHistoryH2H"></div>')
        var $h2hPopSection3 = $('<div id="mlth-h2h-tgw-pop' + teamId + '" class="miniLeagueTransferHistoryH2H"></div>')

        var $nextH2hsection3 = $('<div id="mlth-h2h-ngw-' + teamId + '" class="miniLeagueTransferHistoryH2H"></div>')

        var $teamTd = $('#ml-h2h-tgw-' + teamId);
        var $teamTdPop = $('#ml-h2h-tgw-pop' + teamId);
        var $nextTeamTd = $('#ml-h2h-ngw-' + teamId);
        var $nextTeamTdPop = $('#ml-h2h-ngw-pop' + teamId);

        var $midRow = $('#h2hmid-tgw-' + teamId);
        var $midRowPop = $('#h2hmid-tgw-pop' + teamId);

        var $nextMidRow = $('#h2hmid-ngw-' + teamId);
        var $nextMidRowPop = $('#h2hmid-ngw-pop' + teamId);

        $teamTd.append($div2.clone());
        $teamTdPop.append($div2.clone());

        $nextTeamTd.append($div2.clone());
        $nextTeamTdPop.append($div2.clone());

        $midRow.append($h2hsection2.clone());
        $midRow.append($h2hsection4.clone());
        $midRow.append($h2hsection3.clone());

        $midRowPop.append($h2hsection2.clone());
        $midRowPop.append($h2hsection4.clone());
        $midRowPop.append($h2hsection3.clone());

        $nextMidRow.append($h2hsection2.clone());
        $nextMidRow.append($h2hsection4.clone());
        $nextMidRow.append($nextH2hsection3.clone());

        $nextMidRowPop.append($h2hsection2.clone());
        $nextMidRowPop.append($h2hsection4.clone());
        $nextMidRowPop.append($nextH2hsection3.clone());
       }

      loadPreviousTransfers(teamId);
    }
  });

};

// Refactor
var posSortH2H = function(e) {
  e.preventDefault();
  var $wrapper = $('.miniLeagueSectionH2H');

  $wrapper.find('.mlTeamContainerH2H').sort(function (a, b) {
      return +a.dataset.position - +b.dataset.position;
  })
  .appendTo( $wrapper );
};

// Refactor
var gwSortH2H = function(e) {
  e.preventDefault();
  var $wrapper = $('.miniLeagueSectionH2H');

  $wrapper.find('.mlTeamContainerH2H').sort(function (a, b) {
      return +b.dataset.gwpoints - +a.dataset.gwpoints;
  })
  .appendTo( $wrapper );
};

var posSort = function(e) {
  e.preventDefault();
  var $wrapper = $('.miniLeagueSection');

  $wrapper.find('.mlTeamContainer').sort(function (a, b) {
      return +a.dataset.position - +b.dataset.position;
  })
  .appendTo( $wrapper );
};

var gwSort = function(e) {
  e.preventDefault();
  var $wrapper = $('.miniLeagueSection');

  $wrapper.find('.mlTeamContainer').sort(function (a, b) {
      return +b.dataset.gwpoints - +a.dataset.gwpoints;
  })
  .appendTo( $wrapper );
};

// TODO: pagination
var manipulateClassicDom = function() {
  console.log("classic dom");
  $('.ismWrapper').css("min-height", "800px");
  var clslinks = $('.ismStandingsTable tr td:nth-child(3) a');
  var standingsTableDiv = $('#ism');

  var miniLeagueSection = $('<section class="miniLeagueSection"></section>');

  var $spacerdiv = $('<div class="miniLeagueSpacer"><h3 style="display: inline;"><img src="' + chrome.extension.getURL("football16.png") + '"/>  Mini League Detailed View</h3> | <a id="toggleClassicView" href="#">Hide</a> <div id="mlSortControls" style="margin-top:30px"><a id="posSortButton" href="#">Sort on Current Standings</a> | <a id="gwSortButton" href="#">Sort on Gameweek Points</a></div></div>');
  standingsTableDiv.append($spacerdiv);


  $('#toggleClassicView').click(toggleClassicView);
  $('#posSortButton').click(posSort);
  $('#gwSortButton').click(gwSort);
  standingsTableDiv.append(miniLeagueSection);

  $.each(clslinks, function(index, value) {
    var clsLink = $(value).attr('href');
    var teamId = clsLink.match(/\d+/)[0];
    $(value).attr('data-popupbox', 'mlcp' + teamId);
    $(value).hover(popupShow, popupHide);

    var $div = $('<div class="mlTeamContainer" id="ml' + teamId + '" data-position="'+ index + '"></div>');
    var $pop = $('<div class="mlPopTeam" id="mlcp' + teamId + '"></div>');
    $(value).parent().append($pop);

    loadTeamIntoDiv("CLS", teamId, rootUrl + clsLink);
    miniLeagueSection.append($div);
  });

  // miniLeagueSection.hide();
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
