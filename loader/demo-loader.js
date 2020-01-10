function displaySrc(line, lineNum) {
  return 'displaysrc(' + JSON.stringify(line) + ', ' + lineNum + ');';
}

function pushToFns(block) {
  return 'fns.push(function(){\n' + block + '\n})';
}

function shim(line) {
  // cheat on local variable, as now it's wrapped into a function scope
  return line.replace(/^var\s+/, 'window.');
}

const prefix = [
  'var fns = window.fns || (window.fns = []);',
  '!fns.i && (fns.i = 0);'
].map(s => s + '\n').join('');

module.exports = function(source) {
  const lines = [];
  let lineNum = 1;
  for (const line of source.split('\n')) {
    lines.push(pushToFns(displaySrc(line, lineNum++) + '\n' + shim(line)));
  }
  return prefix + lines.join('\n');
};