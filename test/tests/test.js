#!/usr/bin/env node

var t = require('./../lib/util.js')

require('./../../.')

t.test("see whether require('mongodb') gets patched", function(next, error){

  var mongo = require('mongodb')
  if( !mongo.MongoClient.persist) process.exit(1)
})

t.run()
