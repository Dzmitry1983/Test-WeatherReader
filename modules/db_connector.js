//var mysql = require('mysql');
const city_info = require('../models/city_info.js');
//const user_info = require('../models/user_info.js');

exports.getUserId = getUserId;
exports.getCitiesForUserId = getCitiesForUserId;
exports.saveUser = saveUser;

let saved_user = 0;

//var con = mysql.createConnection({
//  host: "localhost",
//  user: "yourusername",
//  password: "yourpassword"
//});
//
//con.connect(function(err) {
//  if (err) throw err;
//  console.log("Connected!");
//});

/*
 * user {userId}
 * cityId:city, weather, date
 * user {cities}
 */

let user_id_db = 1;

/*
 * get userId form database, if userId doesn't exist, make new userId
 */
function getUserId(user_id) {
	let new_user_id = user_id;
	if (user_id == 0 || !isUserIdExist(user_id)) {
		new_user_id = createNewUserId();
	}
	return new_user_id;
}

function createNewUserId() {
	user_id_db++;
	return user_id_db;
}

function isUserIdExist(user_id) {
	return user_id > 0;
}

//save user to database
function saveUser(user) {
	saved_user = user;
}

//load user from database, if user id is '0', create new user
function loadUserByUserId() {
	
}


//load cities
function getCitiesForUserId(user_id) {
	let cities = [];
	if (user_id == saved_user.id) {
		cities = saved_user.cities;
	}
//	let city = new city_info();
//	cities.push(city);
	return cities;
}