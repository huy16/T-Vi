import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/log-error') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log("=== REACT CRASH ERROR LOGGED ===");
      try {
        const data = JSON.parse(body);
        console.log("ERROR:", data.error);
        console.log("STACK:", data.stack);
        console.log("COMPONENT STACK:", data.componentStack);
        
        fs.writeFileSync('react_crash_log.txt', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log("Raw body:", body);
      }
      console.log("================================");
      res.writeHead(200);
      res.end('Logged');
      
      setTimeout(() => process.exit(0), 1000);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(5555, () => {
  console.log('Error logger listening on port 5555... PLEASE CLICK LẬP LÁ SỐ TỬ VI AGAIN!');
});
