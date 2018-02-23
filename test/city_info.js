var assert = require('assert');
const model_for_check = require('../models/city_info.js');

describe('city_info', function() {
	
  describe('#check properties exist', function() {
	const properties_names = [
		'name', 
		'status',
		'date_last_update', 
		'temperature_min',
		'temperature_max',
		'precipitation_min',
		'precipitation_max',
		'precipitation_type'];
	const model = new model_for_check();
	
	it(`should return true when the properties count (${properties_names.length}) is same with checking array (${Object.keys(model).length})`, function(){
	      assert.equal(properties_names.length, Object.keys(model).length);
	    });
	
	
	
	properties_names.forEach(function(property_name) {
		it(`should return true when the ${property_name} exists`, function(){
		      assert.equal(true, model.hasOwnProperty(property_name));
		    });
	});
  });
});
