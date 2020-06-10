var express = require('express');
var app = express();
var Hospital = require('../models/hospital')
var Doctor = require('../models/doctor')
var User = require('../models/user')


// =======================
// Searh on Todo
// =======================
app.get('/collection/:model/:searchParam', (req, res) => {
    var searchParam = req.params.searchParam;
    var model = req.params.model;
    var regex = new RegExp(searchParam, 'i');

    var promise;

    switch (model) {
        case 'user':
            promise = searchUsers(searchParam, regex);
            break;

        case 'doctor':
            promise = searchUsers(searchParam, regex);
            break;

        case 'hospital':
            promise = searchUsers(searchParam, regex);
            break;

        default:
            return res.status(400).json({
                success: false,
                data: 'Search types are: user, hospital and doctor'
            });
            break;
    }

    promise.then((data => {
        return res.status(200).json({
            success: true,
            data
        });
    }))



});


// =======================
// Searh on Todo
// =======================

app.get('/todo/:searchParam', (req, res, next) => {
    var searchParam = req.params.searchParam;
    var regex = new RegExp(searchParam, 'i');

    Promise.all([
        searchHospitals(searchParam, regex),
        searchDoctors(searchParam, regex),
        searchUsers(searchParam, regex),
    ]).then(resp => {
        res.status(200).json({
            success: true,
            hospitals: resp[0],
            doctors: resp[1],
            users: resp[2]
        });
    })



});


function searchHospitals(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email role')
            .exec((error, data) => {
                if (error) {
                    reject('Error on load hospitals', error);
                }

                resolve(data);
            })
    })

}

function searchDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email role')
            .populate('hospital')
            .exec((error, data) => {
                if (error) {
                    reject('Error on load doctors', error);
                }

                resolve(data);
            })
    })

}


function searchUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{ name: regex }, { email: regex }])
            .exec((error, data) => {
                if (error) {
                    reject('Error on load users', error);
                }

                resolve(data);
            });
    })

}

module.exports = app;