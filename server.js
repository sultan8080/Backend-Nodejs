const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Voila la réponse du premier server avec nodemon ! Installation: npm install -g nodemon Ensuite: nodemon server');
});

server.listen(process.env.PORT || 3000);