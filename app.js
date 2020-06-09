//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');


//Init variables
var app = express();
// Body parser application/x-www-form*urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Conection
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos Online`);

});


//Import routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Listen requests
app.listen(3000, () => {
    console.log('Express server running on port 3000:', ' ONLINE');
});