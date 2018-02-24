//node.js modules 
const http = require('http');
const fs = require('fs');
let url = require('url');
// my modules
const database = require('./modules/db_connector.js');
const user = require('./models/user_info.js');
const weather_city_connector = require('./modules/weather_city_connector.js');

// server constants
const hostname = '127.0.0.1';
const port = 8080;

// html pages paths
const html_index_path = './resources/html/index.html';
const html_404_path = './resources/html/404.html';

// constants for commands
const pathname_home_page = '/index.html';
const pathname_ajax_update = '/ajax';
const ajax_remove_user = 'ajax_remove_user';
const ajax_get_user_info = 'ajax_get_user_info';
const ajax_add_city = 'ajax_add_city';

const status_code_error = 404;
const status_code_ok = 200;

// cookie names constants
const cookie_name = 'session_user_id';


exports.close = function() {
	server.close();
};

// initialize databases
databasePrepare();

//

/*
 * request <http.IncomingMessage> response <http.ServerResponse>
 */
const server = http.createServer((request, response) => {
	let headers = {'Content-Type': 'text/html'};
	
	function finishResponse(send_value) {
		if (send_value.error) {
			console.error(send_value.error);
		}
		if (send_value.headers) {
			headers = Object.assign({}, headers, send_value.headers);
		}
		
		response.writeHead(send_value.status_code, headers);
		if (send_value.data) {
			response.write(send_value.data);
		}
		response.end();
	}
	
	
	if (request.method == "POST") {
		dynamicAjaxData(request, (send_value) => {
			
			let return_data = '';
			let user_id = loadUserIdFromCookies(request);
			let json_object = send_value.json_object;
			
			switch (json_object.action) {
				case ajax_remove_user:
					database.loadUserByUserId(0).then(function(user_info) {
						send_value.data = user_info.jsonString();
						saveUserIdToCookies(response, user_info.id);
						finishResponse(send_value);
					});
					break;
				case ajax_get_user_info:
					database.loadUserByUserId(user_id).then(function(user_info) {
						send_value.data = user_info.jsonString();
						saveUserIdToCookies(response, user_info.id);
						finishResponse(send_value);
					});
					break;
				case ajax_add_city:
					database.loadUserByUserId(user_id).then(function(user_info) {
						user_info.addCityByName(json_object.city_name);
						database.saveCitiesForUserId(user_info.id, user_info.cities).then(function () {
							database.loadUserByUserId(user_info.id).then(function(new_user) {
								send_value.data = new_user.jsonString();
								saveUserIdToCookies(response, new_user.id);
								new_user.cities.forEach((city) => {
									weather_city_connector.getWeatherForCity(city, (data) => {
										if (data != null) {
											city.status = "updated";
											city.temperature_min = data['temperature_min'];
											city.temperature_max = data['temperature_max'];
											city.precipitation_min = data['precipitation'];
											city.precipitation_max = data['precipitation'];
											city.precipitation_type = data['precipitation_type'];
											database.updateCity(city);
										}
									});
								});
								finishResponse(send_value);
							});
						});
					});
					break;
				default:
					send_value.status_code = status_code_error;
					finishResponse(send_value);
					break;
			}
		});
	}
	else {
		staticHtml(request, finishResponse);
	}
	
});

// start server listener
server.listen(port, hostname, () => {
 	console.log(`Server running at http://${hostname}:${port}/\n`);
});

// This function sends html pages to client
function staticHtml(request, callback) {
	const pathname = url.parse(request.url, true).pathname;
	let filepath = "";
	let status_code = status_code_ok;
	switch (pathname) {
		case pathname_home_page:
			filepath = html_index_path;
		break;
		default:
			filepath = html_404_path;
			status_code = status_code_error;
		break;
	}
	fs.readFile(filepath, function(err, data) {
		if (err) {
			status_code = status_code_error;
		}
		let send_data = new Object();
		send_data.status_code = status_code;
		send_data.data = data;
		send_data.error = err;
		callback(send_data);
	});
}

// work with POST requests
function dynamicAjaxData(request, callback) {
	let body = [];
	// http.IncommingMessage implements the Readable Stream
	request.on('error', (err) => {
		let send_data = new Object();
		send_data.error = err;
		send_data.status_code = status_code_error;
		callback(send_data);
	}).on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			let text = Buffer.concat(body).toString();
			let send_data = new Object();
			send_data.status_code = status_code_ok;
			try {
				send_data.json_object = JSON.parse(text);
		    } 
			catch (err) {
		    		send_data.error = err;
		    }
			callback(send_data);
		});
}

// work with cookies
function parseCookies (request) {
    let list = {};
    const rc = request.headers.cookie;
    rc && rc.split(';').forEach(function( cookie ) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

// load user_id
function loadUserIdFromCookies(request) {
	const cookies = parseCookies(request);
	let session_user_id = cookies[cookie_name];
	if (session_user_id == null) {
		session_user_id = 0;
	}
	return session_user_id;
}

function saveUserIdToCookies(response, user_id) {
	response.setHeader('Set-Cookie', [cookie_name + "=" + user_id]);
}

async function databasePrepare() {
	await database.initialize();
}

async function updateSessionUser(request, response) {
	const session_user_id = loadUserIdFromCookies(request);
	const user_info = await database.loadUserByUserId(session_user_id);
	saveUserIdToCookies(response, user_info.id);
	return user_info;
}
