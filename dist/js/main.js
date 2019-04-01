/*!
 * freewriting-app v1.0.0
 * A simple app to practice freewriting. Once you start typing, you don't stop. Otherwise the app starts deleting your text!
 * (c) 2019 Mark Buskbjerg
 * MIT License
 * http://github.com/MarkBuskbjerg/freewriting-app
 */

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
  template =
    typeof template === 'function' ? template(template.state) : template;
  if (typeof template !== 'string') return;
  // Render the template into the element
  if (elem.innerHTML === template) return;
  elem.innerHTML = template;
  // Dispatch a render event
  if (typeof window.CustomEvent === 'function') {
    var event = new CustomEvent('render', {
      bubbles: true,
    });
    elem.dispatchEvent(event);
  }
  // Return the elem for use elsewhere
  return elem;
};

/**
 * Create the methods for the freewriting app and return as an API
 * @return {[object]}                   publicAPIs
 */

var freewriting = (function() {
  'use strict;';

  // Public APIs
  var publicAPIs = {};

  publicAPIs.deleteCharacter = function(text) {
    var deleteCharacter = text.split('');
    deleteCharacter.pop();
    return deleteCharacter.join('');
  };

  publicAPIs.startTimer = function(duration, display) {
    var timer = duration,
      minutes,
      seconds;
    setInterval((function() {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      display.textContent = minutes + ':' + seconds;
      if (timer === 0) {
        var textContainer = document.getElementById('textInput');
        var placeholder = document.getElementById('placeholder');
        var wordCount = document.getElementById('wordCount');
        var template =
          '<div class="tekstr-info-box margin-top"><p><strong>Stærkt arbejde 💥<br/> Her er din tekst:</strong></p><div>' +
          textContainer.value.replace(/\n\r?/g, '<br />') +
          '</div></div>';
        textContainer.style.display = 'none';
        placeholder.innerHTML = template;
        wordCount.innerHTML =
          "<strong>Det er ik' så vigtigt, men du har skrevet " +
          publicAPIs.words(textContainer.value).length +
          ' ord</strong>';
      }
      if (--timer < 0) {
        display.textContent = '00:00';
      }
    }), 1000);

    publicAPIs.words = function(text) {
      return text
        .replace(/[-'.]/gi, '') // Ignores hyphens and apostrophes. Dots are here to avoid split on . in numbers.
        .split(/[^a-zA-ZæøåÆØÅ0-9]/g) // Can't use \W+ since I need to take into account danish character ÆØÅ
        .filter(Boolean);
    };
  };

  publicAPIs.typeWatcher = function(textContainer, timer) {
    var time = timer;
    setInterval((function() {
      var content = textContainer.value;
      textContainer.addEventListener('keydown', (function(e) {
        if (
          e.keyCode == 8 ||
          e.keyCode == 37 ||
          e.keyCode == 38 ||
          e.keyCode == 39 ||
          e.keyCode == 40 ||
          e.keyCode == 46 ||
          (e.ctrlKey && e.keyCode === 65) ||
          (e.ctrlKey && e.keyCode === 88) ||
          (e.ctrlKey && e.keyCode === 67)
        ) {
          // ... And nothing happens cause you're not rewarded for trying to edit the text
        } else {
          time = timer;
        }
      }));
      if (time <= 0) {
        textContainer.value = publicAPIs.deleteCharacter(content);
      } else {
        time -= 500;
      }
    }), 500);
  };

  // Return our public APIs
  return publicAPIs;
})();

var template =
  '<div class="freewriting-app">' +
  '<header class="freewriting-toolbar" id="toolbar">' +
  '<div id="toolbarWrapper" class="container container-small text-center"><h4><strong>Tid<br/><span id="timer">10:00 </span></strong></h4>' +
  '<div id="wordCount" class="margin-bottom"><strong></strong></div></div>' +
  '</header>' +
  '<div class="freewriting-text-box container container-small">' +
  '<textarea autofocus id="textInput" rows="14" placeholder="Nedtællingen starter, når du begynder at skrive.."></textarea>' +
  '<div id="placeholder"></div>' +
  '</div>' +
  '</div>';

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

    // Just make sure, that script doesn't trigger on these keys
    textarea.onkeydown = function(e) {
      if (
        e.keyCode == 8 ||
        e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 39 ||
        e.keyCode == 40 ||
        e.keyCode == 46 ||
        (e.ctrlKey && e.keyCode === 65) ||
        (e.ctrlKey && e.keyCode === 88) ||
        (e.ctrlKey && e.keyCode === 83) ||
        (e.ctrlKey && e.keyCode === 67)
      ) {
        e.preventDefault(); // turn off keydown default event
      }
    };
  }
};
// Listen for keyup events across the document
document.addEventListener('keyup', initiator, false);
