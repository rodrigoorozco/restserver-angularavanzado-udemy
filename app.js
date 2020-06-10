//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/image');


//Init variables
var app = express();


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body parser application/x-www-form*urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Conection
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos Online`);

});

//Server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));



//Import routes
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/image', imagesRoutes);
app.use('/', appRoutes);

// Listen requests
app.listen(3000, () => {
    console.log('Express server running on port 3000:', ' ONLINE');
});