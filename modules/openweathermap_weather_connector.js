const http = require('http');

exports.getWeatherForCity = getWeatherForCity;

const url = "api.openweathermap.org";
const key = "470e62edf808f8188b24d196a7662b9e";


function getWeatherForCity(city, callback) {
	if (city.status === "unknown") {
		callback();
		return;
	}
	const api_url = `http://${url}/data/2.5/forecast?APPID=${key}&lat=${city.latitude}&lon=${city.longitude}`;
	http.get(api_url, (res) => {
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
			const property_name = 'list';
			if (json_object.hasOwnProperty(property_name)) {
				const info = json_object[property_name];
				const return_object = {};
				
				function k_to_c(k) {
					return k - 272.15;
				}
				
				if (info.length > 0) {
					console.log();
					return_object['temperature_max'] = k_to_c(info[0].main.temp_max);
					return_object['temperature_min'] = k_to_c(info[0].main.temp_min);
				}
				
//				console.log(Object.keys(info[0]));
//				console.log(info[0]);
				callback(return_object);
			}
			else {
				callback();
			}
			
//			[ 'cod', 'message', 'cnt', 'list', 'city' ]
//			[ 'dt', 'main', 'weather', 'clouds', 'wind', 'snow', 'sys', 'dt_txt' ]
//		{ dt: 1519462800,
//		  main: 
//		   { temp: 260.75,
//		     temp_min: 259.103,
//		     temp_max: 260.75,
//		     pressure: 1008.9,
//		     sea_level: 1040.8,
//		     grnd_level: 1008.9,
//		     humidity: 86,
//		     temp_kf: 1.64 },
//		  weather: 
//		   [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' } ],
//		  clouds: { all: 20 },
//		  wind: { speed: 6.67, deg: 35.5007 },
//		  snow: { '3h': 0.0175 },
//		  sys: { pod: 'd' },
//		  dt_txt: '2018-02-24 09:00:00' }
			
//			console.log(Object.keys(json_object));
			
			
	  });

	}).on('error', (e) => {
		callback();
		console.error(e);
		});
	
}