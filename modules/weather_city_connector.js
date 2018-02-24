const darksky = require('./darksky_weather_connector.js');
const openweathermap = require('./openweathermap_weather_connector.js');
const database = require('./db_connector.js');

exports.getWeatherForCity = getWeatherForCity;

function getWeatherForCity(city, callback) {

	let promises = [];
	let data_1 = null;
	let data_2 = null;

	if (city.status !== "need update") {
		callback();
		return;
	}
	// need update, updating, updated, unknown
	city.status = "updating";
	database.updateCity(city);
	const darksky_promise = new Promise(function (resolve) {
		darksky.getWeatherForCity(city, (data) => {
			data_1 = data;
			resolve();
		});
	});

	const openweathermap_promise = new Promise(function (resolve) {
		openweathermap.getWeatherForCity(city, (data) => {
			data_2 = data;
			resolve();
		});
	});

	promises.push(darksky_promise);
	promises.push(openweathermap_promise);

	Promise.all(promises).then(function() {
		let return_object = {};
		return_object['precipitation'] = data_1['precipitation'];
		return_object['precipitation_type'] = data_1['precipitation_type'];

		if (data_1.hasOwnProperty('temperature_min') && data_2.hasOwnProperty('temperature_min')) {
			return_object.temperature_min = (data_1.temperature_min < data_2.temperature_min) ? data_1.temperature_min : data_2.temperature_min; 
		}
		else {
			return_object.temperature_min = (data_1.hasOwnProperty('temperature_min')) ? data_1.temperature_min : data_2.temperature_min;
		}

		if (data_1.hasOwnProperty('temperature_max') && data_2.hasOwnProperty('temperature_max')) {
			return_object.temperature_max = (data_1.temperature_max > data_2.temperature_max) ? data_1.temperature_max : data_2.temperature_max; 
		}
		else {
			return_object.temperature_max = (data_1.hasOwnProperty('temperature_max')) ? data_1.temperature_max : data_2.temperature_max;
		}
		callback(return_object);
	});
}