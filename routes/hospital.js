var express = require('express');
var mdAuthentication = require('../middlewares/authentication');
var app = express();
var Hospital = require('../models/hospital');


// ==========================
//  Get all hospitals
// ==========================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec((error, data) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    data: 'Database error on load hospital',
                    error
                });
            }

            Hospital.count({}, (error, count) => {
                res.status(200).json({
                    success: true,
                    count,
                    data
                });
            })


        });
});



// ==========================
//  Update Hospital
// ==========================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error, data) => {


        if (error) {
            return res.status(500).json({
                success: false,
                data: 'Database error on find hospital',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'Hospital with id ' + id + ' do not exist'
            });
        }

        data.name = body.name;
        data.user = req.user._id;


        data.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    data: 'Error on Hospital update',
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
//  Create a Hospital
// ==========================
app.post('/', mdAuthentication.verifyToken, (req, res, next) => {
    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id,
    });

    hospital.save((error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on save hospital',
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
//  Delete a hospital
// ==========================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, data) => {
        if (error) {
            return res.status(400).json({
                success: false,
                data: 'Database error on delete hospital',
                error
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                data: 'Hospital with id ' + id + ' do not exist'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    });
})


module.exports = app;