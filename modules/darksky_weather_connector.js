const https = require('https');

exports.getWeatherForCity = getWeatherForCity;

const url = "api.darksky.net/forecast";
const key = "e79b5ba2370fe558e66819d515ce1772";

const example = {
		
};

function getWeatherForCity(city, callback) {
	if (city.status === "unknown") {
		callback();
		return;
	}
	
	const api_url = `https://${url}/${key}/${city.latitude},${city.longitude}`;
	
	https.get(api_url, (res) => {
//		console.log('statusCode:', res.statusCode);
//		console.log('headers:', res.headers);
//		
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
			const property_name = 'currently';
			if (json_object.hasOwnProperty(property_name)) {
				const info = json_object[property_name];
				const return_object = {};
				function f_to_c(f) {
					return (f - 32) * 5/9;
				}
				
				return_object['temperature_max'] = f_to_c(info['temperature']);
				return_object['temperature_min'] = f_to_c(info['temperature']);
				return_object['precipitation_type'] = info['precipType'];
				return_object['precipitation'] = info['precipProbability'];
				callback(return_object);
			}
			else {
				callback();
			}
			
//			currently: 
//			   { time: 1519454991,
//			     summary: 'Mostly Cloudy',
//			     icon: 'partly-cloudy-day',
//			     precipIntensity: 0.0005,
//			     precipProbability: 0.02,
//			     precipType: 'snow',
//			     temperature: 5.1,
//			     apparentTemperature: -11.66,
//			     dewPoint: 0.16,
//			     humidity: 0.79,
//			     pressure: 1025.87,
//			     windSpeed: 12.95,
//			     windGust: 26.7,
//			     windBearing: 33,
//			     cloudCover: 0.62,
//			     uvIndex: 0,
//			     visibility: 6.22,
//			     ozone: 447.12 },
//			console.log(Object.keys(json_object));
			
			
	  });

	}).on('error', (e) => {
		callback();
		console.error(e);
		});
}