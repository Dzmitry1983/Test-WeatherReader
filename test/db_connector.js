var assert = require('assert');
const model_for_check = require('../modules/db_connector.js');
const city_info = require('../models/city_info.js');

describe('db_connector', function() {
  describe('#check functions', function() {
	  describe('#module functions exist', function() {
		  const functions_names = [
			  	'isUserIdExist',
				'getNewUserId',
				'removeUserById',
				'removeAllUsers',
				'getCountUsers',
				'isCityNameExist',
				'addCityByName',
				'getCityByName',
				'removeCityByName',
				'removeAllCities',
				'updateCity',
				'getCountCities',
				'getCitiesForUserId',
				'saveCitiesForUserId',
				];
		  functions_names.forEach(function(function_name) {
				it(`function ${function_name} exists`, function(){
				      assert.equal(true, model_for_check.hasOwnProperty(function_name));
				      assert.equal("function", typeof model_for_check[function_name]);
				    });
			});
	  });
	  describe('#module functions work', function() {
		  const city_name_1 = 'Minsk';
		  const city_name_2 = 'Moscow';
		  
		  it(`function isUserIdExist works`, function() {
			  let user_id = 0;
			  assert.equal(false, model_for_check.isUserIdExist(user_id));
			  user_id = model_for_check.getNewUserId();
			  assert.ok(model_for_check.isUserIdExist(user_id));
			  model_for_check.removeUserById();
			  assert.equal(false, model_for_check.isUserIdExist(user_id));
		    });
		  
		  it(`function getNewUserId works`, function() {
			  let count_users = model_for_check.getCountUsers();
			  let user_id_1 = model_for_check.getNewUserId();
			  count_users ++;
			  assert.equal(count_users, model_for_check.getCountUsers());
			  let user_id_2 = model_for_check.getNewUserId();
			  count_users ++;
			  assert.equal(count_users, model_for_check.getCountUsers());
		      assert.notEqual(0, user_id);
		    });
		  
		  it(`function removeUserById works`, function() {
			  let user_id_1 = model_for_check.getNewUserId();
			  let user_id_2 = model_for_check.getNewUserId();
			  let count_users = model_for_check.getCountUsers();
			  model_for_check.removeUserById(user_id_1);
			  count_users --;
			  assert.equal(count_users, model_for_check.getCountUsers());
			  model_for_check.removeUserById(user_id_1);
			  assert.equal(count_users, model_for_check.getCountUsers());
			  model_for_check.removeUserById(user_id_2);
			  count_users --;
			  assert.equal(count_users, model_for_check.getCountUsers());
		    });
		  
		  it(`function removeAllUsers works`, function() {
			  model_for_check.getNewUserId();
			  model_for_check.getNewUserId();
			  model_for_check.getNewUserId();
		      assert.notEqual(0, model_for_check.getCountUsers());
		      model_for_check.removeAllUsers();
		      assert.equal(0, model_for_check.getCountUsers());
		    });
		  
		  it(`function getCountUsers works`, function() {
			  let count_users = model_for_check.getCountUsers();
			  let user_id_1 = model_for_check.getNewUserId();
			  count_users ++;
			  assert.equal(count_users, model_for_check.getCountUsers());
			  model_for_check.removeAllUsers();
			  assert.equal(0, model_for_check.getCountUsers());
		    });
		  
		  it(`function isCityNameExist works`, function() {
			  model_for_check.removeAllCities();
			  assert.equal(false, model_for_check.isCityNameExist(city_name_1));
			  model_for_check.addCityByName(city);
			  assert.ok(model_for_check.isCityNameExist(city.name));
		    });
		  
		  it(`function addCityByName works`, function() {
			  model_for_check.removeAllCities();
			  assert.equal(0, model_for_check.getCountCities());
			  model_for_check.addCityByName(city_name_1);
			  assert.equal(1, model_for_check.getCountCities());
			  model_for_check.addCityByName(city_name_1);
			  assert.equal(1, model_for_check.getCountCities());
		    });
		  
		  it(`function getCityByName works`, function() {
			  const name = 'Minsk';
			  model_for_check.removeAllCities();
			  assert.equal('undefined', model_for_check.getCityByName(name));
			  model_for_check.addCityByName(name);
			  assert.equal(name, model_for_check.getCityByName(name).name);
		    });

		  it(`function removeCityByName works`, function() {
			  model_for_check.removeAllCities();
			  assert.equal(0, model_for_check.getCountCities());
			  model_for_check.addCityByName(city_name_1);
			  model_for_check.addCityByName(city_name_2);
			  assert.equal(2, model_for_check.getCountCities());
			  model_for_check.removeCityByName(city_name_1);
			  assert.equal(1, model_for_check.getCountCities());
			  
			  assert.equal(false, model_for_check.isCityNameExist(city_name_1));
			  model_for_check.removeCityByName(city_name_1);
			  assert.equal(1, model_for_check.getCountCities());
			  
			  assert.ok(model_for_check.isCityNameExist(city_name_2));
			  model_for_check.removeCityByName(city_name_2);
			  assert.equal(1, model_for_check.getCountCities());
		    });
		  
		  it(`function removeAllCities works`, function() {
			  model_for_check.removeAllCities();
			  model_for_check.addCityByName(city_name_1);
			  model_for_check.addCityByName(city_name_2);
			  assert.equal(2, model_for_check.getCountCities());
			  model_for_check.removeAllCities();
			  assert.equal(0, model_for_check.getCountCities());
		    });
		  
		  it(`function updateCity works`, function() {
			  model_for_check.addCityByName(city_name_1);
		      const city = model_for_check.getCityByName(city_name_1);
		      const t_min = city.temperature_min;
		      city.temperature_min = 29;
		      model_for_check.updateCity(city);
		      
		      assert.notEqual(t_min, model_for_check.getCityByName(city_name_1).temperature_min);
		    });
		  
		  it(`function getCountCities works`, function() {
			  
			  model_for_check.removeAllCities();
			  model_for_check.addCityByName(city_name_1);
			  model_for_check.addCityByName(city_name_2);
			  assert.equal(2, model_for_check.getCountCities());
			  model_for_check.removeAllCities();
			  assert.equal(0, model_for_check.getCountCities());
		    });
		  
		  describe('#functions save/load cities for user', function() {
			  let user_id = model_for_check.getNewUserId();
			  let cities = []; 
			  
			  it(`saveCitiesForUserId/getCitiesForUserId`, function() {
				  cities = model_for_check.getCitiesForUserId(user_id);
				  assert.equal(0, cities.length);
				  model_for_check.addCityByName(city_name_1);
				  model_for_check.addCityByName(city_name_2);
				  cities.push(model_for_check.getCityByName(city_name_1));
				  cities.push(model_for_check.getCityByName(city_name_2));
				  model_for_check.saveCitiesForUserId(user_id, cities);
				  assert.equal(2, model_for_check.getCitiesForUserId(user_id).length);
			    }); 
		  });
	  });
  });
});