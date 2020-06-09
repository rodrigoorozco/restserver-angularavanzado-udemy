var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==========================
//  Verificar token  MIDDLEWARE
// ==========================


exports.verifyToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                success: false,
                data: 'Invalid token',
                error
            });
        };

        req.user = decoded.user;
        next();

    });
}