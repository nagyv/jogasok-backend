/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Jogas = mongoose.model('Jogas'),
    Berlet = mongoose.model('Berlet'),
    _ = require('underscore');


/**
 * Find jogas by id
 */
exports.jogas = function(req, res, next, id) {
    Jogas.findById(id, function(err, jogas) {
        if (err) return next(err);
        if (!jogas) return next(new Error('Failed to load jogas ' + id));
        req.jogas = jogas;
        next();
    });
};

/**
 * Create a jogas
 */
exports.create = function(req, res) {
    var jogas = new Jogas(req.body);

    jogas.save(function(err) {
        if (err) {
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(jogas);
        }
    });
};

/**
 * Update a jogas
 */
exports.update = function(req, res) {
    var jogas = req.jogas;

    jogas = _.extend(jogas, req.body);

    jogas.save(function(err) {
        res.jsonp(jogas);
    });
};

/**
 * Delete an jogas
 */
exports.destroy = function(req, res) {
    var jogas = req.jogas;

    jogas.remove(function(err) {
        if (err) {
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp({});
        }
    });
};

/**
 * Show an jogas
 */
exports.show = function(req, res) {
    res.jsonp(req.jogas);
};

/**
 * List of Jogasok
 */
exports.all = function(req, res) {
    Jogas.find().populate('alkalmak').sort('-created').exec(function(err, jogasok) {
        if (err) {
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(jogasok);
        }
    });
};

exports.ujBerlet = function(req, res) {
    var berlet = new Berlet(req.query);
    berlet.save(function(err, berlet){
        if (err) {
            return res.jsonp({errors: err.errors});
        } else {
            req.jogas.berletek.push(berlet);
            req.jogas.save(function(err, jogas){
                if (err) {
                    res.jsonp({errors: err.errors});
                } else {
                    res.jsonp(jogas);
                }
            });
        }
    });
};
