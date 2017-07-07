var express = require('express');

var app = express();

app.get("/", function(req, res) {
	res.send("Hello from server2");
});

app.listen(3002);

console.log("Server started");