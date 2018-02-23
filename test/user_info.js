var assert = require('assert');
const model_for_check = require('../models/user_info.js');

describe('user_info', function() {
	
  describe('#check properties exist', function() {
	const properties_names = [
		'id', 
		'cities',
		'jsonString',
		'addCityByName',
		'removeCityByName'
		];
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
  
  describe('#check functions', function() {
	  describe('#object functions', function() {
		  let model = new model_for_check();
		  const cityName1 = 'Minsk';
		  const cityName2 = 'Moscow';
		  const cityName3 = 'MinskMoscow';
		  
		  
		  it(`addCityByName`, function() {
			  assert.equal("function", typeof model.addCityByName);
			  assert.equal(0, model.cities.length);
		      //check if city is added
		      model.addCityByName(cityName1);
		      assert.equal(1, model.cities.length);
		      
		      model.addCityByName(cityName2);
		      assert.equal(2, model.cities.length);
		      
		    //check if duplicated cities aren't added
		      model.addCityByName(cityName1);
		      assert.equal(2, model.cities.length);
		  });
		  
		  it(`jsonString`, function() {
			  assert.equal("function", typeof model.jsonString);
		      const jsonString = model.jsonString();
		      assert.notEqual(0, jsonString.length);
		      let obj = JSON.parse(jsonString);
		      assert.equal(obj.user.id, model.id);
		      assert.equal(obj.user.cities.length, model.cities.length);
		  });
		  
		  it(`removeCityByName`, function() {
			  assert.equal("function", typeof model.removeCityByName);
			  model.removeCityByName(cityName3);
		      assert.equal(2, model.cities.length);
		      model.removeCityByName(cityName1);
		      assert.equal(1, model.cities.length);
		      model.removeCityByName(cityName1);
		      assert.equal(1, model.cities.length);
		      model.removeCityByName(cityName2);
		      assert.equal(0, model.cities.length);
		      model.removeCityByName(cityName2);
		      assert.equal(0, model.cities.length);
		  });
	  });
	  
  });
  
  
  
});