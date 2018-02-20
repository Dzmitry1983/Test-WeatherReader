const database = require('../modules/db_connector.js');
const city_info = require('./city_info.js');

//exports
exports.user = user;
exports.loadUserByUserId = loadUserByUserId;

//user_info model
function user() {
	this.id = 0;
	this.cities = [];
	
	this.jsonString = function () {
		const stringify_object = {user:{id:this.id, cities:this.cities}};
		return JSON.stringify(stringify_object);
	}
	
	this.addCity = function (city_name) {
		if (city_name.length > 0) {
			const city = new city_info();
			city.name = city_name;
			this.cities.push(city);
			database.saveUser(this);
		}
	}
}

//support functions
function loadUserByUserId(user_id) {
	let new_user_id = database.getUserId(user_id);
	let cities = database.getCitiesForUserId(user_id);
	const user_info = new user();
	user_info.id = new_user_id;
	user_info.cities = cities;
	return user_info;
}
