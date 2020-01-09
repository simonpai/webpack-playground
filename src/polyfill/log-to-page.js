var log = console.log;
var container = document.getElementById('display') || document.body;

function stringify(msg) {
  return typeof msg === 'function' ? msg.toString() : JSON.stringify(msg);
}

console.log = function(msg) {
  container.insertAdjacentHTML('beforeend',
    '<div class="console alert" role="alert"><pre><code>' + stringify(msg) + '</code></pre></div>');
  log.apply(this, arguments);
};
