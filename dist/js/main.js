/*!
 * freewriting-app v0.0.1
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

/**
 * Render a template into the DOM
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
    var timer = duration, minutes, seconds;
    setInterval((function() {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;
      if (timer === 0) {
        var textContainer = document.getElementById('textInput');
        var placeholder = document.getElementById('placeholder');
        var wordCount = document.getElementById('wordCount');
        var template = '<div class="tekstr-info-box"><p><strong>Godt arbejdet. Her er din tekst:</strong></p><div>' + textContainer.value.replace(/\n\r?/g, '<br />') + '</div></div>';
        textContainer.style.display = 'none';
        placeholder.innerHTML = template;
        wordCount.innerHTML = 'Du har skrevet: ' + publicAPIs.words(textContainer.value).length + ' ord';
      }
      if (--timer < 0) {
        display.textContent = "00:00";
      }
    }), 1000);

    publicAPIs.words = function(text) {
      return text
        .replace(/[-'.]/ig, '') // Ignores hyphens and apostrophes. Dots are here to avoid split on . in numbers.
        .split(/[^a-zA-ZæøåÆØÅ0-9]/g) // Can't use \W+ since I need to take into account danish character ÆØÅ
        .filter(Boolean);
    };
  };

  publicAPIs.typeWatcher = function(textContainer, timer) {
    var time = timer;
    setInterval((function() {
      var content = textContainer.value;
      textContainer.addEventListener('keydown', (function(e) {
        if (e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || e.which == 46) {
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
  '<div class="freewriting-toolbar" id="toolbar">' +
  '<span id="toolbarWrapper">Tid: <span id="timer">10:00 </span>' +
  '<span id="wordCount" style="float: right;"></span>' +
  '<button id="settings" style="float: right;">' +
  '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.a{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round}</style></defs><path class="a" d="M20.254 13.5H22.5a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-2.247a11.8 11.8 0 0 0-1-2.922l1.586-1.588a1 1 0 0 0 0-1.414l-1.415-1.415a1 1 0 0 0-1.414 0L16.42 4.75a11.769 11.769 0 0 0-2.92-1V1.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v2.248a11.777 11.777 0 0 0-2.921 1l-1.59-1.587a1 1 0 0 0-1.414 0L3.16 4.576a1 1 0 0 0 0 1.414l1.59 1.589a11.821 11.821 0 0 0-1 2.921H1.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2.246a11.821 11.821 0 0 0 1 2.921l-1.59 1.59a1 1 0 0 0 0 1.414l1.415 1.414a1 1 0 0 0 1.414 0l1.589-1.589a11.8 11.8 0 0 0 2.926 1.004V22.5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.246a11.8 11.8 0 0 0 2.92-1l1.591 1.589a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-1.589-1.59a11.821 11.821 0 0 0 1.004-2.925z"/><circle class="a" cx="12" cy="12" r="4.5"/></svg>' +
  '</button>' +
  '</div>' + // #toolbarWrapper
  '</div>' + // .freewriting-toolbar
  '<div class="settings-toolbar">' + 
  '<div class="settings-item">Writing speed</div>' +
  '</div>' +
  '<div class="freewriting-text-box">' +
  '<textarea id="textInput" rows="14" placeholder="The counter fires off once you start typing.."></textarea>' +
  '<div id="placeholder"></div>' +
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
    var workPeriodInSeconds = 10;

    var textarea = document.getElementById('textInput');
    var display = document.getElementById('timer');
    freewriting.startTimer(workPeriodInSeconds, display);
    freewriting.typeWatcher(textarea, 2000);
    textarea.onkeydown = function(e) {
      if (e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || e.which == 46) {
        event.preventDefault();   // turn off keydown default
        // put here code you need
      }
    };
  }
};

// Listen for keyup events across the document
document.addEventListener('keyup', initiator, false);
document.addEventListener('click', (function (event) {
  //var settingsButton = document.getElementById('settings');
  var body = document.body;
  if (event.target.matches('#settings')) {
    console.log(body);
    body.classList.toggle('settings-open');
  }
}), false);