var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');

router.use(bodyParser.json({extended: false}));

// ---- endCon
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

// -- DB 
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'my_db'
  })

  db.connect((err)=>{
    if(err){
        console.log("my sql1 "+ err);
        
    }
    else
    console.log('mysql connected...');
  });

// 
router.get('/', (req, res)=> 
{
    try{
        // const obj = {"source": "theSource", "destination": "theDestination", "hits": totalNumberOfHits}
        const q =  `SELECT * FROM Distance`
        console.log("quert is \n",q,"\n");
        db.query(q,(err,result,fields)=>{
            if(!err)
            {
                endCon(); // end conection
                // found the max
                let data = result.map((item)=> {
                    return counterAB = item.counterAB;

                    //TODO: find the resource and destination


                    // id = item.distance_id;
                    // return {
                    // km: item.km,
                    // distance_id: item.distance_id
                    // }
                });
                console.log(data)
                // data.forEach(element => {
                //     console.log("id", element.id)
                // });
                max = Math.max.apply(null, data);
                console.log(max)

                
                const obj = {"source": "theSource", "destination": "theDestination", "hits": max}
             
                res.send(obj);
            }
            else{
                res.end(err.code);
            }

        });

    }catch(err){
        res.end("err" , err.code);
    }
});

module.exports = router;
