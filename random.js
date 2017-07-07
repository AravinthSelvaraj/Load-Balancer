var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var httpProxy = require('http-proxy');

var app = express();
var proxy = httpProxy.createProxyServer();

var servers = ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"];
var users = [0, 0, 0];

app.use(cookieParser());
app.use(session({
	secret: "Shh, its a secret!",
	cookie: { maxAge: 5*60*1000 },
	rolling: true,
	store   : new MongoStore({
    db: 'sessionstore',
    url: 'mongodb://localhost/test-app'
  	}),
	resave: true,
	saveUninitialized: true
}));

app.all("*", function(req, res) {
	if(req.session.server) {
		proxy.web(req, res, { target: servers[req.session.server]});

	}
	else {
		var i = Math.floor((Math.random() * 3));
		req.session.server = i;
		users[i] = users[i] + 1;
		console.log(users);
		proxy.web(req, res, { target: servers[i]});
	}
});

app.listen(3000);

console.log("Server started");
console.log(users);