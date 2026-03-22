const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(new RegExp('\\bbg-white\\b(?! dark:)(?!/)', 'g'), 'bg-white dark:bg-slate-900');
  content = content.replace(new RegExp('\\bbg-slate-50\\b(?! dark:)(?!/)', 'g'), 'bg-slate-50 dark:bg-slate-950');
  content = content.replace(new RegExp('\\bbg-slate-100\\b(?! dark:)(?!/)', 'g'), 'bg-slate-100 dark:bg-slate-800');
  content = content.replace(new RegExp('\\bbg-transparent\\b(?! dark:)(?!/)', 'g'), 'bg-transparent dark:bg-slate-950');
  
  // Text colors
  content = content.replace(new RegExp('\\btext-slate-900\\b(?! dark:)', 'g'), 'text-slate-900 dark:text-white');
  content = content.replace(new RegExp('\\btext-slate-800\\b(?! dark:)', 'g'), 'text-slate-800 dark:text-slate-100');
  content = content.replace(new RegExp('\\btext-slate-700\\b(?! dark:)', 'g'), 'text-slate-700 dark:text-slate-200');
  content = content.replace(new RegExp('\\btext-slate-600\\b(?! dark:)', 'g'), 'text-slate-600 dark:text-slate-300');
  content = content.replace(new RegExp('\\btext-slate-500\\b(?! dark:)', 'g'), 'text-slate-500 dark:text-slate-400');
  
  // Borders
  content = content.replace(new RegExp('\\bborder-slate-100\\b(?! dark:)(?!/)', 'g'), 'border-slate-100 dark:border-slate-800/50');
  content = content.replace(new RegExp('\\bborder-slate-200\\b(?! dark:)(?!/)', 'g'), 'border-slate-200 dark:border-slate-700/50');
  content = content.replace(new RegExp('\\bborder-white\\b(?! dark:)(?!/)', 'g'), 'border-white dark:border-slate-800');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

try {
  walkDir(path.join(__dirname, 'src', 'components'));
  processFile(path.join(__dirname, 'src', 'App.jsx'));
  processFile(path.join(__dirname, 'src', 'hooks', 'useAuth.jsx'));
} catch (e) {
  console.error("Failed", e);
}
