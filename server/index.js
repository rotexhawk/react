var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {
	var json = [
        {
            name:'David', 
            age: 30, 
            bio: 'enjoys swimming and biking',
            hobbies: ['swimming','biking'], 
        },
        {
            name:'Sara', 
            age:40, 
            bio: 'enjoys long walks on the beach',
            hobbies: ['gardening', 'games']
        }
        ];
  res.send(json);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});