const fs = require('fs');
const city_info = require('../models/city_info.js');
//file with information about cities
const csv_file = './resources/csv/simplemaps-worldcities-basic.csv';

exports.getCityInfoByName = getCityInfoByName;

let contents = null;
let keys = [];

//[ 'city',
//	  'city_ascii',
//	  'lat',
//	  'lng',
//	  'pop',
//	  'country',
//	  'iso2',
//	  'iso3',
//	  'province' ]

//simplemaps-worldcities-basic.csv
/*
 * Get main information about city by city name 
 */
function getCityInfoByName(city_name) {
	if (contents == null) {
		contents = {};
		const text = fs.readFileSync(csv_file, "utf-8");
		const array = text.split("\r\n");
//		const length = array.length;
		for (let i = 0;  i < array.length; i++) {
			const line = array[i].split(",");
			if (i == 0) {
				keys = line;
			}
			else {
				const object = new Object();
				for (let j = 0;  j < keys.length; j++) {
					object[keys[j]] = line[j];
				}
				if (line.length > 0) {
					contents[line[0]] = object;
				}
			}
		}
	}
	city_inform = contents[city_name];
	const city = new city_info();
	if (city_inform) {
		city.name = city_name;
		city.latitude = city_inform.lat;
		city.longitude = city_inform.lng;
		city.country = city_inform.country;
		city.province = city_inform.province;
		city.status = "need update";
	}
	return city;
}
