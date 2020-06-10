var express = require('express');
var mdAuthentication = require('../middlewares/authentication');
var app = express();
var Doctor = require('../models/doctor');


// ==========================
//  Get all doctors
// ==========================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((error, data) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    data: 'Database error on load Doctors',
                    error
                });
            }

            Doctor.count({}, (error, count) => {
                res.status(200).json({
                    success: true,
                    count,
                    data
                });
            });


        });
});



// ==========================
//  Update Doctor
// ==========================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (error, data) => {


        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Database error on find doctor',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'Doctor with id ' + id + ' do not exist'
            });
        }

        data.name = body.name;
        data.user = req.user._id;
        data.hospital = body.hospital;


        data.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    data: 'Error on Doctor update',
                    error
                });
            }

            res.status(200).json({
                success: true,
                data
            });
        })


    })

});

// ==========================
//  Create a Doctor
// ==========================
app.post('/', mdAuthentication.verifyToken, (req, res, next) => {
    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on save doctor',
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
//  Delete a doctor
// ==========================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on delete doctor',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'Doctor with id ' + id + ' do not exist'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    });
})


module.exports = app;