//
// Helper Methods
//
/**
 * Render a template into the DOM
 * @param  {String|Function} template The template to render
 * @param  {String|Node}     elem     The element to render into
 * @return {[type]}                   The element
 */
var render = function(template, elem) {
  // Set rendering element for the component
  if (typeof template === 'function') {
    template.elem = elem;
  }
  // If elem is an element, use it.
  // If it's a selector, get it.
  elem = typeof elem === 'string' ? document.querySelector(elem) : elem;
  if (!elem) return;
  // Get the template
  template = (typeof template === 'function' ? template(template.state) : template);
  if (typeof template !== 'string') return;
  // Render the template into the element
  if (elem.innerHTML === template) return;
  elem.innerHTML = template;
  // Dispatch a render event
  if (typeof window.CustomEvent === 'function') {
    var event = new CustomEvent('render', {
      bubbles: true
    });
    elem.dispatchEvent(event);
  }
  // Return the elem for use elsewhere
  return elem;
};

var freewriting = (function() {
  'use strict;';

  // Public APIs
  var publicAPIs = {};

  publicAPIs.deleteText = function(text) {
    var deleteText = text.split('');
    deleteText.pop();
    return deleteText.join('');
  };

  publicAPIs.startTimer = function(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function() {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;
      if (timer === 0) {
        var textContainer = document.getElementById('textInput');
        var placeholder = document.getElementById('placeholder');
        var template = '<div class="tekstr-info-box"><p><strong>Godt arbejdet. Her er din tekst:</strong></p><p>' + textContainer.value + '</p></div>';
        textContainer.style.display = 'none';
        placeholder.innerHTML = template;
      }
      if (--timer < 0) {
        display.textContent = "00:00";
      }
    }, 1000);
  };

  publicAPIs.typeWatcher = function(textContainer, timer) {
    var time = timer;
    setInterval(function() {
      var content = textContainer.value;
      textContainer.addEventListener('keyup', function(e) {
        time = timer;
      });
      if (time <= 0) {
        textContainer.value = publicAPIs.deleteText(content);
      } else {
        time -= 500;
      }
    }, 500);
  };

  // Return our public APIs
  return publicAPIs;
})();

var template = '<div class="container" id ="toolbar">' + 'Tid: <span id="timer">10:00</div>' + '</div>' + '<div class="container">' + '<textarea id="textInput" class="textarea"></textarea>' + '<div id="placeholder"></div>' + '</div>';
console.log(template);
render(template, '#app');

/*
A simple function to start everything off
*/
var initiator = function(e) {
  // If keyup is inside of the the textarea
  if (e.target.id === 'textInput') {
    // Make sure that the freewriting exercise is only handled once
    document.removeEventListener('keyup', initiator, false);

    // This is basically just settings for the timer. Could be fun to make this adjustable
    var workPeriodInSeconds = 60 * 10;

    var textarea = document.getElementById('textInput');
    var display = document.getElementById('timer');
    freewriting.startTimer(workPeriodInSeconds, display);
    freewriting.typeWatcher(textarea, 2000);
  }
};
// Listen for keyup events across the document
document.addEventListener('keyup', initiator, false);