var assert = require('assert');
const city_info = require('../models/city_info.js');

describe('city_info', function() {
  describe('#check properties are exist', function() {
	const properties_names = [
		'name', 
		'id', 
		'date_last_update', 
		'temperature_min',
		'temperature_max',
		'precipitation_min',
		'precipitation_max',
		'precipitation_type'];
	const city = new city_info();
	
	it(`should return true when the properties count is same with checking array`, function(){
	      assert.equal(properties_names.length, Object.keys(city).length);
	    });
	
	
	
	properties_names.forEach(function(property_name) {
		it(`should return true when the ${property_name} is exist`, function(){
		      assert.equal(true, city.hasOwnProperty(property_name));
		    });
	});
  });
});
