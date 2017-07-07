var express = require('express');

var app = express();

app.get("/", function(req, res) {
	res.send("Hello from server3");
});

app.listen(3003);

console.log("Server started");