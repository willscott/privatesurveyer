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
var finished = false;
var correct_answers = [];

correct_answers[0] = "1111111111111110000111111";
correct_answers[1] = "1111110001100010000110001";
correct_answers[2] = "1111111111111110000111111";
correct_answers[3] = "0111111111111110000111111";
correct_answers[4] = "0011110001100010000110001";

var last = new Date();

window.onload = function() {
  render();
  setup();
};

var humanness = function(show) {
  // Attestation.
  document.getElementById('attestation').style.display = show ? 'block' : 'none';
  if (!show) {
    document.getElementById("attestationText").value = "";
    document.getElementById("attestationKeys").value = "";
    return;
  }
}
scenarios.push(humanness);

var reset = function() {
  humanness(false);
}

var render = function() {
  var scenario = document.getElementById("scenario");
  var sl = document.getElementById("sl");
  var table = document.getElementById("dataTable");

  if (typeof scenarios[state] === 'function') {
    scenario.style.display = 'none';
    table.style.display = 'none';
    sl.style.display = 'none';
    scenarios[state](true);
  } else {
    reset();
    scenario.style.display = 'block';
    table.style.display = 'block';
    sl.style.display = 'inline';
  }

  // Set Scenerio.
  scenario.innerHTML = scenarios[state];
  
  // Render Table.
  table.innerHTML = "";
  var headerRow = document.createElement("tr");
  var corner = document.createElement("th");
  corner.width = "20%";
  headerRow.appendChild(corner);
  for (var i = 0; i < participants.length; i++) {
    var cell = document.createElement("th");
    cell.width = "16%";
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
      if (finished && correct_answers[state][j + i * information.length]) {
        cell.className = "seen";
      }
      var label = document.createElement("label");
      label.setAttribute('for', i + "." + j);
      var input = document.createElement("input");
      input.type = "checkbox";
      input.title = "Does " + participants[i] + " know " + information[j];
      input.id = i + "." + j;
      input.checked = answers[state] && answers[state][j + i * information.length] == "1";
      label.appendChild(input);
      cell.appendChild(label);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Set Button State.
  var next = document.getElementById("next");
  var previous = document.getElementById("previous");
  var finish = document.getElementById("finish");
  next.style.display = (state < scenarios.length - 1) ? "inline" : "none";
  finish.style.display = state == scenarios.length - 1 ? "inline" : "none";
  previous.style.display = state > 0 ? "inline" : "none";
}

var setup = function() {
  var next = document.getElementById("next");
  var previous = document.getElementById("previous");
  var finish = document.getElementById("finish");
  next.addEventListener("click", function() {
    saveState();
    state++;
    render();
  }, true);
  previous.addEventListener("click", function() {
    saveState();
    state--;
    render();
  }, true);
  var logger = document.getElementById("attestationKeys");
  finish.addEventListener("click", function() {
    saveState();
    console.log(logger.value);
    finished = true;
    state = 0;
    render();
    //TODO: submit data.
  }, true);
  var attester = document.getElementById("attestationText");
  attester.addEventListener('keydown', function(e) {
    var dif = new Date() - last;
    logger.value += "d" + e.keyCode + "." + dif;
    last = new Date();
  });
  attester.addEventListener('keyup', function(e) {
    var dif = new Date() - last;
    logger.value += "u" + e.keyCode + "." + dif;
    last = new Date();
  });
}

var saveState = function() {
  var resp = "";
  for (var i = 0; i < information.length; i++) {
    for (var j = 0; j < participants.length; j++) {
      resp += document.getElementById(i + "." + j).checked ? "1" : "0";
    }
  }
  answers[state] = resp;
  console.log(state + ":" + answers[state]);
}
