const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;

let dictionary = [];
let requestCount = 0;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    requestCount++;

    // CORS headers for cross-origin allowance
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'POST' && parsedUrl.pathname === '/api/definitions') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { word, definition } = JSON.parse(body);
            
            // Simple input validation
            if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid input. Please provide a word and its definition.' }));
                return;
            }

            const existingEntry = dictionary.find(entry => entry.word === word);
            if (existingEntry) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Warning! '${word}' already exists.` }));
            } else {
                dictionary.push({ word, definition });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    message: `Request #${requestCount} New entry recorded: "${word} : ${definition}"`,
                    totalEntries: dictionary.length
                }));
            }
        });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/api/definitions/') {
        const { word } = parsedUrl.query;
        
        if (!word) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Please provide a word to search.' }));
            return;
        }

        const entry = dictionary.find(entry => entry.word === word);
        if (entry) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ definition: entry.definition }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Request# ${requestCount}, word '${word}' not found!` }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found.' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
