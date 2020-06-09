var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuthentication = require('../middlewares/authentication');

var app = express();
var User = require('../models/user');


// ==========================
//  Get all users
// ==========================
app.get('/', (req, res, next) => {

    User.find({}, 'name email img role')
        .exec((error, data) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    data: 'Database error on load users',
                    error
                });
            }

            res.status(200).json({
                success: true,
                data
            });
        });
});





// ==========================
//  Update User
// ==========================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (error, data) => {


        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Database error on find user',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'User whit id ' + id + ' do not exist'
            });
        }

        data.name = body.name;
        data.email = body.email;
        data.role = body.role;

        data.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    data: 'Error on user update',
                    error
                });
            }

            data.password = ':D';

            res.status(200).json({
                success: true,
                data
            });
        })


    })

});

// ==========================
//  Create a users
// ==========================
app.post('/', mdAuthentication.verifyToken, (req, res, next) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    user.save((error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on save user',
                error
            });
        }



        res.status(201).json({
            success: true,
            data
        });

    });
});


// ==========================
//  Delete a users
// ==========================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on delete user',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'User whit id ' + id + ' do not exist'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    });
})


module.exports = app;