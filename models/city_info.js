module.exports = city_info;

function city_info () {
	this.name = "";
	this.id = "";
	this.status = "need update"; //need update, updating, updated, unfounded 
	this.date_last_update = -1;
	this.temperature_min = 0;
	this.temperature_max = 0;
	this.precipitation_min = 0;
	this.precipitation_max = 0;
	this.precipitation_type = "";
}