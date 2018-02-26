# Test-WeatherReader
Node.js test task
Node.js is v8.9.4

This simple project shows how to use node.js for beginers.
Also you can find some tests for sync and async node.js parts.

WeatherReader gets information about weather for a city from darksky and openweater and shows it.
All keys are free and you can use them but if you want to use this project as commercial part, you need to get keys for weather services. You can read all information here:
https://darksky.net/dev/docs 
https://openweathermap.org/api

Used standard modules:
http
https
fs
url
assert
querystring

Used addition modules:
mysql - for connecting to database.
mocha - for testing.

To start tests:
npm test

If you want to run this code, you need to have a mysql server,
mysql preferences are here 'db_connector.js'
