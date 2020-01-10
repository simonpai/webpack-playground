var container = document.getElementById('display') || document.body;

window.step = function() {
  var fns = window.fns;
  var fn = fns && fns[fns.i];
  if (!fn) {
    return false;
  }
  fn(); // TODO: error handling
  fns.i++;
  return true;
};

window.play = function() {
  if (window.step()) {
    setTimeout(window.play, 1000); // eslint-disable-line no-magic-numbers
  }
};

window.displaysrc = function(src, lineNum) {
  container.insertAdjacentHTML('beforeend',
    '<div class="source" data-line-num="' + lineNum + '"><pre><code>' + src + '&nbsp;</code></pre></div>');
};
