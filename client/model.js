var scenarios = [
  "You visit http://emailprovider.com, sign in, and check your inbox.",
  "You visit <font color='#4d8'>https</font>://emailprovider.com, sign in, and check your inbox.",
  "You visit http://emailprovider.com from the free wifi network at a nearby coffee shop.  You sign in, and check your inbox.",
  "You visit http://emailprovider.com using a free HTTP proxy you found online. You sign in, and check your inbox.",
  "You visit http://emailprovider.com using Tor. You sign in, and check your inbox. (If you do not recognize 'Tor', leave these boxes blank.)",
  "You visit emailprovider.com in an ideal world. (There's no right answer to this question.)"
];
var participants = [
  "emailprovider.com",
  "emailprovider.com's ISP",
  "Your ISP",
  "A user on your wireless network",
  "Your Computer"
];
var information = [
  "Your Home IP address",
  "Your Email Address",
  "Your Email Password",
  "Your OS & Browser"
];
var state = 0;
var answers = [];
var finished = false;
var correctAnswers = [];
correctAnswers[0] = "11111111111111111111";
correctAnswers[1] = "11111100011000110001";
correctAnswers[2] = "00000111111111111111";
correctAnswers[3] = "00111111111111111111";
correctAnswers[4] = "00111110011100111001";

var last = new Date();

window.onload = function() {
  renderQuestion();
  setup();
};

var reset = function() {
}

var renderQuestion = function() {
  var scenario = document.getElementById("scenario");
  var sl = document.getElementById("sl");
  var sl2 = document.getElementById("sl2");
  var table = document.getElementById("dataTable");

  if (typeof scenarios[state] === 'function') {
    scenario.style.display = 'none';
    table.style.display = 'none';
    sl.style.display = 'none';
    sl2.style.display = 'none';
    scenarios[state](true);
  } else {
    reset();
    scenario.style.display = 'block';
    table.style.display = 'block';
    sl.style.display = 'inline';
    sl2.style.display = 'inline';
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
      if (finished && correct_answers[state][j + i * information.length] == "1") {
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
  next.style.display = (state < scenarios.length - 1 &&
      !finished) ? "inline" : "none";
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
    renderQuestion();
  }, true);
  previous.addEventListener("click", function() {
	if (state < scenarios.length - 1)
	    saveState();
    state--;
    renderQuestion();
  }, true);
  finish.addEventListener("click", function() {
    saveState()
    finished = true;
    state = 0;
    renderAnswer();
    submitAnswer();
  }, true);
}

var submitAnswer = function() {
  var script = "https://script.google.com/macros/s/AKfycby6l_G7SXo3Gq8Z7r1Kj996U2Oea2oc548pUvdSii05wuTnPiHS/exec";
  var answer = answers[0] + answers[1] + answers[2] + answers[3] + answers[4] + answers[5];
  var s = document.createElement("script");
  s.src = script + "?s=" + window.location.search + "&a=" + answer + "&h=none";
  document.body.appendChild(s);
}

var callback = function(result) {
  // We don't actually care.
}

var renderAnswer = function() {
  var questionForm = document.getElementById("questionform");
  questionForm.style.display = 'none';
  var scoreForm = document.getElementById("scoreform");
  var answerForm = document.getElementById("answerform");

  var score = 0;

  for (var state = 0; state < scenarios.length - 1; state++) {
	answerForm.innerHTML += '<b>Scenario:</b>';
	answerForm.innerHTML += '<span id="scenario" style="display:block;">' + scenarios[state] + '</span>';

	var table = '<table border="1" style="display: block;">';
	table += '<tr><th width="20%"></th>';
    for (var i = 0; i < participants.length; i++) {
      table += '<th width="16%">' + participants[i] + '</th>';
    }

    for (var i = 0; i < information.length; i++) {
      table += '<tr><th>' + information[i] + '</th>';
      for (var j = 0; j < participants.length; j++) {
		var text;
		if (correctAnswers[state][j + i * participants.length] == '1')
			text = 'Yes';
		else
			text = 'No';
		if (correctAnswers[state][j + i * participants.length] == answers[state][j + i * participants.length]) {
			score += 1;
			text = '<font color="green">' + text + '</font>';
		} else {
			text = '<font color="red">' + text + '</font>';
		}
		table += '<td>' + text + '</td>';
      }
	  table += '</tr>';
    }
	
	table += '</table>';
	answerForm.innerHTML += table + '<br/>';
  }

  var fullScore = (scenarios.length - 1) * information.length * participants.length;
  scoreForm.innerHTML += '<div id="score">' + score + "/" + fullScore + '</div>';

  scoreForm.style.display = '';
  answerForm.style.display = '';
}

var saveState = function() {
  var resp = "";
  for (var i = 0; i < information.length; i++) {
    for (var j = 0; j < participants.length; j++) {
      resp += document.getElementById(j + "." + i).checked ? "1" : "0";
    }
  }
  answers[state] = resp;
  console.log(state + ":" + answers[state]);
}
