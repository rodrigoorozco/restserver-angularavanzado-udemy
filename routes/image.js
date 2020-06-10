var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:collection/:img', (req, res, next) => {
    var collection = req.params.collection;
    var img = req.params.img;

    var imagePath = path.resolve(__dirname, `../uploads/${collection}/${img}`);
    var noImagePath = path.resolve(__dirname, `../assets/noImage.png`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = app;