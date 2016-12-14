var crypto = require('crypto')

var us = {}

us.encrypt = function(value, secret, cb){
	var cipher = crypto.createCipher('aes192', secret)
	var encrypted = ''

	cipher.on('readable', function(){
		var data = cipher.read()
		if(data)
			encrypted += data.toString('hex')
	})
	cipher.on('end', function(){
		cb(undefined, encrypted)
	})
	cipher.write(value)
	cipher.end()
}

module.exports = us