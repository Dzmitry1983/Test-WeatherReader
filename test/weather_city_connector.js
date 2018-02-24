var assert = require('assert');
const model_for_check = require('../modules/weather_city_connector.js');
const cities_informer = require('../modules/cities_informer.js');

const city_name_1 = 'Minsk';
const city_name_2 = 'Moscow';
const city_name_3 = 'unreal city xxx';

describe('weather_city_connector', function() {
  describe('#check functions', function() {
	  let all_functions_exist = true;
	  describe('#module functions exist', function() {
		  const functions_names = [
			  	'getWeatherForCity',
				];
		  functions_names.forEach(function(function_name) {
				it(`function ${function_name} exists`, function(){
				      assert.equal(true, model_for_check.hasOwnProperty(function_name));
				      assert.equal("function", typeof model_for_check[function_name]);
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
					console.log(data);
					done();
				});
			});
			
		});
  });
});