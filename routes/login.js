var express = require('express');
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);


var app = express();
var User = require('../models/user');


// ====================
//  Google Sign In
// ====================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleuser = await verify(token)
        .catch(error => {
            return res.status(403).json({
                success: false,
                data: 'Google token invalid',
            });
        });

    User.findOne({ email: googleuser.email }, (error, userDB) => {
        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Error on find user',
                error
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    success: false,
                    data: 'You have to use the basic authentication'
                });
            } else {
                var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });


                return res.status(200).json({
                    success: true,
                    data: userDB,
                    id: userDB.id,
                    token
                })
            }
        } else {
            var user = new User();
            user.name = googleuser.name;
            user.email = googleuser.email;
            user.emg = googleuser.emg;
            user.google = true;
            user.password = ':D';

            user.save((error, userDB) => {
                var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

                return res.status(200).json({
                    success: true,
                    data: userDB,
                    id: userDB.id,
                    token
                })

            })
        }

    })



});


// Basic authentication
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