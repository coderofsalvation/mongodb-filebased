zero-complexity filebased mongodb, no need to run mongodb instance

![Build Status](https://travis-ci.org/--js.svg?branch=master)

## Usage

This will redirect all mongodb data to a `mongodb.js` file:

    require('mongodb-filebased')     // <--- add this above your mongodb-require
    require('mongodb')

## Features

* store all collections in databasefile
* default databasefile is `mongodb.js` (or environment var `MONGO_DB_FILE`)
* switch to real mongodb by just commenting the magic line
