const path = require('path')

const express = require('express')
const w = require('web-app')

const meta = require('./package')

w.config.load(__dirname)

w.listen((app)=>{
	app.set('views', 'views')
	app.set('view engine', 'pug')
	app.use('/js', express.static(path.join('views', 'js')))
	app.use('/js', express.static(path.join('node_modules', 'jquery', 'dist')))
	app.use(express.static(path.join('node_modules', 'tether', 'dist')))
	app.use(express.static(path.join('node_modules', 'bootstrap', 'dist')))
	app.use(express.static(path.join('node_modules', 'font-awesome')))
	app.use('/js', express.static(path.join('node_modules', 'two.js', 'build')))
	
	app.locals = {}
	for(var f in meta)
		app.locals[f] = meta[f]
	for(var f in w.config)
		app.locals[f] = w.config[f]

	app.get('/', (req, res)=>{
		res.render('index')
	})
}, (err, app)=>{
	if(err) throw err
	w.log.info('Launched', w.config.name)
})
