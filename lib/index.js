// monkeypatch mongodb require('')
var mongo = require('mongo-mock')
var _require = require('module').prototype.require 
var monkeypatch = require('monkeypatch')
var fs = require('fs')

monkeypatch( require('module').prototype,'require', function(original, modname ){

  // this patch will redirect mongodb to mongo-mock
  if( modname == 'mongodb' ){
    if( !mongo.inited ){
      mongo.max_delay = 0
      var MongoClient = mongo.MongoClient || mongo.get('MongoClient')
      var dbfile = process.env.MONGO_DB_FILE || process.cwd()+"/mongodb.js"
      MongoClient.persist= dbfile
      try{
        fs.readFileSync(dbfile)
        console.log("reading "+dbfile)
      }catch (e){
        console.log("creating "+dbfile)
        fs.writeFileSync(dbfile,"module.exports = {}")
      }
      MongoClient.load(dbfile)
      mongo.inited = true
    }
    
    return mongo 
  } 
  return original(modname)

})
