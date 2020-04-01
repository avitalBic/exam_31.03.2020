/*
    check the bag    
*/
var express = require('express');
var router = express.Router();
//
const geolib = require('geolib');
const NodeGeocoder = require('node-geocoder');
const mysql = require('mysql');
const destinationInfo = require('./destinationInfo');

// ~~~~~ conected to db

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'my_db'
  })

function connectDB()
{
    // #2
    db.connect((err)=>{
    if(err){
        console.log("my sql1 "+ err);
    }
    else
    console.log('mysql connected...');
    });
}


// ---- geocoder
const options = {
    provider: 'opencage',
    apiKey: 'f38ed112d9d940c1b6d4364d38f0c429'
    // apiKey: 'c4937e2220aa4333b5a36c5113bf3dbb',
    };

const geocoder = NodeGeocoder(options);

// https://api.opencagedata.com/geocode/v1/json?q=PLACENAME&key=YOUR-API-KEY
// ------------- geocoder
// async -> find latLon
let fun = async function getLanLon(city)
{
    try{
    // TODO: 
        // endcases (if city doesnt exist)
        const res = await geocoder.geocode(city);
        if (res.length==0){
            console.log("invalid city name")
            return -1;
        }
        var obj = {
            lat: res[0].latitude,
            lon: res[0].longitude
        };
        console.log("lat - ",city ,obj.lat)
        console.log("lon - ",city ,obj.lon)
        return obj;
    }catch(err){
        console.log(err.code)
    }
}
// -----

// const promise1 = new Promise(function(resolve, reject) 
// {    
    // function findKm(city1,city2)
    // function findKm()
let d = async function findKm(city1,city2)
{

    // cities
    // connectDB();
    fun(city1).then(
        (object1) =>{
            //
            fun(city2).then((object2) =>{
                console.log("after async: "+ object1.lat 
                + " " + object1.lon +" " +object2.lat+ " "+ object2.lon)
                
            // get distance
            let a = geolib.getPreciseDistance(
                { latitude: object1.lat, longitude: object1.lon },
                { latitude: object2.lat, longitude: object2.lon }
                );
                console.log(a);
                const km = geolib.convertDistance(a, 'km'); // convert to km
                console.log("km:", km)
            
            // --------- insert to db:
            const qInsert =`insert into Distance(km,locationA,locationB,counterAB,counterBA)value( ${km}, "${city1}" ,"${city2}",7,0)`;
            //  *TODO: update the counter

            console.log("quert is \n",qInsert,"\n");
            db.query(qInsert);

            return km;
            //   #######!!
            // await const z =km;
            //
             endCon();
            })
        } );
}
// });
function updateCounter(source,obj)
{
    let counter = 0;
    let nameC = ""
    if (obj.locationA == source){
        nameC = "counterAB";
        counter = obj.counterAB +1;
    }
    else{
        nameC = "counterBA";
        counter = obj.counterBA +1;

    }
        


    const qUpdate =`UPDATE Distance SET ${nameC} = ${counter} WHERE distance_id = ${obj.distance_id}`;
    console.log("qUpdate is: ", qUpdate)
    db.query(qUpdate);
}


// --------------------- the main code--------------------------------
// const newDes = new destinationInfo()

router.get('/', (req, res)=> 
{
    // connectDB();
    
    const source = req.query.source;
    const destination = req.query.destination;
    // select q (check if the cities alredy existing)
    connectDB();
    const q =  `SELECT * FROM Distance WHERE (locationA = "${destination}" and locationB = "${source}") or(locationA = "${source}" and locationB ="${destination}")`
    console.log("quert is \n",q,"\n");
    db.query(q,(err,result,fields)=>{
        if(!err)
        {   
            // TODO: class
            let kmAnser =0.0;
            if(result.length == 0) // not found
            {

                console.log("not found")

                // findKm(source,destination).then(()=>{
                    d(source,destination).then((kmRes)=>{
                    console.log("end async");
                    res.send({"synnnnnnn" : kmRes})
                     // find distance
                });
                
            }
            else{ // found
                console.log("found")
                kmAnser = result[0].km;
                updateCounter(source,result[0]);
                res.send({"distance ": kmAnser}).status(200);
                
            }
        }
        else // err cocection to DB
        {
            d(source,destination).then((kmRes)=>{
                console.log("end async");
                res.send({"synnnnnnn" : kmRes})
                 // find distance
            });
            // res.end("fail", err.code).status(400);

        }
        console.log("result");
    });
    // async - if not found
    // akk the code
    console.log("after!!!!!!!");
    // end thw get
    // res.send("end get");
    // db.end()
});

module.exports = router;









