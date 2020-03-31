// 
// #1
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); 

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


app.listen(8080);
