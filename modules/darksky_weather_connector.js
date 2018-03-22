/*
 * Module works with darksky
 */

const https = require('https');

const url = "api.darksky.net/forecast";
const key = "e79b5ba2370fe558e66819d515ce1772";

// exports
exports.getWeatherForCity = getWeatherForCity;

/**
 * @param city is city_info
 * @param callback is a callback function with weather info Object
 * @returns
 */
function getWeatherForCity(city, callback) {
	const api_url = `https://${url}/${key}/${city.latitude},${city.longitude}`;
	if (city.status === "unknown")  {
		callback();
		return;
	}

	function f_to_c(f) {
		return (f - 32) * 5/9;
	}
	
	https.get(api_url, (res) => {
		let body = [];
		res.on('data', (chunk) => {
			body.push(chunk);
		});
		res.on('end', () => {
			const data = Buffer.concat(body).toString();
			const property_name = 'currently';
			let json_object = null;
			try {
				json_object = JSON.parse(data);
			} 
			catch (err) {
				console.log(err);
			}
			
			if (json_object.hasOwnProperty(property_name)) {
				const info = json_object[property_name];
				const return_object = {};
				
				return_object['temperature_max'] = f_to_c(info['temperature']);
				return_object['temperature_min'] = f_to_c(info['temperature']);
				return_object['precipitation_type'] = info['precipType'];
				return_object['precipitation'] = info['precipProbability'];
				callback(return_object);
			}
			else {
				callback();
			}
		});

	}).on('error', (e) => {
		callback();
		console.error(e);
	});
}