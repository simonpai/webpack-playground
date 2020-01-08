var container = document.getElementById('display') || document.body;

window.displaysrc = function(src, lineNum) {
  container.insertAdjacentHTML('beforeend',
    '<div class="source" data-line-num="' + lineNum + '"><pre><code>' + src + '&nbsp;</code></pre></div>');
};
