var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var httpProxy = require('http-proxy');

var app = express();
var proxy = httpProxy.createProxyServer();

var servers = ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"];
var weight = [1, 2, 3];
var temp = [0, 0, 0];
var users = [0, 0, 0];
var i = 0;

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
		req.session.server = i;
		users[i] = users[i] + 1;
		temp[i] = temp[i] + 1;
		console.log(users);
		proxy.web(req, res, { target: servers[i]});
		if(temp[i] == weight[i]){
			temp[i] = 0;
			i = (i + 1) % 3;
		}
	}
});

app.listen(3000);

console.log("Server started");
console.log(users);