var express = require('express')
var router = new express.Router()

var log = require('../log')
var register = require('../db/tmp/register')
var user = require('../db/user')

router.post('/register', function(req, res){
	register.register(req.body.username, req.body.email, req.body.password, req.origin? req.origin: 'http://localhost', function(err, success){
		if(err) return res.status(500).send(err.toString())
		res.send('Successfully registered. Check your email for registration code.')
	})
})
router.get('/activate', function(req, res){
	res.render('activate')
})
router.post('/activate', function(req, res){
	register.activate(req.body.username, req.body.code, function(err, success){
		if(err) return res.status(500).send(err.toString())
		res.send('Successfully activated. You can login now.')
	})
})
router.post('/login', function(req, res){
	user.login(req.body.username, req.body.password, function(err, success, data){
		if(err) return res.status(500).send(err.toString())
		req.session.user = data
		res.send(true)
	})
})
router.all('/logout', function(req, res){
	delete req.session.user
	res.redirect('/')
})

module.exports = router
