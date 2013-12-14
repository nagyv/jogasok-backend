/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    User = mongoose.model('User'),
    Alkalom = mongoose.model('Alkalom'),
    Jogas = mongoose.model('Jogas'),
    jogasok = require('../../app/controllers/jogasok');

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
    describe('Controller jogasok:', function() {
        beforeEach(function() {
            jogas = new Jogas({
                name: 'Kiss Attila',
                nick: 'kicsi'
            });
        });

        it('method jogas loads req.jogas', function(done){
            var req={};
            jogas.save(function(err){
                jogasok.jogas(req, {}, function(){
                    req.jogas.should.be.instanceOf(Jogas);
                    done();
                }, jogas.id);
            });
        });

        it('method create creates a new Jogas', function(done) {
            jogasok.create({body: {
                name: 'my name'
            }}, getRes(function(data){
                should.not.exist(data.errors);
                data.should.be.instanceOf(Jogas);
                done();
            }));
        });

        xit('method all returns all', function(done){
            jogasok.all({}, getRes(function(data){
                should.not.exist(data.errors);
                data.length.should.eql(1);
                done();
            }));
        });

        describe('with jogas', function(){
            var getReq;
            beforeEach(function(done){
                jogas.save(function(err, jogas){
                    var req = {
                        jogas: jogas
                    }
                    getReq = function(body) {
                        req.body = body
                        return req;
                    }
                    done();
                })
            })

            it('update updates a Jogas', function(done){
                jogasok.update(getReq({
                        email: 'me@me.me',
                    }), getRes(function(data){
                        should.not.exist(data.errors);
                        data.should.be.instanceOf(Jogas);
                        data.email.should.eql('me@me.me')
                        done();
                    }));
            });

            it('destroy should remove Jogas', function(done){
                jogasok.destroy(getReq(), getRes(function(data){
                    should.not.exist(data.errors);
                    done();
                }))
            })

            it('show should return Jogas', function(done){
                jogasok.show(getReq({}), getRes(function(data){
                    data.should.equal(getReq({}).jogas);
                    done();
                }));
            })

            it('should create uj Berlet', function(done){
                jogasok.ujBerlet(getReq({
                    alkalmak: 10
                }), getRes(function(data){
                    should.not.exist(data.errors);
                    data.should.be.instanceOf(Jogas);
                    done();
                }))
            })
        })

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
