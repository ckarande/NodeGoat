//Load configurations
process.env.NODE_ENV = process.env.NODE_ENV || "development";


var express = require("express");
var app = express(); // Web framework to handle routing requests
var consolidate = require("consolidate"); // Templating library adapter for Express
var swig = require("swig");
var MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
var routes = require("./app/routes");
var config = require("./config/config"); // Routes for our application config


MongoClient.connect(config.db, function(err, db) {
    "use strict";
    if (err) throw err;

    // Register our templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", __dirname + "/app/views");
    app.use(express.static(__dirname + "/app/assets"));

    // Express middleware to populate "req.cookies" so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate "req.body" so we can access POST variables
    app.use(express.bodyParser());

    // Application routes
    routes(app, db);

    swig.init({
        root: __dirname + "/app/views",
        autoescape: false
    });

    if (process.env.IP) {
        app.listen(config.port, process.env.IP);
        console.log("Express server started at " + process.env.IP + ":" + config.port);
    } else {
        app.listen(config.port);
        console.log("Express server started at port " + config.port);
    }
});
