const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
if (keyMatch) {
  const key = keyMatch[1];
  fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
    .then(res => res.json())
    .then(data => {
      if (data.models) {
        data.models.forEach(m => console.log(m.name));
      } else {
        console.log(data);
      }
    });
}
