var scenarios = [
  "You visit http://www.emailprovider.com/.",
  "You visit <font color='green'>https</font>://www.emailprovider.com/.",
  "You visit http://www.emailprovider.com/ from the free wifi network at a coffee shop.",
  "You visit http://www.emailprovider.com/ using a free HTTP proxy you found online.",
  "You visit http://www.emailprovider.com/ through Tor."
];
var participants = [
  "emailprovider.com",
  "Internet Core",
  "Your ISP",
  "Another user on your network",
  "Your Computer"
];
var information = [
  "Your IP address",
  "Your Email Address",
  "The Email you wrote",
  "Your Physical Address",
  "Which browser you use"
];
var state = 0;
var answers = [];

window.onload = function() {
  render();
};

var render = function() {
  // Set Scenerio.
  var scenario = document.getElementById("scenario");
  scenario.innerHTML = scenarios[state];
  
  // Render Table.
  var table = document.getElementById("dataTable");
  table.innerHTML = "";
  var headerRow = document.createElement("tr");
  var corner = document.createElement("th");
  headerRow.appendChild(corner);
  for (var i = 0; i < participants.length; i++) {
    var cell = document.createElement("th");
    cell.innerHTML = participants[i];
    headerRow.appendChild(cell);
  }
  table.appendChild(headerRow);
  for (var j = 0; j < information.length; j++) {
    var row = document.createElement("tr");
    var label = document.createElement("th");
    label.innerHTML = information[j];
    row.appendChild(label);
    for (var i = 0; i < participants.length; i++) {
      var cell = document.createElement("td");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.title = "Does " + participants[i] + " know " + information[j];
      input.name = i + "." + j;
      cell.appendChild(input);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  
  // Set Table State.
  // TODO: complete
}