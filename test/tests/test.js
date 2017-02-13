#!/usr/bin/env node

var t = require('./../lib/util.js')

t.test("see whether require('mongodb') gets patched", function(next, error){

  require('./../../.')(function(){
    var mongo = require('mongodb')
    if( !mongo.MongoClient.persist) process.exit(1)
    process.exit(0)
  })

})

t.run()
