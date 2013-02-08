var scenarios = [
  "You visit http://www.emailprovider.com/.",
  "You visit <font color='green'>https</font>://www.emailprovider.com/.",
  "You visit http://www.emailprovider.com/ from the free wifi network at a coffee shop.",
  "You visit http://www.emailprovider.com/ using a free HTTP proxy you found online.",
  "You visit http://www.emailprovider.com/ through Tor."
];
var participants = [
  "Example.com",
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

window.onload = function() {
  var table = document.getElementById("dataTable");
  var headerRow = document.createElement("tr");
  for (var i = 0; i < participants.length; i++) {
    var cell = document.createElement("th");
    cell.innerText = participants[i];
    tableRow.addChild(cell);
  }
  table.addChild(headerRow)
};