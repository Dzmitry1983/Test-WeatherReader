var mysql = require('mysql');
const user_info = require('../models/user_info.js');
const cities_informer = require('../modules/cities_informer.js');

const database_name = "WeatherReader";
const table_name_users = "users";
const table_name_cities = "cities";
const table_name_users_cities = "users_cities";

const db_host = "localhost";
const db_user = "user";
const db_password = "user_pass";

exports.initialize = initialize;

exports.isMysqlConnected = isMysqlConnected;

exports.isDatabaseExist = isDatabaseExist;
exports.createDatabase = createDatabase;
exports.deleteDatabase = deleteDatabase;

exports.isTableUsersExist = isTableUsersExist;
exports.createTableUsers = createTableUsers;
exports.deleteTableUsers = deleteTableUsers;

exports.isTableCitiesExist = isTableCitiesExist;
exports.createTableCities = createTableCities;
exports.deleteTableCities = deleteTableCities;

exports.isTableUsersCitiesExist = isTableUsersCitiesExist;
exports.createTableUsersCities = createTableUsersCities;
exports.deleteTableUsersCities = deleteTableUsersCities;

exports.isUserIdExist = isUserIdExist;
exports.getNewUserId = getNewUserId;
exports.removeUserById = removeUserById;
exports.loadUserByUserId = loadUserByUserId;

exports.removeAllUsers = removeAllUsers;
exports.getCountUsers = getCountUsers;
exports.isCityNameExist = isCityNameExist;
exports.addCityByName = addCityByName;
exports.getCityByName = getCityByName;
exports.removeCityByName = removeCityByName;
exports.removeAllCities = removeAllCities;
exports.updateCity = updateCity;
exports.getCountCities = getCountCities;
exports.getCitiesForUserId = getCitiesForUserId;
exports.saveCitiesForUserId = saveCitiesForUserId;


function databaseConnector () {

	const preferences_db = {
			host: db_host,
			user: db_user,
			password: db_password
	}

	const preferences = {
			host: db_host,
			user: db_user,
			password: db_password,
			multipleStatements: true,
			database: database_name
	}

	//callback is waiting for (error)
	this.connectionMySql = function (callback) {	
		const connection = mysql.createConnection(preferences_db);
		connection.connect(function(error) {
			if (error) {
				console.log(error);
				callback(error);
			}
			else {
				connection.end((error) => {
					callback(error);
				});    
			}
		});
	}
	this.executeRequestForPreferences = function(preferences, sql_request, callback) {
		const isError = function (error) {
			const keys_to_show = [
				'code', 
				'errno', 
				'sqlMessage',
				'sqlState',
				'index', 
				'sql'
				];
			keys_to_show.forEach((key) => {
				console.log(key + ":" + error[key]);
			});
			callback(error);
		}
		const connection = mysql.createConnection(preferences);

		connection.connect(function(err) {
			if (err) {
				isError(err);
			}
			else {
				connection.query(sql_request, function(err, rows, fields) {
					if (err) {
						isError(err);
					}
					else {
						connection.end(function(err){
							if (err) {
								isError(err);
							}
							else {
								callback(err, rows, fields);
							}
						});  
					} 
				});  
			}
		});
	};

	//callback is waiting for (error, rows, fields)
	this.executeRequest = (sql_request, callback) => {
		return this.executeRequestForPreferences(preferences, sql_request, callback);
	};

	//callback is waiting for (error, is exist) 
	this.isTableExist = (table_name, callback) => {
		const sql_request = `show tables like '${table_name}';`;
		this.executeRequest(sql_request, (error, rows, fields) => {
			callback(error, rows.length > 0);
		});
	};

	//callback is waiting for (error, is exist) 
	this.isDatabaseExist = (database_name, callback) => {
		const sql_request = `show databases like '${database_name}';`;
		this.executeRequestForPreferences(preferences_db, sql_request, (error, rows, fields) => {
			callback(error, rows.length > 0);
		});
	};

	//callback is waiting for (error) 
	this.createDatabase = (database_name, callback) => {
		const sql_request = `create database ${database_name};`;
		this.executeRequestForPreferences(preferences_db, sql_request, (error, rows, fields) => {
			callback(error);
		});
	};

	//callback is waiting for (error) 
	this.deleteDatabase = (database_name, callback) => {
		const sql_request = `drop database ${database_name};`;
		this.executeRequestForPreferences(preferences_db, sql_request, (error, rows, fields) => {
			callback(error);
		});
	};
}

const database_connector = new databaseConnector();

/*
 * show databases;
 * show tables;
 * create database WeatherReader;
 * use WeatherReader;
 * CREATE TABLE users (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT);
 * CREATE TABLE cities (name VARCHAR(100) PRIMARY KEY, status VARCHAR(20), date_last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, temperature_min INT DEFAULT 0, temperature_max INT DEFAULT 0, precipitation_min INT DEFAULT 0, precipitation_max INT DEFAULT 0, precipitation_type VARCHAR(100));
 * CREATE TABLE users_cities (user_id INT, name VARCHAR(100), PRIMARY KEY(user_id, name), FOREIGN KEY(user_id) REFERENCES users(id) on delete cascade, FOREIGN KEY (name) REFERENCES cities(name) on delete cascade); 
 * 
 * describe users;
 * describe cities;
 * describe users_cities;
 *  
 *  insert into users values(default); select LAST_INSERT_ID();
 *  delete from users where id=1;
 *  
 *  //select LAST_INSERT_ID();
 */


//check database
function isMysqlConnected() {
	return new Promise(resolve => {
		database_connector.connectionMySql((error) => {
			resolve(!error);
		});
	});
}

function isDatabaseExist() {
	return new Promise(resolve => {
		database_connector.isDatabaseExist(database_name, (error, is_exist) => {
			resolve(is_exist);
		});
	});
}

function createDatabase() {
	return new Promise(resolve => {
		database_connector.createDatabase(database_name, (error) => {
			resolve();
		});
	});
}

function deleteDatabase() {
	return new Promise(resolve => {
		database_connector.deleteDatabase(database_name, (error) => {
			resolve();
		});
	});
}

function createTableUsers() {
	const sql_request = `CREATE TABLE ${table_name_users} (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT);`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function createTableCities() {
	const sql_request = `CREATE TABLE ${table_name_cities} (name VARCHAR(100) PRIMARY KEY, status VARCHAR(20), date_last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, temperature_min INT DEFAULT 0, temperature_max INT DEFAULT 0, precipitation_min INT DEFAULT 0, precipitation_max INT DEFAULT 0, precipitation_type VARCHAR(100));`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function createTableUsersCities() {
	const sql_request = `CREATE TABLE ${table_name_users_cities} (user_id INT, name VARCHAR(100), PRIMARY KEY (user_id, name), FOREIGN KEY (user_id) REFERENCES ${table_name_users} (id) on delete cascade, FOREIGN KEY (name) REFERENCES ${table_name_cities} (name) ON DELETE CASCADE ON UPDATE CASCADE);`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function isTableUsersExist() {
	return new Promise(resolve => {
		database_connector.isTableExist(table_name_users, (error, is_exist) => {
			resolve(is_exist);
		});
	});
}

function isTableCitiesExist() {
	return new Promise(resolve => {
		database_connector.isTableExist(table_name_cities, (error, is_exist) => {
			resolve(is_exist);
		});
	});
}

function isTableUsersCitiesExist() {
	return new Promise(resolve => {
		database_connector.isTableExist(table_name_users_cities, (error, is_exist) => {
			resolve(is_exist);
		});
	});
}

function deleteTableUsers() {
	const sql_request = `DROP TABLE ${table_name_users};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function deleteTableCities() {
	const sql_request = `DROP TABLE ${table_name_cities};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function deleteTableUsersCities() {
	const sql_request = `DROP TABLE ${table_name_users_cities};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

/*
 * get userId form database, if userId doesn't exist, make new userId
 */
//callback (error, is exist)
function isUserIdExist(user_id) {
	const sql_request = `select id from ${table_name_users} where id=${user_id};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve(0);
			}
			else {
				resolve(rows.length > 0);
			}
		});
	});
}

//callback (error, new user id)
function getNewUserId() {
	const sql_request = `insert into ${table_name_users} values(default);`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve(0);
			}
			else {
				resolve(rows.insertId);
			}
		});
	});
}

function removeUserById(user_id) {
	const sql_request = `delete from ${table_name_users} where id=${user_id};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve(0);
		});
	});
}

function removeAllUsers() {
	const sql_request = `DELETE FROM ${table_name_users};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve(0);
		});
	});
}

function getCountUsers() {
	const key_name = 'count(*)';
	const sql_request = `select ${key_name} from ${table_name_users};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve(0);
			}
			else {
				const number = rows[0][key_name];
				resolve(number);
			}
		});
	});
}

function isCityNameExist(city_name) {
	const sql_request = `select name from ${table_name_cities} where name='${city_name}';`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve(false);
			}
			else {
				resolve(rows.length > 0);
			}
		});
	});
}

function addCityByName(city_name) {
	const sql_request = `insert ignore into ${table_name_cities} (name) values('${city_name}');`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function getCityByName(city_name) {
	const key_name = '*';
	const sql_request = `select ${key_name} from ${table_name_cities} where name='${city_name}';`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve();
			}
			else {
				const city_db = rows[0];
				const city = cities_informer.getCityInfoByName(city_name);
				Object.keys(city_db).forEach(function(key) {
					if (key != "status" || city_db[key] != null) {
						city[key] = city_db[key];
					}
				});
				resolve(city);
			}
		});
	});
}

function removeCityByName(city_name) {
	const sql_request = `delete from ${table_name_cities} where name='${city_name}';`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve(0);
		});
	});
}

function removeAllCities() {
	const sql_request = `DELETE FROM ${table_name_cities};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

function updateCity(city) {
	let array = [];
	const keys = [
		'status',
//		'date_last_update', 
		'temperature_min',
		'temperature_max',
		'precipitation_min',
		'precipitation_max',
		'precipitation_type'
		];

	keys.forEach(function(key) {
		array.push(key + "=" + "'" + city[key] + "'");
	});


	const new_values = array.join(", ");
	const sql_request = `UPDATE ${table_name_cities} SET ${new_values} WHERE name='${city.name}';`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve();
			}
			else {
				resolve();
			}
		});
	});

}

function getCountCities() {
	const key_name = 'count(*)';
	const sql_request = `select ${key_name} from ${table_name_cities};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve(0);
			}
			else {
				const number = rows[0][key_name];
				resolve(number);
			}
		});
	});
}

function getCitiesForUserId(user_id) {
	const sql_request = `SELECT ${table_name_cities}.* FROM ${table_name_users_cities} INNER JOIN ${table_name_cities} on ${table_name_cities}.name = ${table_name_users_cities}.name LEFT JOIN ${table_name_users} on ${table_name_users_cities}.user_id = ${table_name_users}.id WHERE ${table_name_users}.id = ${user_id};`;
	return new Promise(resolve => {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			if (error) {
				resolve();
			}
			else {
				let cities = [];
				rows.forEach((city_db) => {
					const city = cities_informer.getCityInfoByName(city_db.name);
					Object.keys(city_db).forEach(function(key) {
						if (key != "status" || city_db[key] != null) {
							city[key] = city_db[key];
						}
					});
					cities.push(city);
				});
				resolve(cities);
			}
		});
	});
}

function saveCitiesForUserId(user_id, cities) {
	let promises_save = [];
	cities.forEach(function(city) {
		promises_save.push(saveCityForUserId(user_id, city.name));
	});
	return Promise.all(promises_save);
}

function saveCityForUserId(user_id, city_name) {
	const sql_request = `START TRANSACTION; insert ignore into ${table_name_cities} (name) values('${city_name}'); REPLACE into ${table_name_users_cities} (user_id, name) values (${user_id}, '${city_name}'); COMMIT;`;
	return new Promise(function (resolve) {
		database_connector.executeRequest(sql_request, (error, rows, fields) => {
			resolve();
		});
	});
}

//async functions

async function loadUserByUserId(user_id) {
	const user = new user_info();
	user.id = user_id;
	const user_id_exist = await isUserIdExist(user_id);
	if (!user_id_exist) {
		user.id = await getNewUserId();
	}
	user.cities = await getCitiesForUserId(user.id);
	return user;
}

async function initialize() {
	if (await isMysqlConnected()) {
		if (await isDatabaseExist() === false) {
			await createDatabase();
		}
		if (await isDatabaseExist()) {
			if (await isTableUsersExist() === false) {
				await createTableUsers();
			}
			if (await isTableCitiesExist() === false) {
				await createTableCities();
			}
			if (await isTableUsersCitiesExist() === false) {
				await createTableUsersCities();
			}
		}
	}
}