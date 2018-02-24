const http = require('http');

const url = "api.openweathermap.org";
const key = "470e62edf808f8188b24d196a7662b9e";

exports.getWeatherForCity = getWeatherForCity;

function getWeatherForCity(city, callback) {

	const api_url = `http://${url}/data/2.5/forecast?APPID=${key}&lat=${city.latitude}&lon=${city.longitude}`;

	if (city.status === "unknown") {
		callback();
		return;
	}

	function k_to_c(k) {
		return k - 272.15;
	}

	http.get(api_url, (res) => {
		let body = [];
		res.on('data', (chunk) => {
			body.push(chunk);
		});
		res.on('end', () => {
			const data = Buffer.concat(body).toString();
			let json_object = null;
			try {
				json_object = JSON.parse(data);
			} 
			catch (err) {
				console.log(err);
			}
			const property_name = 'list';
			if (json_object.hasOwnProperty(property_name)) {
				const info = json_object[property_name];
				const return_object = {};

				if (info.length > 0) {
					return_object['temperature_max'] = k_to_c(info[0].main.temp_max);
					return_object['temperature_min'] = k_to_c(info[0].main.temp_min);
				}
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