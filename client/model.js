var scenarios = [
  "You visit http://www.emailprovider.com/.",
  "You visit <font color='green'>https</font>://www.emailprovider.com/.",
  "You visit http://www.emailprovider.com/ from the free wifi network at a coffee shop.",
  "You visit http://www.emailprovider.com/ using a free HTTP proxy you found online.",
  "You visit http://www.emailprovider.com/ through Tor.",
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
var correctAnswers = [];
{
  correctAnswers[0] = "0000000000000000000000000";
  correctAnswers[1] = "0000000000000000000000000";
  correctAnswers[2] = "0000000000000000000000000";
  correctAnswers[3] = "0000000000000000000000000";
  correctAnswers[4] = "0000000000000000000000000";
}
var last = new Date();
var isFinished = false;

window.onload = function() {
  renderQuestion();
  setup();
};

var renderQuestion = function() {
  var scenario = document.getElementById("scenario");
  var table = document.getElementById("dataTable");

  if (typeof scenarios[state] === 'function') {
    scenario.style.display = 'none';
    table.style.display = 'none';
    scenarios[state](true);
  } else {
    scenario.style.display = 'block';
    table.style.display = 'block';
	scenarios[scenarios.length - 1](false);
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
    renderQuestion();
  }, true);
  previous.addEventListener("click", function() {
	if (state < scenarios.length - 1)
	    saveState();
    state--;
    renderQuestion();
  }, true);
  var logger = document.getElementById("attestationKeys");
  finish.addEventListener("click", function() {
    //saveState();
    console.log(logger.value);
	submitAnswer();
	isFinished = true;
	renderAnswer();
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

    for (var j = 0; j < information.length; j++) {
      table += '<tr><th>' + information[j] + '</th>';
      for (var i = 0; i < participants.length; i++) {
		var text;
		if (correctAnswers[state][j + i * information.length] == '1')
			text = 'Yes';
		else
			text = 'No';
		if (correctAnswers[state][j + i * information.length] == answers[state][j + i * information.length]) {
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
      resp += document.getElementById(i + "." + j).checked ? "1" : "0";
    }
  }
  answers[state] = resp;
  console.log(state + ":" + answers[state]);
}

var submitAnswer = function() {
    //TODO: submit data. 
}

var humanness = function(show) {
  // Captcha.
  // Attestation.
  document.getElementById('attestation').style.display = show ? 'block' : 'none';
  if (!show) {
    document.getElementById("attestationText").value = "";
    document.getElementById("attestationKeys").value = "";
    return;
  }
}
scenarios.push(humanness);
