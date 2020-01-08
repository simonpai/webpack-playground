var log = console.log;
var screen = document.getElementById('screen') || document.body;

console.log = function(msg) {
  screen.insertAdjacentHTML('beforeend', '<div class="console-log alert alert-success" role="alert"><pre><code>' + JSON.stringify(msg) + '</code></pre></div>');
  log.apply(this, arguments);
};
