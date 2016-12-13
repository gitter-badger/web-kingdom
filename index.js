var path = require('path')

var express = require('express')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

var log = require('./src/log')
var db = require('./src/db/master')
var config = require('./config')

var port = process.env.PORT || config.port

process.on('uncaughtException', function(err){
	log.error(err.stack)
})

db.init(config.db, function(err){
  if(err) throw err

  var app = express()
  app.set('env', config.test? 'development': 'production')
  app.use(require('morgan')('dev'))
	app.use(session({
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		store: db.mondo? new MongoStore({db: db.db}): null
	}))
  app.set('views', 'pug')
	app.set('view engine', 'pug')
  app.use(express.static(path.join('public')))
	app.use('/js', express.static(path.join('node_modules', 'jquery', 'dist')))
  app.use(express.static(path.join('node_modules', 'tether', 'dist')))
	app.use(express.static(path.join('node_modules', 'bootstrap', 'dist')))
	app.use(express.static(path.join('node_modules', 'font-awesome')))
	app.use('/js', express.static(path.join('node_modules', 'two.js', 'build')))


  app.all('*', function(req, res, next){
		log.warn('404', req.ip, '>', req.url)
		res.status(404).render('error')
	})
	app.use(function(err, req, res, next){
		log.error(err.stack)
		res.status(500).render('error')
	})
  app.listen(port, process.env.IP)
  log.info("Listening at", port)
})
