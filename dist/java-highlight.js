const keywords = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
  'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
  'finally', 'float', 'for', 'if', 'implements', 'import', 'instanceof', 'int',
  'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public',
  'record', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized',
  'this', 'throw', 'throws', 'transient', 'try', 'var', 'void', 'volatile', 'while',
  'yield', 'true', 'false', 'null',
]);

const types = new Set([
  'AtomicBoolean', 'ConcurrentHashMap', 'Deque', 'Duration', 'HashMap', 'List', 'Map',
  'Math', 'Object', 'Optional', 'Queue', 'Set', 'String', 'System', 'ThreadLocalRandom',
]);

const escapeHTML = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const token = (kind, value) => `<span class="tok-${kind}">${escapeHTML(value)}</span>`;

export function highlightJava(source) {
  let html = '';
  let index = 0;
  while (index < source.length) {
    const rest = source.slice(index);
    let match;

    if (rest.startsWith('//')) {
      const end = source.indexOf('\n', index);
      const stop = end === -1 ? source.length : end;
      html += token('comment', source.slice(index, stop));
      index = stop;
      continue;
    }
    if (rest.startsWith('/*')) {
      const end = source.indexOf('*/', index + 2);
      const stop = end === -1 ? source.length : end + 2;
      html += token('comment', source.slice(index, stop));
      index = stop;
      continue;
    }
    if (source[index] === '"' || source[index] === "'") {
      const quote = source[index];
      let stop = index + 1;
      while (stop < source.length) {
        if (source[stop] === '\\') stop += 2;
        else if (source[stop++] === quote) break;
        else stop += 0;
      }
      html += token('string', source.slice(index, stop));
      index = stop;
      continue;
    }
    if ((match = rest.match(/^@[A-Za-z_$][\w$]*/))) {
      html += token('annotation', match[0]);
      index += match[0].length;
      continue;
    }
    if ((match = rest.match(/^(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?)(?:[lLfFdD])?/))) {
      html += token('number', match[0]);
      index += match[0].length;
      continue;
    }
    if ((match = rest.match(/^[A-Za-z_$][\w$]*/))) {
      const word = match[0];
      html += keywords.has(word) ? token('keyword', word) : types.has(word) || /^[A-Z]/.test(word) ? token('type', word) : escapeHTML(word);
      index += word.length;
      continue;
    }
    html += escapeHTML(source[index]);
    index += 1;
  }
  return html;
}
