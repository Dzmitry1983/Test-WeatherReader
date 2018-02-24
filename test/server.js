const assert = require('assert');
const http = require('http');
const querystring = require('querystring');
const model_for_check = require('../server.js');

const hostname = 'localhost';
const port = 8080;
const pathname_home_page = '/index.html';
const pathname_ajax_update = '/ajax';
const ajax_remove_user = 'ajax_remove_user';
const ajax_get_user_info = 'ajax_get_user_info';
const ajax_add_city = 'ajax_add_city';

const city_name_1 = 'Minsk';
const city_name_2 = 'Moscow';
const city_name_3 = 'unreal city xxx';

//function parseCookies (request) {
//    let list = {};
//    const rc = request.headers.cookie;
//    rc && rc.split(';').forEach(function( cookie ) {
//        let parts = cookie.split('=');
//        list[parts.shift().trim()] = decodeURI(parts.join('='));
//    });
//
//    return list;
//}
//
////load user_id
//function loadUserIdFromCookies(request) {
//	const cookies = parseCookies(request);
//	let session_user_id = cookies[cookie_name];
//	if (session_user_id == null) {
//		session_user_id = 0;
//	}
//	return session_user_id;
//}

//exports.initialize = initialize;
describe('server', function() {
	describe('#check functions', function() {
		let all_functions_exist = true;
		describe('#functions exist', function() {
			const functions_names = [
				'close',
				];
			
			functions_names.forEach(function(function_name) {
				it(`${function_name}`, function() {
					let is_function = model_for_check.hasOwnProperty(function_name);
					is_function &= "function" === typeof model_for_check[function_name];
					all_functions_exist &= is_function;
					assert.ok(is_function, `function ${function_name} doesn't exist`);
				});
			});
		});
		
		describe('#server works', () => {
			before(function () {
//				this.skip();
			});
			
			after(function () {
				model_for_check.close();
			});
			describe('static pages', () => {
				it('check connection, should return 404', function (done) {
					http.get(`http://${hostname}:${port}`, function (res) {
						assert.equal(404, res.statusCode);
						done();
					});
				});
				
				it('check connection, should return 200', function (done) {
					http.get(`http://${hostname}:${port}${pathname_home_page}`, function (res) {
						assert.equal(200, res.statusCode);
						done();
					});
				});
			});
			
			describe('check ajax', () => {
				let cookies = null;
				let functions_to_skip = {
						ajax_remove_user:true,
						ajax_get_user_info:true,
						ajax_add_city:true,
						};
				
				function sendAjaxData(json_dictionary, callback) {
					let callback_value = new Object();
					const post_data = JSON.stringify(json_dictionary);
					const options = {
						  hostname:hostname,
						  port: port,
						  path: pathname_ajax_update,
						  method: 'POST',
						  timeout:1000,
						  headers: {
							    'Content-Type': 'text/html',
							    'Content-Length': Buffer.byteLength(post_data),
							  }
						};
					if (cookies != null) {
						options.headers['cookie'] = cookies;
					}
					const req = http.request(options, (res) => {
						let body = [];
						callback_value.status_code = res.statusCode; 
						cookies = res.headers['set-cookie'];
						
//						console.log(`status: ${res.statusCode}`);
//					  	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//						res.setEncoding('utf8');
						res.on('data', (chunk) => {
							body.push(chunk);
						});
						res.on('end', () => {
							callback_value.data = Buffer.concat(body).toString();
//							console.log(callback_value.data);
							callback(callback_value);
							
					  });
					});
					
					
					req.on('error', (err) => {
					  console.error(`problem with request: ${err.message}`);
					  callback_value.error = err;
					  callback(callback_value);
					  
					});
					req.write(post_data);
					req.end();
				}
					
				
				
				//callback is waiting for ({data:text, error:error, status_code:status})
				function checkAjaxConnection(action, callback) {
					sendAjaxData({action:action}, callback);
				}
				
				
				it('check connection, should return 404', function (done) {
					http.get(`http://${hostname}:${port}${pathname_ajax_update}`, function (res) {
						assert.equal(404, res.statusCode);
						done();
					});
				});
				
				it(`check action (${ajax_remove_user}), should return 200`, function (done) {
					checkAjaxConnection(ajax_remove_user, (callback_value) => {
						assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
						functions_to_skip[ajax_remove_user] = false;
						done();
					});
				});
				
				it(`check action (${ajax_get_user_info}), should return 200`, function (done) {
					checkAjaxConnection(ajax_get_user_info, (callback_value) => {
						assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
						functions_to_skip[ajax_get_user_info] = false;
						done();
					});
				});
				
				it(`check action (${ajax_add_city}), should return 200`, function (done) {
					checkAjaxConnection(ajax_add_city, (callback_value) => {
						assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
						functions_to_skip[ajax_add_city] = false;
						done();
					});
				});
				
				it('check action (xxxxxxxx), should return 404', function (done) {
					checkAjaxConnection('xxxxxxxx', (callback_value) => {
						assert.equal(404, callback_value.status_code,`status code is ${callback_value.status_code}`);
						done();
					});
				});
				
				describe('verification ajax data', () => {
					let last_user = 0;
					
					it(`check action (${ajax_remove_user}), check to keys exist`, function (done) {
						if (functions_to_skip[ajax_remove_user]) this.skip();
						checkAjaxConnection(ajax_remove_user, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							assert.equal(true, json.hasOwnProperty('user'), "must hase a property 'user'");
							last_user = json.user;
							assert.equal(true, last_user.hasOwnProperty('id'), "must hase a property 'id'");
							assert.equal(true, last_user.hasOwnProperty('cities'), "must hase a property 'cities'");
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_remove_user}), check for uniq`, function (done) {
						if (functions_to_skip[ajax_remove_user]) this.skip();
						checkAjaxConnection(ajax_remove_user, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							const user = json.user;
							assert.notEqual(user.id, last_user.id, `users need to be different (${last_user.id}, ${user.id})`);
							last_user = user;
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_get_user_info}), check to keys exist`, function (done) {
						if (functions_to_skip[ajax_get_user_info]) this.skip();
						checkAjaxConnection(ajax_get_user_info, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							assert.equal(true, json.hasOwnProperty('user'), "must hase a property 'user'");
							last_user = json.user;
							assert.equal(true, last_user.hasOwnProperty('id'), "must hase a property 'id'");
							assert.equal(true, last_user.hasOwnProperty('cities'), "must hase a property 'cities'");
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_get_user_info}), check for equal`, function (done) {
						if (functions_to_skip[ajax_get_user_info]) this.skip();
						checkAjaxConnection(ajax_get_user_info, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							const user = json.user;
							assert.equal(user.id, last_user.id, `users need to be equal (${last_user.id}, ${user.id})`);
							last_user = user;
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_add_city}), check to keys exist`, function (done) {
						if (functions_to_skip[ajax_add_city]) this.skip();
						checkAjaxConnection(ajax_add_city, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							assert.equal(true, json.hasOwnProperty('user'), "must hase a property 'user'");
							last_user = json.user;
							assert.equal(true, last_user.hasOwnProperty('id'), "must hase a property 'id'");
							assert.equal(true, last_user.hasOwnProperty('cities'), "must hase a property 'cities'");
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_add_city}), check for different cities count`, function (done) {
						if (functions_to_skip[ajax_add_city]) this.skip();
						const data_to_send = {
								action:ajax_add_city,
								city_name:city_name_1
						};
						sendAjaxData(data_to_send, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							const user = json.user;
							assert.equal(user.id, last_user.id, `users need to be equal (${last_user.id}, ${user.id})`);
							assert.notEqual(user.cities.length, last_user.cities.length, `Cities count need to be different (${last_user.cities.length}), ${user.cities.length}`);
							last_user = user;
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_add_city}), check for different cities count`, function (done) {
						if (functions_to_skip[ajax_add_city]) this.skip();
						const data_to_send = {
								action:ajax_add_city,
								city_name:city_name_2
						};
						sendAjaxData(data_to_send, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							const user = json.user;
							assert.equal(user.id, last_user.id, `users need to be equal (${last_user.id}, ${user.id})`);
							assert.notEqual(user.cities.length, last_user.cities.length, `Cities count need to be different (${last_user.cities.length}, ${user.cities.length})`);
							last_user = user;
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
					
					it(`check action (${ajax_add_city}), check for equal if city doesn't exist`, function (done) {
						if (functions_to_skip[ajax_add_city]) this.skip();
						const data_to_send = {
								action:ajax_add_city,
								city_name:city_name_3
						};
						sendAjaxData(data_to_send, (callback_value) => {
							const json = JSON.parse(callback_value.data);
							const user = json.user;
							assert.equal(user.id, last_user.id, `users need to be equal (${last_user.id}, ${user.id})`);
							assert.equal(user.cities.count, last_user.cities.count, `Cities count need to be equal (${last_user.cities.count}, ${user.cities.count})`);
							last_user = user;
							assert.equal(200, callback_value.status_code,`status code is ${callback_value.status_code}`);
							done();
						});
					});
				});
			});
			
			
//			
//			it('get data!"', function (done) {
//				http.get(`http://${hostname}:${port}`, function (res) {
//					var data = '';
//					res.on('data', function (chunk) {
//						data += chunk;
//					});
//					res.on('end', function () {
////						assert.equal('Hello, world!\n', data);
////						console.log(data);
//				        done();
//					});
//			    });
//			  });
			
			
		});
	});
});