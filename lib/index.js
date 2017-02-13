// monkeypatch mongodb require('')
var mongoOriginal = require('mongodb')
var mongo = require('mongo-mock')
var ObjectId = require('bson-objectid')
var fs = require('fs')
var _require = require('module').prototype.require 
var EventEmitter = require('events')
var monkeypatch = require('monkeypatch')
var fs = require('fs')

var url = 'mongodb://localhost:27017/myproject';

module.exports = function(cb){

  var MongoClient = mongo.MongoClient || mongo.get('MongoClient')
  MongoClient.connect(url,  {},  function(err,  db) {

    monkeypatch( require('module').prototype,'require', function(original, modname ){

      // this patch will redirect mongodb to mongo-mock
      if( modname == 'mongodb' ){
        if( !mongo.inited ){
          mongo.max_delay = 0
          var dbfile = process.env.MONGO_DB_FILE || process.cwd()+"/mongodb.js"
          MongoClient.persist= dbfile
          mongo.ObjectId = require('bson-objectid')
          var Db = require('mongo-mock/lib/db.js')
          var Server
          mongo.Db = function(name, server, opts){ return db }
          // some mongoose specific patches
          var Collection = require('mongo-mock/lib/collection.js')
          var initPrototypes = function(obj){
            var col = new Collection({}, {name:""})
            var mocks = [
              "hit",
              "writeConcern",
              "aggregate",
              "bulkWrite",
              "count",
              "createIndexes",
              "deleteMany",
              "deleteOne",
              "distinct",
              "drop",
              "dropIndex",
              "dropIndexes",
              "findAndModify",
              "findAndRemove",
              "findOneAndDelete",
              "findOneAndReplace",
              "findOneAndUpdate",
              "geoHaystackSearch",
              "geoNear",
              "group",
              "indexExists",
              "indexes",
              "initializeOrderedBulkOp",
              "initializeUnorderedBulkOp",
              "insertMany",
              "insertOne",
              "isCapped",
              "listIndexes",
              "mapReduce",
              "options",
              "parallelCollectionScan",
              "reIndex",
              "rename",
              "replaceOne",
              "save",
              "stats", 
              "updateMany",
              "updateOne"
            ]
            for ( var i in col  ) if( mocks.indexOf(i) == -1 ) obj.prototype[i] = col[i]
            mocks.map(function(m){ 
              obj.prototype[m] = obj[m] = function(m){
                console.log("mongo-mock: not implemented '"+ m+"': "+obj[m].toString())
                return true
              }.bind({}, m)
            })
          }
          initPrototypes(Collection)
          mongo.Collection = Collection

          try{
            fs.readFileSync(dbfile)
            console.log("reading "+dbfile)
          }catch (e){
            console.log("creating "+dbfile)
            fs.writeFileSync(dbfile,"module.exports = {}")
          }
          MongoClient.load(dbfile)
          mongo.Server = function(){ 
            var obj = new EventEmitter()
            return {
              databases: {}, 
              s: { server: obj }
            }
          }
          mongo.inited = true
        }
        
        return mongo 
      } 
      return original(modname)

    })
    cb()

  })
}
