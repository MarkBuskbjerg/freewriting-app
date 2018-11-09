var startTimerButton = document.getElementById('start');
function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      display.textContent = "00:00";
    }
  }, 1000);
}

var typeWatcher = function(text, timer) {
  var time = timer;
  setInterval(function() {
    var content = text.value;
    text.addEventListener('keyup', function(e) {
      time = timer;
    });
    if (time <= 0) {
      var deleteText = content.split('');
      deleteText.pop();
      var newText = deleteText.join('');
      text.value = newText;
    } else {
      time -= 500;
    }
  }, 500);
}


startTimerButton.addEventListener('click', function(e) {
  var toolbar = document.getElementById('toolbar');

  var workPeriodInMinutes = 10;
  var workPeriodInSeconds = 60 * workPeriodInMinutes;
  var display = document.querySelector('#timer');
  var textarea = document.getElementById('textInput');
  startTimerButton.id = 'stop';
  startTimerButton.textContent = 'Stop legen';
  toolbar.removeChild(startTimerButton);
  startTimer(workPeriodInSeconds, display);
  typeWatcher(textarea, 1000);
}, false);