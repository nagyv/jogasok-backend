var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;


var BerletSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    alkalmak: {
        type: Number,
        min: 0,
        default: 0
    },
    felhasznalva: [Date]
});
BerletSchema.pre('save' , function(next) {
    if (this.start_date >= this.end_date) {
        next(new Error('Start date should be before end date.'));
    } else {
        next();
    }
}, 'Start date should be before end date.');
BerletSchema.methods.isValid = function() {
    var now = Date.now();
    if (this.alkalmak > 0 && this.felhasznalva.length >= this.alkalmak) {
        return false;
    } else if (this.alkalmak === 0 && (this.start_date > now || this.end_date < now)) {
        return false;
    } else {
        return true;
    }
};
BerletSchema.methods.hasznal = function(date, cb) {
    if (this.isValid()) {
        this.felhasznalva.push(date);
        if(typeof this.ownerDocument == 'undefined') {
            this.save(cb);
        } else {
            this.ownerDocument().save(cb);
        }
    } else {
        cb(new Error('A berlet nem ervenyes'));
    }
};

var JogasSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    nick: {
        type: String
    },
    email: {
        type: String
    },
    berletek: [BerletSchema]
});

/**
 * Validations
 */
JogasSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

JogasSchema.virtual('berlet').get(function(){
    var berlet = false;
    for(var i=0; i<this.berletek.length; i++) {
        if(this.berletek[i].isValid()) {
            berlet = this.berletek[i];
            break;
        }
    }
    return berlet;
});

mongoose.model('Berlet', BerletSchema);
mongoose.model('Jogas', JogasSchema);