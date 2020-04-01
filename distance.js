var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const geolib = require('geolib');
//
const NodeGeocoder = require('node-geocoder');

router.use(bodyParser.json({extended: false}));


// ~~~~~ conected to db
// #1
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'my_db'
  })

// ~~~~~~~~~~~~~~~~~ function 


// --DB
function endCon(){
    db.end( function(err) {
        if (err) {console.log("Error ending the connection:",err);}
    
       //  reconnect in order to prevent the"Cannot enqueue Handshake after invoking quit"
    
         db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            database: 'my_db'
    
            });
        // callback(null, {
        //     statusCode: 200,
        //     body: response,
    
        // });
    });
}
function conectDB ()
{
     //#2
    db.connect((err)=>{
    if(err){
        console.log("my sql1 "+ err);
    }
    else
    console.log('mysql connected...');
  });
};

////////////////////

//--------------

// to location
const options = {
    provider: 'opencage',
    apiKey: 'c4937e2220aa4333b5a36c5113bf3dbb',
   };

//---

const geocoder = NodeGeocoder(options);

//
let fun = async function getLanLon(city)
{
    // start();
    // .. function start() {
// async    // Using callback
    const res = await geocoder.geocode(city);
    // var  lat = res[0].latitude
    // var lon = res[0].longitude;
    if (res.length==0){
        console.log("invalid city name")
        return -1;
    }
    var obj = {
        lat: res[0].latitude,
        lon: res[0].longitude
    };
    console.log(obj.lat)
    console.log(obj.lon)

    return obj;
    // console.log(lat);

}

function findKm(city1,city2)
{
    fun(city1).then(
        (object1) =>{
            fun(city2).then((object2) =>{
                console.log("aaaa: "+ object1.lat 
                + " " + object1.lon +" " +object2.lat+ " "+ object2.lon)
                
            // get distance
            let a = geolib.getPreciseDistance(
                { latitude: object1.lat, longitude: object1.lon },
                { latitude: object2.lat, longitude: object2.lon }
                );
                console.log(a);
                const km = geolib.convertDistance(a, 'km'); // convert to km
                console.log(km)
            // }  
                
            })
    } );
}
// get the km between the cities

// let afind = getLanLon("telaviv")
// console.log("afinda",afind)


// get the source and distination city> 
router.get('/', (req, res)=> 
{
    try{
        const source = req.query.source;
        const distination = req.query.destination;
        console.log("source ", source)
        console.log("distination ",distination)
        let km = 0.0;
        let data = { "distance": km}

        // TODO: need get km..
        // if (req.query == {}){
        //     console.log("empty")
        // }

        conectDB();
        console.log("cc " ,req.query )
        const q =  `SELECT km,distance_id,counterAB FROM Distance WHERE (locationA = "${distination}" and locationB = "${source}") or(locationA = "${source}" and locationB ="${distination}")`
        console.log("quert is \n",q,"\n");
        db.query(q,(err,result,fields)=>{
            // endCon(); // end conection
            if(!err)
            {
            //    console.log(result[0].km);
            //    result[0],distance_id
                if(result.length == 0){
                    // add to DB
                    console.log("not found");
                    //-------------------------
                    fun(source).then(
                        (object1) =>{
                            fun(distination).then((object2) =>{
                                console.log("aaaa: "+ object1.lat 
                                + " " + object1.lon +" " +object2.lat+ " "+ object2.lon)
                                
                            // get distance
                            let a = geolib.getPreciseDistance(
                                { latitude: object1.lat, longitude: object1.lon },
                                { latitude: object2.lat, longitude: object2.lon }
                                );
                                console.log(a);
                                const km1 = geolib.convertDistance(a, 'km'); // convert to km
                                console.log(km1)
                            // }  
                              
                                const qInsert =`insert into Distance(km,locationA,locationB,counterAB,counterBA)value(37.0, "${source}" ,"${distination}",1,0)`;
                                console.log("quert is \n",qInsert,"\n");
                                db.query(qInsert);
                                endCon();
                                data.distance = km
                                res.send(data);   
                            })    
                    } );
                    // findKm(source,distination) // find km
                    // conectDB();
                    // TODO: counters
                    // const qInsert =`insert into Distance(km,locationA,locationB,counterAB,counterBA)value(37.0, "${source}" ,"${distination}",1,0)`;
                    // console.log("quert is \n",qInsert,"\n");
                    // db.query(qInsert);
                    // endCon();
                    // data.distance = km
                    // res.send(data);

                }
                else{
                    // return the distance
                    console.log("found");
                    km = result[0].km;
                    data.distance = km
                    //update counter
                    // conectDB();
                    let counter = result[0].counterAB +1;
                    const qUpdate =`UPDATE Distance SET counterAB = ${counter} WHERE distance_id = ${result[0].distance_id}`;
                    console.log("qUpdate is: ", qUpdate)
                    // const qUpdate = 'UPDATE Distance(km,locationA,locationB,counterAB,counterBA)value(35.0, "${source}" ,"${distination}",(select counterAB from Users where distance_id = "${result[0].distance_id}"))`;
                    db.query(qUpdate);
                    endCon();
                    res.send(data);
                }
            }
        });
        // res.send(km);
        // res.status(200).end(); // where put
        
    }catch(err){
        res.end("err" , err.code);
    }
});


module.exports = router;


