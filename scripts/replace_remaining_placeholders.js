const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk(dir) {
  const res = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach((it) => {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (['coverage','dist','node_modules','test-results'].includes(it.name)) return;
      res.push(...walk(p));
    } else if (it.isFile() && p.endsWith('.js')) {
      res.push(p);
    }
  });
  return res;
}

const files = walk(SRC);
let changed = 0;
files.forEach((file) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('[REDACTED_TOKEN]')) return;
    const backup = file + '.bak_auto_replace2';
    if (!fs.existsSync(backup)) fs.writeFileSync(backup, content, 'utf8');
    const updated = content.split('[REDACTED_TOKEN]').join('PLACEHOLDER');
    fs.writeFileSync(file, updated, 'utf8');
    changed++;
    console.log('Patched:', path.relative(ROOT, file));
  } catch (err) {
    console.error('Error patching', file, err.message);
  }
});
console.log('\nDone. Files changed:', changed);
process.exit(0);
