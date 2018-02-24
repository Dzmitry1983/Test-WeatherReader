var assert = require('assert');
const model_for_check = require('../modules/openweathermap_weather_connector.js');
const cities_informer = require('../modules/cities_informer.js');

const city_name_1 = 'Minsk';
const city_name_2 = 'Moscow';
const city_name_3 = 'unreal city xxx';

describe('openweathermap_weather_connector', function() {
	
	describe('#check functions', function() {
		let all_functions_exist = true;
		describe('#functions exist', function() {
			const functions_names = [
				'getWeatherForCity',
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
		describe('#functions work', () => {
			before(function () {
				if (!all_functions_exist) this.skip();
			});
			
			
			it(`getWeatherForCity`, function (done) {
				const city = cities_informer.getCityInfoByName(city_name_1);
				model_for_check.getWeatherForCity(city, (data) => {
					done();
				});
			});
			
		});
  });
});
