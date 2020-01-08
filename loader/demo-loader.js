module.exports = function(source) {
  const lines = [];
  let lineNum = 1;
  for (const line of source.split('\n')) {
    lines.push('displaysrc(' + JSON.stringify(line) + ', ' + lineNum++ + ');\n');
    lines.push(line);
  }
  return lines.join('\n');
};