const fs = require('fs');

const engineCode = fs.readFileSync('src/utils/tuviEngine.js', 'utf8');
const devDictPath = 'src/utils/starDictionary.js';
let dictionaryCode = '';
if(fs.existsSync(devDictPath)) {
    dictionaryCode = fs.readFileSync(devDictPath, 'utf8');
}

const engineStars = new Set();

// Find all push('Star Name')
const starRegex = /\.push\(['"](.+?)['"]\)/g;
let match;
while ((match = starRegex.exec(engineCode)) !== null) {
  engineStars.add(match[1]);
}

// Find Tràng sinh assignments vongTSArr = ['...', '...']
const tsGroups = engineCode.match(/vongTSArr\s*=\s*\[(.*?)\]/);
if (tsGroups) {
  const tsStars = tsGroups[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
  tsStars.forEach(s => engineStars.add(s));
}

// Find dict keys
const dictStars = new Set();
const dictRegex = /"([^"]+)":\s*"/g;
while ((match = dictRegex.exec(dictionaryCode)) !== null) {
  dictStars.add(match[1]);
}

const missingStars = [...engineStars].filter(s => !dictStars.has(s)).sort();

console.log("Tổng số sao trong Engine:", engineStars.size);
console.log("Tổng số sao có trong Dictionary:", dictStars.size);
console.log("Số sao chưa có ý nghĩa:", missingStars.length);
console.log("Danh sách cụ thể:\n" + missingStars.join(", "));
