const database = require('../modules/db_connector.js');
const city_info = require('./city_info.js');

//exports
module.exports = user;
module.exports.loadUserByUserId = loadUserByUserId;

//user_info model
function user() {
	this.id = 0;
	this.cities = [];
	
	this.jsonString = function () {
		const stringify_object = {user:{id:this.id, cities:this.cities}};
		return JSON.stringify(stringify_object);
	}
	
	this.addCityByName = function (city_name) {
		if (city_name.length > 0) {
			const index = this.cities.findIndex(function (city) {
				return city.name === city_name;
			});
			if (index < 0) {
				const city = new city_info();
				city.name = city_name;
				this.cities.push(city);
				database.saveCitiesForUserId(this.id, this.cities);
			}
		}
	}
	
	this.removeCityByName = function (city_name) {
		if (city_name.length > 0) {
			const index = this.cities.findIndex(function (city) {
				return city.name === city_name;
			});
			
			if (index >= 0) {
				this.cities.splice(index, 1);
				database.saveCitiesForUserId(this.id, this.cities);
			}
		}
	}
}

//support functions
function loadUserByUserId(user_id) {
	let new_user_id = user_id;
	if (!database.isUserIdExist(user_id)) {
		new_user_id = database.getNewUserId();
	}
	let cities = database.getCitiesForUserId(user_id);
	const user_info = new user();
	user_info.id = new_user_id;
	user_info.cities = cities;
	return user_info;
}
