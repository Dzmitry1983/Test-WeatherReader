const assert = require('assert');
const model_for_check = require('../modules/cities_informer.js');

const city_name_1 = 'Minsk';
const city_name_2 = 'Moscow';
const city_name_3 = "TestName and city doesn't exist";

//exports.initialize = initialize;
describe('cities_informer', function() {
	describe('#check functions', function() {
		let all_functions_exist = true;
		describe('#functions exist', function() {
			const functions_names = [
				'getCityInfoByName',
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
		
		describe('#cities_informer works', () => {
			before(function () {
//				this.skip();
			});
			
			it(`getCityInfoByName`, function () {
				const city1 = model_for_check.getCityInfoByName(city_name_1);
				const city2 = model_for_check.getCityInfoByName(city_name_2);
				const city3 = model_for_check.getCityInfoByName(city_name_3);
				assert.notEqual("unknown", city1.status, "city doesn't exist");
				assert.notEqual("unknown", city2.status, "city doesn't exist");
				assert.equal("unknown", city3.status, "city exist, but it's not real city");
				
			});
		});
	});
});