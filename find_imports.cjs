const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
}

walk('./src', function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(file => {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    let hasCode = false;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line.startsWith('import ')) {
        if (hasCode) {
          console.log(file + ' has import on line ' + (i+1) + ' AFTER code.');
        }
      } else if (line !== '' && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
        hasCode = true;
      }
    }
  });
});
