var mongo = require('mongodb').MongoClient
var tingo = require('tingodb')().Db

var us = {}
us.collections = {}
us.tingo = false
us.mongo = false
us.init = function(location, cb){
  if(location.match(/mongodb/i)){
  	mongo.connect(location, function(err, db){
  		if(err) return cb(err)
  		us.db = db
      us.mongo = true
  		if(cb) cb()
  	})
  }else{
    us.db = new tingo(location, {})
    us.tingo = true
    if(cb) cb()
  }
	return us
}
us.create = function(name){
	var c = us.collections[name]
	if(c)
		throw new Error('Collection already exists ' + name)
	c = us.collections[name] = us.db.collection(name)
	return c
}
module.exports = us
