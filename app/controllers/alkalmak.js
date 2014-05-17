/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Jogas = mongoose.model('Jogas'),
    Alkalom = mongoose.model('Alkalom'),
    _ = require('underscore');


/**
 * Find alkalom by id
 */
exports.alkalom = function(req, res, next, id) {
    Alkalom.findById(id).populate('resztvevok', 'name nick').exec(function(err, alkalom) {
        if (err) return next(err);
        if (!alkalom) return next(new Error('Failed to load alkalom ' + id));
        req.alkalom = alkalom;
        next();
    });
};

/**
 * Create a alkalom
 */
exports.create = function(req, res) {
    var alkalom = new Alkalom(req.body);

    alkalom.save(function(err) {
        if (err) {
            res.jsonp({error: err.errors});
        } else {
            res.jsonp(alkalom);
        }
    });
};

/**
 * Update a alkalom
 */
exports.update = function(req, res) {
    var alkalom = req.alkalom;

    alkalom = _.extend(alkalom, req.body);

    alkalom.save(function(err, alkalom) {
        res.jsonp(alkalom);
    });
};

/**
 * Delete an alkalom
 */
exports.destroy = function(req, res) {
    var alkalom = req.alkalom;

    alkalom.remove(function(err) {
        if (err) {
            res.jsonp({error: err.errors});
        } else {
            res.jsonp(alkalom);
        }
    });
};

/**
 * Show an alkalom
 */
exports.show = function(req, res) {
    res.jsonp(req.alkalom);
};

/**
 * List of Alkalom
 */
exports.all = function(req, res) {
    Alkalom.find().sort('-created').limit(10).select('tartja segiti location starts').exec(function(err, alkalmak) {
        if (err) {
            res.jsonp({error: err.errors});
        } else {
            res.jsonp(alkalmak);
        }
    });
};

exports.addResztvevo = function(req, res) {
    Jogas.findById(req.query.jogas, function(err, jogas){
        req.alkalom.addResztvevo(jogas, function(err, alkalom) {
            if(err) {
                res.jsonp({error: err.errors});
            } else {
                if(jogas.berlet) {
                    jogas.berlet.hasznal(alkalom, function(err, berlet) { });
                }
                res.jsonp(alkalom);
            }
        });
    });
};
