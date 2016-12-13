var us

switch(process.env){
  case 'test':
    us = require('.test/config')
  break
  case 'prod':
    us = require('./prod/config')
  break
  default:
    us = require('./dev/config')
}

module.exports = us
