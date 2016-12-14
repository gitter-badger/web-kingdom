var mailer = require('../../mailer')
var log = require('../../log')
var crypter = require('../../crypter')
var user = require('../user')
var config = require('../../../config')
var us = require('../db').create('register')
us.blueprint = {
	username: '',
	password: '',
	email: '',
	code: ''
}

us.register = function(username, email, password, url, cb){
	if(!username.match(/[a-zA-Z0-9._]+/i)) //check if username is of valid characters
		return cb(new Error('Username is not valid. Has to be at least 1 character, can contain alphanumeric, period (.) and underscore (_) characters only'))
	if(username.length > 32)
		return cb(new Error('Username is not valid. Maximum characters allowed is 32'))
	if(password.length < 8 || password.length > 32)
		return cb(new Error('Password is not valid. Please choose a password between 8 and 32 characters long'))

	var id = user.resolveId(username)
	user.isUnique(username, function(err, unique){ //check if unique username
		if(err){
			log.error(err)
			return cb(new Error("Issue occurred checking if username is unique"))
		}
		if(!unique) return cb(new Error('Username is not unique/already exists'))

		user.resolvePassword(username, password, function(err, password){
			if(err) log.error(err)
			crypter.encrypt(new Date().toString(), id, function(err, code){
				if(err) log.error(err)
				us.update({
					_id: id
				},{
					username: username,
					password: password,
					email: email,
					code: code
				},{
					upsert: true
				}, function(err, res){
					if(err){
						log.error(err)
						return cb(new Error("Issue occurred saving registration code"))
					}
					var activate = url + '/user/activate'
					mailer.transporter.sendMail({
						to: email,
						subject: config.name + ' Registration',
						html: 'This email address was registered for user ' + username + '.<br>'+
							'If this is not you, ignore this email.<br><br>' +
							'To activate your account go to <a href="'+activate+'">' + activate + '</a><br>' +
							'And enter your registration code: <a href="' + activate + '?code=' + code + '&username=' + username + '"">' + code + '</a>'
					}, function(err, data){
						if(err){
							log.error(err)
							return cb(new Error('Issue occurred emailing registration information'))
						}
						cb(undefined, true);
					})
				})
			})
		})
	})
}
us.activate = function(username, code, cb){
	var id = user.resolveId(username)
	us.findOne({_id: id}, function(err, doc){
		if(err)
			log.error(err)
		if(err || !doc)
			return cb(new Error('Issue occurred finding registration information'))
		if(code === doc.code){
			user.insert({
				_id: id,
				username: doc.username,
				password: doc.password,
				email: doc.email
			}, function(err, res){
				if(err){
					log.error(err)
					return cb(new Error('Issue occurred saving user'))
				}
				us.findOneAndDelete({_id: id}, function(err, res){
					if(err) log.error(err)
					cb()
				})
			})
		}else
			cb(new Error('Activation code does not match the one expected'))
	})
}

module.exports = us
