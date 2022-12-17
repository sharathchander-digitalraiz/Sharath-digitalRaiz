const  config = require('config');
var mongoose = require('mongoose');
var dbUrl = config.get('connection');
const { MongoClient } = require('mongodb');
const uri = dbUrl;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ghmc").collection("zones");
  console.log(collection);
  // perform actions on the collection object
  client.close();
});