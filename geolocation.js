/*
Avital Bichman

*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); 
const distance = require('./distance.js');
const popularsearch= require('./popularsearch.js');
const health= require('./health.js');



app.use(bodyParser.json({extended: false}))


app.get('/', function(req, res) 
{
    try{
        res.send("wellcome to geoLocation");
    }
    catch(err){
        res.json({massege: err});
    }
});

app.get('/hello', function(req, res) 
{
    try{
        res.status(200).end();
    }
    catch(err){
        res.json({massege: err});
    }
});

// resource
app.use('/distance',distance);   
app.use('/popularsearch',popularsearch); 
app.use('/health',health); 





app.listen(8080);
