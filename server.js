const http = require('http');
const fs = require('fs');
var url = require('url');

const html_index_path = './resources/html/index.html';
const html_404_path = './resources/html/404.html';
const home_page = '/index.html';
const ajax_update = '/ajax';

const hostname = '127.0.0.1';
const port = 8080;
var number = 1;


var server = http.createServer((req, res) => {
	var q = url.parse(req.url, true);
	console.log(q.pathname);
	
	switch (q.pathname) {
		case home_page:
			fs.readFile(html_index_path, function(err, data) {
		    	res.writeHead(200, {'Content-Type': 'text/html'});
		    	res.write(data);
		    	res.end();
 			});
		break;
		case ajax_update:
			res.write('la-la-la' + number);
    		res.end();
		break;
		default:
			fs.readFile(html_404_path, function(err, data) {
		    	res.writeHead(200, {'Content-Type': 'text/html'});
		    	res.write(data);
		    	res.end();
 			});
		break;
	}

	
	number++;
 	console.log(`Server createServer  - (${req.url}) \n`);
});

server.listen(port, hostname, () => {
 	console.log(`Server running at http://${hostname}:${port}/\n`);
});
