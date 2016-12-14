var log = require('../log')
var crypter = require('../crypter')
var us = require('./db').create('user')
us.blueprint = {
	username: '',
	password: '',
	email: ''
}
us.resolveId = function(username){
	return username.toUpperCase()
}
us.resolvePassword = function(username, password, cb){
	crypter.encrypt(password, us.resolveId(username), cb)
}
us.isUnique = function(username, cb){
	us.findOne({_id: us.resolveId(username)}, function(err, doc){
		cb(err, doc? false: true)
	})
}

us.login = function(username, password, cb){
	us.resolvePassword(username, password, function(err, password){
		us.findOne({_id: us.resolveId(username), password: password}, function(err, doc){
			cb(err, doc? true: false, doc)
		})
	})
}

module.exports = us
