var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var User = require('../models/user');
var Doctor = require('../models/doctor');
var hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:collection/:id', (req, res, next) => {

    var collection = req.params.collection;
    var id = req.params.id;

    //Check collection names
    var validCollections = ['user', 'hospital', 'doctor'];

    if (validCollections.indexOf(collection) < 0) {
        return res.status(400).json({
            success: false,
            data: 'Invalid collection. <Valid collection:' + validCollections.join(',') + '>'
        });
    }

    if (!req.files) {
        return res.status(400).json({
            success: false,
            data: 'There are not files to upload'
        });
    }

    // Get filename
    var file = req.files.image;
    var nameSplited = file.name.split('.');
    var extension = nameSplited[nameSplited.length - 1];

    //Valid extensiones
    var validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            success: false,
            data: 'Invalid extension. <Valid extensions:' + validExtensions.join(',') + '>'
        });
    }

    //custom filename
    var filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // move file from temporal to path
    var path = `./uploads/${collection}/${filename}`;
    file.mv(path, (error) => {
        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Error while file was moving',
                error
            });
        }
    })

    uploadByCollection(collection, id, filename, res)



    // res.status(200).json({
    //     success: true,
    //     data: 'File uploaded'
    // });
});


function uploadByCollection(collection, id, filename, res) {

    if (collection === 'user') {
        User.findById(id, (error, data) => {
            if (!data) {
                return res.status(400).json({
                    success: false,
                    data: 'Data not found in collection',
                    error
                });
            }

            var oldPath = './uploads/user/' + data.img;
            console.log(oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath, (error) => {
                    return res.status(500).json({
                        success: false,
                        data: 'Error while old file was deleting',
                        error
                    });
                });
            }

            data.img = filename;
            data.save((error, updatedData) => {
                updatedData.password = ":D";
                res.status(200).json({
                    success: true,
                    data: updatedData

                });
            })

        })
    }

    if (collection === 'doctor') {
        Doctor.findById(id, (error, data) => {
            if (!data) {
                return res.status(400).json({
                    success: false,
                    data: 'Data not found in collection',
                    error
                });
            }

            var oldPath = './uploads/doctor/' + data.img;
            console.log(oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath, (error) => {
                    return res.status(500).json({
                        success: false,
                        data: 'Error while old file was deleting',
                        error
                    });
                });
            }

            data.img = filename;
            data.save((error, updatedData) => {
                res.status(200).json({
                    success: true,
                    data: updatedData

                });
            })

        })

    }

    if (collection === 'hospital') {
        Hospital.findById(id, (error, data) => {
            if (!data) {
                return res.status(400).json({
                    success: false,
                    data: 'Data not found in collection',
                    error
                });
            }

            var oldPath = './uploads/hospital/' + data.img;
            console.log(oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath, (error) => {
                    return res.status(500).json({
                        success: false,
                        data: 'Error while old file was deleting',
                        error
                    });
                });
            }

            data.img = filename;
            data.save((error, updatedData) => {
                res.status(200).json({
                    success: true,
                    data: updatedData

                });
            })

        });


    }
}

module.exports = app;