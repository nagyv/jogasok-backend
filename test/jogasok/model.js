/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Berlet = mongoose.model('Berlet'),
    Jogas = mongoose.model('Jogas');

//Globals
var user;
var jogas;
var berlet;

//The tests
describe('<Unit Test>', function() {
    describe('Model Jogas:', function() {
        beforeEach(function(done) {
            jogas = new Jogas({
                name: 'Kiss Attila',
                nick: 'kicsi'
            });
            done();
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return jogas.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without name', function(done) {
                jogas.name = '';

                return jogas.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        describe('Model Berlet', function() {
            beforeEach(function(done){
                berlet = new Berlet({
                    alkalmak: 10
                });
                done();
            });
            it('has path berlet', function(done){
                berlet.save(function(err){
                    should.not.exist(err);
                    jogas.berletek.push(berlet);
                    jogas.berlet.id.should.be.eql(berlet.id);
                    done();
                });
            })
            it('can be attached to a Jogas', function(done){
                berlet.save(function(err){
                    should.not.exist(err);
                    jogas.berletek.push(berlet);
                    jogas.save(function(err){
                        should.not.exist(err);
                        done();
                    });
                });
            });
            it('can be used up if valid', function(done) {
                berlet.save(function(err) {
                    berlet.hasznal(Date.now(), function(err, berlet){
                        should.not.exist(err);
                        should.exist(berlet);
                        berlet.felhasznalva.length.should.equal(1);
                        done();
                    });
                });
            });
            it('can not be used if inValid', function(done) {
                berlet.alkalmak = 1;
                berlet.felhasznalva = [Date.now()];
                berlet.save(function(err) {
                    berlet.hasznal(Date.now(), function(err){
                        should.exist(err);
                        done();
                    });
                });
            });
            describe('alkalomra', function(){
                it('is valid if has alkalom', function(done){
                    berlet.isValid().should.be.ok;
                    done();
                });
                it('is not valid if has no more alkalom', function(done){
                    berlet.alkalmak = 1;
                    berlet.felhasznalva = [Date.now()];
                    berlet.isValid().should.not.ok;
                    done()
                });
            });
            describe('idore', function(){
                beforeEach(function(done){
                    berlet.start_date = Date.now();
                    berlet.end_date = Date.now() + 3600;
                    done();
                });
                it('is valid if date is OK', function(done){
                    berlet.isValid().should.be.ok;
                    done();
                });
                it('is not valid if out of date range', function(done){
                    berlet.alkalmak = 0;
                    berlet.start_date = Date.now() - 1500;
                    berlet.end_date = Date.now() - 1000;
                    berlet.isValid().should.not.ok;
                    done();
                });
            })
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
