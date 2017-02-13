zero-complexity flat-filebased mongodb replacement, no need to run mongodb instance

[![CircleCI](https://circleci.com/gh/coderofsalvation/mongodb-filebased.svg?style=svg)](https://circleci.com/gh/coderofsalvation/mongodb-filebased)

## Usage

This will redirect all mongodb data to a `mongodb.js` file:

    require('mongodb-filebased')     // <--- add this above your mongodb-require
    require('mongodb')

> NOTE: this is not a full implementation of mongodb, but it 'seems' to work for 
most mongoose/mongodb CRUD cases.

## Features

* store all collections in databasefile
* default databasefile is `mongodb.js` (or environment var `MONGO_DB_FILE`)
* switch to real mongodb by just commenting the magic line

