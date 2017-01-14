const express = require('express')
const w = require('web-app')

const router = new express.Router()

router.post('/register', (req, res)=>{
	w.register.register(req.body.username, req.body.email, req.body.password, req.origin? req.origin: 'http://localhost', (err, success)=>{
		if(err) return res.status(500).send(err.toString())
		res.send('Successfully registered. Check your email for registration code.')
	})
})
router.get('/activate', (req, res)=>{
	res.render('activate')
})
router.post('/activate', (req, res)=>{
	w.register.activate(req.body.username, req.body.code, (err, success)=>{
		if(err) return res.status(500).send(err.toString())
		res.send('Successfully activated. You can login now.')
	})
})
router.post('/login', (req, res)=>{
	w.user.login(req.body.username, req.body.password, (err, success, data)=>{
		if(err) return res.status(500).send(err.toString())
		req.session.user = data
		res.send(true)
	})
})
router.all('/logout', (req, res)=>{
	delete req.session.user
	res.redirect('/')
})

module.exports = router
