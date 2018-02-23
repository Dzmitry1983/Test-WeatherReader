//node.js modules 
const http = require('http');
const fs = require('fs');
let url = require('url');
const database = require('./modules/db_connector.js');
//my modules
const user = require('./models/user_info.js');

//server constants
const hostname = '127.0.0.1';
const port = 8080;

//html pages paths
const html_index_path = './resources/html/index.html';
const html_404_path = './resources/html/404.html';

//constants for commands
const pathname_home_page = '/index.html';
const pathname_ajax_update = '/ajax';
const ajax_remove_user = 'ajax_remove_user';
const ajax_get_user_info = 'ajax_get_user_info';
//const ajax_get_cities_for_city_name = 'ajax_get_cities_for_city_name';
const ajax_add_city = 'ajax_add_city';

//cookie names constants
const cookie_name = 'session_user_id';

async function databasePrepare() {
	await database.deleteDatabase();
	await database.initialize();
}

databasePrepare();

//

/*
 * request <http.IncomingMessage>
 * response <http.ServerResponse>
 */
const server = http.createServer((request, response) => {
	
//	const { headers, method, url } = request;
//	console.log(headers);
//	console.log(method);
//	console.log(url);
	
	if (request.method == "POST") {
		processingPostData(request, response);
	}
	else {
		reloadPage(request, response);
	}
});

server.listen(port, hostname, () => {
 	console.log(`Server running at http://${hostname}:${port}/\n`);
});


//This function sends html static pages to client
function reloadPage(request, response) {
	const pathname = url.parse(request.url, true).pathname;
	let filepath = "";
	switch (pathname) {
		case pathname_home_page:
			updateSessionUser(request, response);
			filepath = html_index_path;
		break;
		default:
			filepath = html_404_path;
		break;
	}
	fs.readFile(filepath, function(err, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
		});
}

//work with POST requests
function processingPostData(request, response) {
	let body = [];
	//http.IncommingMessage implements the Readable Stream
	request.on('error', (err) => {
			console.error(err);
		}).on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			if (body.length > 0) {
				let obj = JSON.parse(body);
				sendAjaxData(request, response, obj);
			}
	  });
}

async function sendAjaxData(request, response, json_object) {
	let return_data = '';
	let user_info;
	switch (json_object.action) {
		case ajax_remove_user:
			user_info = clearSessionUser(response);
			return_data = user_info.jsonString();
			break;
		case ajax_get_user_info:
			user_info = await updateSessionUser(request, response);
			console.log(user_info);
			return_data = user_info.jsonString();
			break;
		case ajax_add_city:
			user_info = await updateSessionUser(request, response);
			user_info.addCity(json_object.city_name);
			return_data = user_info.jsonString();
			break;
		default:
			break;
	}
	response.write(return_data);
	response.end();
	console.log(return_data);
}

//work with cookies
function parseCookies (request) {
    let list = {};
    const rc = request.headers.cookie;
    rc && rc.split(';').forEach(function( cookie ) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function loadUserIdFromCookies(request) {
	const cookies = parseCookies(request);
	const session_user_id = cookies[cookie_name];
	return session_user_id;
}

function saveUserIdToCookies(response, user_id) {
	response.setHeader('Set-Cookie', [cookie_name + "=" + user_id]);
}

async function updateSessionUser(request, response) {
	const session_user_id = loadUserIdFromCookies(request);
	const user_info = await database.loadUserByUserId(session_user_id);
	saveUserIdToCookies(response, user_info.id);
	return user_info;
}

function clearSessionUser(response) {
	const user_info = user.loadUserByUserId(0);
	saveUserIdToCookies(response, user_info.id);
	return user_info;
}
