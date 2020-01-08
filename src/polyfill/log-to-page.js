var log = console.log;
var container = document.getElementById('display') || document.body;

console.log = function(msg) {
  container.insertAdjacentHTML('beforeend', 
    '<div class="console alert" role="alert"><pre><code>' + JSON.stringify(msg) + '</code></pre></div>');
  log.apply(this, arguments);
};
