function saveOptions() {
  var select = document.getElementById("default-setting");
  var value = select.checked;
  // console.log(value);
  localStorage["default-setting"] = value;
  // console.log(localStorage["default-setting"]);
}

var select = document.getElementById("default-setting");
var value = (localStorage["default-setting"] == undefined ? true : localStorage["default-setting"]);
console.log(value);
select.checked = (value == 'true' ? true : false);
select.addEventListener('change', saveOptions);

