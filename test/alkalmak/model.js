/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Alkalom = mongoose.model('Alkalom'),
    Jogas = mongoose.model('Jogas');

//Globals
var user;
var jogas;
var alkalom;

//The tests
describe('<Unit Test>', function() {
    describe('Model Alkalom:', function() {
        beforeEach(function(done) {
            jogas = new Jogas({
                name: 'Kiss Attila',
                nick: 'kicsi'
            });
            alkalom = new Alkalom({
                date: Date.now(),
                location: 'itt',
                tartja: 'Sisi',
                segiti: 'Bika'
            })
            jogas.save(function(err){
                done();
            })
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return alkalom.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
        xdescribe('Method addResztvevo', function(){
            it('should be able to handle more people', function(done) {
                return alkalom.save(function(err) {
                    alkalom.addResztvevo(jogas._id, function(err){
                        should.not.exist(err);
                        alkalom.resztvevok.should.eql([jogas._id]);
                        done();
                    });
                });
            });
        });

        afterEach(function(done) {
            Jogas.remove({});
            User.remove({});
            done();
        });
        after(function(done){
            Jogas.remove().exec();
            User.remove().exec();
            done();
        });
    });
});
