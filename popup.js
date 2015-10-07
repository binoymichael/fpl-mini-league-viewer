function loadTeams(baseUrls) {
  console.log(baseUrls);
  for (i = 0; i < baseUrls.length; i++) { 
    baseUrl = baseUrls[i];

    $.ajax({
      url: baseUrl,
      type: "get",
      dataType: "",
      success: function(data) {
        $('#loader').hide();
        var $html = $(data);
        var $div = $('<div></div>');

        var $teamName = $html.find('.ismTabHead');
        var $team = $html.find('#ismPitchView');

        var $section1 = $('<section id="ismsection" class="ismPrimaryNarrow"></section>');
        $section1.html($teamName);
        $section1.append($team);

        var $cup = $html.find('.ismModHead:contains("Transfers & Finance")');
        var $section2 = $('<section id="finance" style="width:227px; float:right;"></section>');
        $section2.html($cup.parent());

        $div.append($section1);
        $div.append($section2);

        $('#ism').append($div);
        
      }
    });
  }
}

$(function () {
  chrome.tabs.create({active: true, url: "http://google.co.in"});
  // console.log('hello');
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   if(tabs[0].url.match(/http:\/\/fantasy.premierleague.com\/my-leagues\/.*\/standings/)) {
  //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
  //       loadTeams(response);
  //     });
  //   } else {
  //       $('#loader').html("Open this extension from your FPL League standings page.");
  //   }
  // });
});
