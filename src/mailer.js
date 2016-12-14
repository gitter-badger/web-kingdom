var mailer = require('nodemailer')
var xoauth2 = require('xoauth2')

var config = require('../config')

var us = {}
us.transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		xoauth2: xoauth2.createXOAuth2Generator(config.email)
	}
})
module.exports = us
