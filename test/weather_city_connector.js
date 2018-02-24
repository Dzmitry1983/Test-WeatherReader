var assert = require('assert');
const model_for_check = require('../modules/weather_city_connector.js');
//const city_info = require('../models/city_info.js');





describe('weather_city_connector', function() {
  describe('#check functions', function() {
	  describe('#module functions exist', function() {
		  const functions_names = [
//			  	'updateInfrormationForCity',
//			  	'updateInfrormationForCities',
//			  	'checkServerConnections'
				];
		  functions_names.forEach(function(function_name) {
				it(`function ${function_name} exists`, function(){
				      assert.equal(true, model_for_check.hasOwnProperty(function_name));
				      assert.equal("function", typeof model_for_check[function_name]);
				    });
			});
	  });
	  describe('#module functions work', function() {

	  });
  });
});