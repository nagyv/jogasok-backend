/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Alkalom = mongoose.model('Alkalom'),
    Berlet = mongoose.model('Berlet'),
    Jogas = mongoose.model('Jogas'),
    alkalmak = require('../../app/controllers/alkalmak');

//Globals
var user;
var jogas;
var alkalom;
var getRes = function (cb) {
    return {
        jsonp: cb
    }
}

//The tests
describe('<Unit Test>', function() {
    describe('Controller alkalmak:', function() {
        beforeEach(function(done) {
            jogas = new Jogas({
                name: 'Kiss Attila',
                nick: 'kicsi'
            });
            alkalom = new Alkalom({
                date: Date.now(),
                tartja: 'Sisi'
            });
            jogas.save(function(err){
                done();
            });
        });

        it('method alkalom loads req.alkalom', function(done){
            var req={};
            alkalom.save(function(err){
                alkalmak.alkalom(req, {}, function(){
                    req.alkalom.should.be.instanceOf(Alkalom);
                    done();
                }, alkalom.id);
            });
        });

        it('method create creates a new Alkalom', function(done) {
            alkalmak.create({body: {
                date: Date.now(),
                tartja: 'Sisi'
            }}, getRes(function(data){
                should.not.exist(data.errors);
                data.should.be.instanceOf(Alkalom);
                done();
            }));
        });

        xit('method all returns all', function(done){
            alkalmak.all({}, getRes(function(data){
                should.not.exist(data.errors);
                data.length.should.eql(1);
                done();
            }));
        });

        describe('with alkalom', function(){
            var getReq;
            beforeEach(function(done){
                alkalom.save(function(err, alkalom){
                    var req = {
                        alkalom: alkalom
                    }
                    getReq = function(body) {
                        req.body = body
                        return req;
                    }
                    done();
                })
            })

            it('update updates an Alkalom', function(done){
                alkalmak.update(getReq({
                        location: 'Szeged',
                    }), getRes(function(data){
                        should.not.exist(data.errors);
                        data.should.be.instanceOf(Alkalom);
                        data.location.should.eql('Szeged');
                        done();
                    }));
            });

            it('destroy should remove Alkalom', function(done){
                alkalmak.destroy(getReq(), getRes(function(data){
                    should.not.exist(data.errors);
                    done();
                }))
            });

            it('show should return Alkalom', function(done){
                alkalmak.show(getReq({}), getRes(function(data){
                    data.should.equal(getReq({}).alkalom);
                    done();
                }));
            });

            describe('method addResztvevo', function(){
                it('should add resztvevo', function(done){
                    alkalmak.addResztvevo(getReq(jogas.id), getRes(function(data){
                        should.not.exist(data.errors);
                        data.should.be.instanceOf(Alkalom);
                        data.resztvevok.length.should.eql(1);
                        done();
                    }));
                });
                describe('with berlet', function(){
                    beforeEach(function(done){
                        berlet = new Berlet({
                            alkalmak: 10
                        });
                        jogas.berletek.push(berlet);
                        jogas.save(function(err){
                            done();
                        });
                    });
                    it('should use its Berlet', function(done){
                        alkalmak.addResztvevo(getReq(jogas.id), getRes(function(data){
                            should.not.exist(data.errors);
                            data.should.be.instanceOf(Alkalom);
                            Jogas.findById(jogas.id, function(err, jogas){
                                jogas.berletek[0].felhasznalva.length.should.equal(1);
                                done();
                            });
                        }));
                    });
                });
            });
        });

        afterEach(function(done) {
            Jogas.remove({});
            Berlet.remove({});
            Alkalom.remove({});
            done();
        });
        after(function(done){
            Jogas.remove().exec();
            Berlet.remove().exec();
            Alkalom.remove().exec();
            done();
        });
    });
});
