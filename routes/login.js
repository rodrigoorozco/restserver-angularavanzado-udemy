var express = require('express');
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');


app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (error, data) => {

        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Error on find user',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'Incorrect credentials - email',
                error
            });
        }

        //Verify password
        if (!bcrypt.compareSync(body.password, data.password)) {
            return res.status(400).json({
                success: false,
                data: 'Incorrect credentials - password',
                error
            });
        }

        //CREATE TOKEN!!!
        data.password = ":D";
        var token = jwt.sign({ user: data }, SEED, { expiresIn: 14400 });


        return res.status(200).json({
            success: true,
            data,
            id: data.id,
            token
        })

    })


});


module.exports = app;