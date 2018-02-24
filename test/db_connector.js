const assert = require('assert');
const domain = require('domain');
const model_for_check = require('../modules/db_connector.js');
const city_info = require('../models/city_info.js');

const city_name_1 = 'Minsk';
const city_name_2 = 'Moscow';
const city_name_3 = 'New York';

//exports.initialize = initialize;
describe('db_connector', function() {
	describe('#check functions', function() {
		let all_functions_exist = true;
		describe('#functions exist', function() {
			const functions_names = [
				'initialize',
				'isMysqlConnected',
				
			  	'isDatabaseExist',
			  	'createDatabase',
			  	'deleteDatabase',
			  	
			  	'isTableUsersExist',
			  	'createTableUsers',
			  	'deleteTableUsers',
			  	
			  	'isTableCitiesExist',
			  	'createTableCities',
			  	'deleteTableCities',
			  	
			  	'isTableUsersCitiesExist',
			  	'createTableUsersCities',
			  	'deleteTableUsersCities',
			
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
				'loadUserByUserId',
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
		
		describe('#mysql works', () => {
			
			let is_mysql_connected = false;
			
			before(function () {
				if (!all_functions_exist) this.skip();
			});
			
			it(`isMysqlConnected`, async function () {
				is_mysql_connected = await model_for_check.isMysqlConnected();
				assert.ok(is_mysql_connected, "connect doesn't exist");
			});
			
			describe('#database',  () => {
				let is_database_exist = false;
				before(function () {
					if (!is_mysql_connected) this.skip();
				});
				
				it(`initialize`, async function () {
					await model_for_check.deleteDatabase();
					await model_for_check.initialize();
					assert.ok(await model_for_check.isDatabaseExist(), "database wasn't created");
					assert.ok(await model_for_check.isTableUsersExist(), "table users wasn't created");
					assert.ok(await model_for_check.isTableCitiesExist(), "table cities wasn't created");
					assert.ok(await model_for_check.isTableUsersCitiesExist(), "table users_cities wasn't created");
				});
				
				it(`delete/create database`, async function () {
					if (await model_for_check.isDatabaseExist() === false) {
						await model_for_check.createDatabase();
						is_database_exist = await model_for_check.isDatabaseExist();
						assert.ok(is_database_exist, "database wasn't created");
					}
					await model_for_check.deleteDatabase();
					assert.ok(!await model_for_check.isDatabaseExist(), "database wasn't deleted");
					await model_for_check.createDatabase();
					is_database_exist = await model_for_check.isDatabaseExist();
					assert.ok(is_database_exist, "database wasn't created");
				});
				
				describe('#tables', () => {
					let is_table_users_exist = false;
					let is_table_cities_exist = false;
					let is_table_users_cities_exist = false;
					
					before(function () {
						if (!is_database_exist) this.skip();
					});
					

				  					
//					'isTableUsersExist',
//				  	'createTableUsers',
//				  	'deleteTableUsers',
					it(`delete/create table users`, async function () {
						if (await model_for_check.isTableUsersExist() === false) {
							await model_for_check.createTableUsers();
							is_table_users_exist = await model_for_check.isTableUsersExist();
							assert.ok(is_table_users_exist, "talbe users wasn't created");
						}
						await model_for_check.deleteTableUsers();
						assert.ok(!await model_for_check.isTableUsersExist(), "talbe users wasn't deleted");
						await model_for_check.createTableUsers();
						is_table_users_exist = await model_for_check.isTableUsersExist();
						assert.ok(is_table_users_exist, "talbe users wasn't created");
					});
					
//				  	'isTableCitiesExist',
//				  	'createTableCities',
//				  	'deleteTableCities',
					it(`delete/create table cities`, async function () {
						if (await model_for_check.isTableCitiesExist() === false) {
							await model_for_check.createTableCities();
							is_table_cities_exist = await model_for_check.isTableCitiesExist();
							assert.ok(is_table_cities_exist, "talbe cities wasn't created");
						}
						await model_for_check.deleteTableCities();
						assert.ok(!await model_for_check.isTableCitiesExist(), "talbe cities wasn't deleted");
						await model_for_check.createTableCities();
						is_table_cities_exist = await model_for_check.isTableCitiesExist();
						assert.ok(is_table_cities_exist, "talbe cities wasn't created");
					});
					
//				  	'isTableUsersCitiesExist',
//				  	'createTableUsersCities',
//				  	'deleteTableUsersCities',
					it(`delete/create table users_cities`, async function () {
						if (await model_for_check.isTableUsersCitiesExist() === false) {
							await model_for_check.createTableUsersCities();
							is_table_users_cities_exist = await model_for_check.isTableUsersCitiesExist();
							assert.ok(is_table_users_cities_exist, "talbe users_cities wasn't created");
						}
						await model_for_check.deleteTableUsersCities();
						assert.ok(!await model_for_check.isTableUsersCitiesExist(), "talbe users_cities wasn't deleted");
						await model_for_check.createTableUsersCities();
						is_table_users_cities_exist = await model_for_check.isTableUsersCitiesExist();
						assert.ok(is_table_users_cities_exist, "talbe users_cities wasn't created");
					});

					describe('#table users functions work', () => {
						
						let users_id = [0];
						let count_users = 0;
						
						before(function () {
							if (!is_table_users_exist) this.skip();
						});
						
						it(`getNewUserId`, async function () {
							let new_user_id = await model_for_check.getNewUserId(); 
							assert.ok(!users_id.includes(new_user_id));
							users_id.push(new_user_id)
							new_user_id = await model_for_check.getNewUserId();
							assert.ok(!users_id.includes(new_user_id));
							users_id.push(new_user_id)
						});
						
						it(`isUserIdExist`, async function () {
							if (users_id.length == 0) this.skip();
							users_id.forEach(async (user_id) => {
								const result = await model_for_check.isUserIdExist(user_id);
								assert.equal(result, user_id != 0);
							});
						});
						
						it(`getCountUsers`, async function () {
							if (users_id.length == 0) this.skip();
							count_users = await model_for_check.getCountUsers();
							await model_for_check.getNewUserId();
							count_users ++;
							assert.equal(count_users, await model_for_check.getCountUsers());
						});
						
						it(`removeUserById`, async function () {
							if (count_users == 0) this.skip();
							let new_user_id = await model_for_check.getNewUserId(); 
							count_users = await model_for_check.getCountUsers();
							assert.ok(count_users > 0);
							assert.notEqual(0, new_user_id);
							await model_for_check.removeUserById(new_user_id);
							count_users--;
							assert.equal(false, await model_for_check.isUserIdExist(new_user_id));
							assert.equal(count_users, await model_for_check.getCountUsers());
							await model_for_check.removeUserById(0);
							assert.equal(count_users, await model_for_check.getCountUsers());
						});
						
						it(`loadUserByUserId`, async function () {
							let id = 0;
							let model = await model_for_check.loadUserByUserId(id);
							assert.notEqual(id, model.id, "new user wasn't created");
							id = model.id;
							model = await model_for_check.loadUserByUserId(id);
							assert.equal(id, model.id, `new user was created (${id}, ${model.id}), but needed to be loaded old user`);
						});
						
						it(`removeAllUsers`, async function () {
							await model_for_check.getNewUserId();
							count_users = await model_for_check.getCountUsers();
							assert.ok(count_users > 0);
							await model_for_check.removeAllUsers();
							assert.equal(0, await model_for_check.getCountUsers());
							count_users = 0;
						});
					});
					
					describe('#table cities functions work', () => {
						before(function () {
							if (!is_table_cities_exist) this.skip();
						});
						
						it(`addCityByName`, async function () {
							await model_for_check.addCityByName(city_name_1);
							let count = await model_for_check.getCountCities();
							assert.ok(await model_for_check.isCityNameExist(city_name_1));
							await model_for_check.addCityByName(city_name_1);
							assert.equal(count, await model_for_check.getCountCities());
						});
						
						it(`removeAllCities`, async function () {
							await model_for_check.addCityByName(city_name_1);
							assert.notEqual(0, await model_for_check.getCountCities());
							await model_for_check.removeAllCities();
							assert.equal(0, await model_for_check.getCountCities());
						});
						
						it(`isCityNameExist`, async function () {
							await model_for_check.removeAllCities();
							assert.equal(false, await model_for_check.isCityNameExist(city_name_1));
							await model_for_check.addCityByName(city_name_1);
							assert.ok(await model_for_check.isCityNameExist(city_name_1));
						});
						
						it(`getCountCities/removeCityByName`, async function () {
							await model_for_check.removeAllCities();
							await model_for_check.addCityByName(city_name_1);
							assert.equal(1, await model_for_check.getCountCities());
							await model_for_check.addCityByName(city_name_2);
							assert.equal(2, await model_for_check.getCountCities());
							await model_for_check.removeCityByName(city_name_1);
							assert.equal(1, await model_for_check.getCountCities());
							await model_for_check.removeCityByName(city_name_2);
							assert.equal(0, await model_for_check.getCountCities());
						});
						
						
						it(`getCityByName/updateCity`, async function () {
							await model_for_check.addCityByName(city_name_1);
							let city = await model_for_check.getCityByName(city_name_1);
							assert.equal(city_name_1, city.name);
							let random = Math.floor((Math.random() * 100) + 1);
							city.temperature_min = random;
							await model_for_check.updateCity(city);
							await model_for_check.addCityByName(city_name_1);
							city = await model_for_check.getCityByName(city_name_1);
							assert.equal(random, city.temperature_min);
						});
						
					});
					
					describe('#table users_cities functions work', () => {
						before(function () {
							if (!is_table_users_cities_exist) this.skip();
							if (!is_table_cities_exist) this.skip();
							if (!is_table_users_exist) this.skip();
						});
						
						it(`getCitiesForUserId`, async function () {
							let cities = [];
							let user_id = await model_for_check.getNewUserId();
							assert.notEqual(0, user_id, "user id can't be 0");
							cities = await model_for_check.getCitiesForUserId(user_id);
							assert.ok(cities, "cities didn't find");
						}); 
						
						it(`saveCitiesForUserId/getCitiesForUserId`, async function () {
							let cities = [];
							const city = new city_info();
							city.name = city_name_3;
							cities.push(city);
							await model_for_check.removeAllCities();
							assert.equal(0, await model_for_check.getCountCities(), 'Cities count must be 0');
							let user_id = await model_for_check.getNewUserId();
							assert.notEqual(0, user_id, "user id must be 0");
							await model_for_check.saveCitiesForUserId(user_id, cities);
							assert.equal(1, await model_for_check.getCountCities(), 'Cities count must be 1');
							const user_cities = await model_for_check.getCitiesForUserId(user_id); 
							assert.equal(cities.length, user_cities.length, `different count cities (${cities.length}, ${user_cities.length}) for user ${user_id}`);
						}); 
						
						it(`saveCitiesForUserId/getCitiesForUserId`, async function () {
							let cities = [];
							let user_id = await model_for_check.getNewUserId();
							assert.notEqual(0, user_id, "user id can't be 0");
							await model_for_check.saveCitiesForUserId(user_id, cities);
							cities = await model_for_check.getCitiesForUserId(user_id);
							assert.ok(cities, "cities didn't find");
							await model_for_check.addCityByName(city_name_1);
							await model_for_check.addCityByName(city_name_2);
							cities.push(await model_for_check.getCityByName(city_name_1));
							cities.push(await model_for_check.getCityByName(city_name_2));
							const city = new city_info();
							city.name = city_name_3;
							cities.push(city);
							assert.equal(3, cities.length, "cities count must be 3");
							await model_for_check.saveCitiesForUserId(user_id, cities);
							await model_for_check.saveCitiesForUserId(user_id, cities);
							const user_cities = await model_for_check.getCitiesForUserId(user_id); 
							assert.equal(cities.length, user_cities.length, `different count cities (${cities.length}, ${user_cities.length}) for user ${user_id}`);
						}); 
						
						it(`saveCitiesForUserId/getCitiesForUserId`, async function () {
							let cities = [];
							let user_id = await model_for_check.getNewUserId();
							assert.notEqual(0, user_id, "user id can't be 0");
							await model_for_check.saveCitiesForUserId(user_id, cities);
							cities = await model_for_check.getCitiesForUserId(user_id);
							assert.ok(cities, "cities didn't find");
							await model_for_check.addCityByName(city_name_1);
							await model_for_check.addCityByName(city_name_2);
							cities.push(await model_for_check.getCityByName(city_name_1));
							cities.push(await model_for_check.getCityByName(city_name_2));
							assert.equal(2, cities.length, "cities count must be 2");
							await model_for_check.saveCitiesForUserId(user_id, cities);
							await model_for_check.saveCitiesForUserId(user_id, cities);
							const user_cities = await model_for_check.getCitiesForUserId(user_id); 
							assert.equal(cities.length, user_cities.length, `different count cities (${cities.length}, ${user_cities.length}) for user ${user_id}`);
						}); 

					});					  
				});
			});
		});
	});
});