//Requires
var express = require('express');
var mongoose = require('mongoose');

//Init variables
var app = express();

//DB Conection
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log(`Base de datos Online`);

});


//Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'Peticion realizada correctamente'
    });
});


// Listen requests
app.listen(3000, () => {
    console.log('Express server running on port 3000:', ' ONLINE');
});