const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const debug = require('debug')('app:server');
const util = require('./util/helper');

require('dotenv').config()
debug("Environment variables loaded");

const app = express();


app.use(express.urlencoded({extended: true})); 
app.use(express.json());  

const auth = require("./routes/auth");
const ui = require("./routes/ui");
debug("Routes loaded");


app.use(express.static('public'));
app.set("views", path.join(__dirname, "../views"));
app.set('view engine', 'hbs')
debug("HBS set as view engine.");



app.use(auth); 
app.use(ui);


app.listen(3000, util.logImportantURLs);