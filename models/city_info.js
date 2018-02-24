module.exports = city_info;

function city_info () {
	this.name = "";
	this.status = "unknown"; //need update, updating, updated, unknown 
	this.date_last_update = -1;
	this.temperature_min = 0;
	this.temperature_max = 0;
	this.precipitation_min = 0;
	this.precipitation_max = 0;
	this.precipitation_type = "";
	
	this.latitude = 0;
	this.longitude = 0;
	this.country = "";
	this.province = "";
}