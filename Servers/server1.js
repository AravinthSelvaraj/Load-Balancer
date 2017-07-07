var express = require('express');

var app = express();

app.get("/", function(req, res) {
	res.send("Hello from server1");
});

app.listen(3001);

console.log("Server started");