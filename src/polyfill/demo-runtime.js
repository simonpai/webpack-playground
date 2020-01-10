var container = document.getElementById('display') || document.body;

window.step = function() {
  var fns = window.fns;
  var fn = fns && fns[fns.i];
  if (!fn) {
    return;
  }
  fn();
  fns.i++;
};

window.displaysrc = function(src, lineNum) {
  container.insertAdjacentHTML('beforeend',
    '<div class="source" data-line-num="' + lineNum + '"><pre><code>' + src + '&nbsp;</code></pre></div>');
};
