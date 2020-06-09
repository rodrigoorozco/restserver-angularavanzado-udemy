var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        data: 'Peticion realizada correctamente'
    });
});

module.exports = app;