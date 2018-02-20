//var mysql = require('mysql');
const city_info = require('../models/city_info.js');
//const user_info = require('../models/user_info.js');


exports.isUserIdExist = isUserIdExist;
exports.getNewUserId = getNewUserId;
exports.removeUserById = removeUserById;
exports.removeAllUsers = removeAllUsers;
exports.getCountUsers = getCountUsers;
exports.isCityNameExist = isCityNameExist;
exports.addCityByName = addCityByName;
exports.getCityByName = getCityByName;
exports.removeCityByName = removeCityByName;
exports.removeAllCities = removeAllCities;
exports.updateCity = updateCity;
exports.getCountCities = getCountCities;
exports.getCitiesForUserId = getCitiesForUserId;
exports.saveCitiesForUserId = saveCitiesForUserId;


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
function isUserIdExist(user_id) {
	return user_id > 0;
}

function getNewUserId() {
	user_id_db++;
	return user_id_db;
}

function removeUserById(user_id) {
	
}

function removeAllUsers() {
	
}

function getCountUsers() {
	
}

function isCityNameExist(city_name) {
	
}

function addCityByName(city_name) {
	
}

function getCityByName(city_name) {
	
}

function removeCityByName(city_name) {
	
}

function removeAllCities() {
	
}

function updateCity(city) {
	
}

function getCountCities() {
	
}

function getCitiesForUserId(user_id) {
	
}

function saveCitiesForUserId(user_id, cities) {
	
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