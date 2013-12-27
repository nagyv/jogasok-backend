var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

var AlkalomSchema = new Schema({
	created: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date
    },
    location: {
        type: String
    },
    tartja: {
        type: String
    },
    segiti: {
        type: String
    },
    resztvevok: [{
        type: Schema.ObjectId,
        ref: 'Jogas'
    }]
});

/**
 * Validations
 */
AlkalomSchema.path('date').validate(function(date) {
    return date.length;
}, 'Date cannot be blank');

AlkalomSchema.path('tartja').validate(function(tartja) {
    return tartja.length;
}, 'Jogatarto cannot be blank');

AlkalomSchema.methods.addResztvevo = function(resztvevo, cb) {
    var that = this;
    this.resztvevok.push(resztvevo);
    return resztvevo.addAlkalom(this, function(jogas) {
        that.save(cb);
    });
    // return this.save(cb);
};

mongoose.model('Alkalom', AlkalomSchema);