const express = require('express');
const app = express();
const path = require('path');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const db = require('./routes/db');
const pageRouter = require('./routes/pages');  
var mysql = require('mysql');
dotenv.config({path: './.env'});
app.use(express.json());



const port = 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs(
  {
    defaultLayout: 'main',
    layoutsDir: path.resolve(__dirname, './views/layouts/'),
    partialsDir: path.resolve(__dirname, './views/partials/'),
    helpers: {
      section: function(name, options) { 
        if (!this._sections) this._sections = {};
          this._sections[name] = options.fn(this); 
          return null;
        }
    } 
  }
));
app.set('view engine', 'handlebars');

// Routers
app.use('/', pageRouter); 
app.use('/', db);
app.use(cookieParser());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'userdb'
});
connection.connect(function(err){
if(!err) {
    console.log( "Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection;

// Errors => page not found 404
app.use((req, res, next) =>  {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});


app.listen(port, () => {
  console.log("Server is On ", `${port}`);
});
module.exports = app;